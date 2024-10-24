import os
from flask_cors import CORS
from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from svix.webhooks import Webhook, WebhookVerificationError
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, db as firebase_db
from pymongo import MongoClient
from datetime import datetime, timezone,timedelta
from sklearn.preprocessing import StandardScaler
from mailjet_rest import Client


load_dotenv()

cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS_PATH'))
firebase_admin.initialize_app(cred, {
    'databaseURL': os.getenv('FIREBASE_DATABASE_URL')
})

firestore_db = firestore.client()

mongo_client = MongoClient(os.getenv('MONGO_URI'))
mongo_db = mongo_client['sensorData']
sensor_collection = mongo_db['sensors']

app = Flask(__name__)
CORS(app)


@app.route('/api/webhooks', methods=['POST'])
def webhook_handler():
    try:
        payload = request.get_data(as_text=True)
        headers = request.headers

        wh = Webhook(os.getenv('CLERK_WEBHOOK_SECRET_KEY'))
        evt = wh.verify(payload, headers)

        event_type = evt['type']
        user_data = evt['data']
        user_id = user_data.pop('id', None)

        if event_type == 'user.created':
            print(f"User {user_id} was {event_type}")
            print(user_data)
            filtered_data = {
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'email': user_data.get('email_addresses', [{}])[0].get('email_address'),
                'clerk_user_id': user_id,
                'Sensors': [],
            }

            firestore_db.collection('users').document(user_id).set(filtered_data)

        return jsonify({
            'success': True,
            'message': 'Webhook received and user data saved to Firebase'
        }), 200
    except WebhookVerificationError as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

def store_sensor_data_in_mongodb(event):
    sensor_data = event.data
    sensor_id = event.path.strip('/')

    print(f"Received data for {sensor_id}: {sensor_data}")

    if isinstance(sensor_data, dict):
        print(f"New data for {sensor_id}: {sensor_data}")
        new_entry = {
            'sensor': sensor_id,
            'timestamp': datetime.now(timezone.utc)
        }
        if 'GasValue' in sensor_data:
            new_entry['gas_value'] = sensor_data['GasValue']

        if 'Temperature' in sensor_data:
            new_entry['temperature'] = sensor_data['Temperature']

        sensor_collection.insert_one(new_entry)
        print(f"Sensor data (GasValue and/or Temperature) added to MongoDB for {sensor_id}")

    elif isinstance(sensor_data, (float, int)):
        print(f"Single value data received for {sensor_id}: {sensor_data}")
        new_entry = {
            'sensor': sensor_id,
            'value': sensor_data,
            'timestamp': datetime.now(timezone.utc)
        }
        sensor_collection.insert_one(new_entry)
        print(f"Single value sensor data added to MongoDB for {sensor_id}")
    else:
        print(f"Unexpected data format for {sensor_id}: {sensor_data}")


def firebase_listener():
    ref = firebase_db.reference('/')
    ref.listen(store_sensor_data_in_mongodb)
    print("Listening for Firebase Realtime Database changes...")

def load_model():
    with open('maintenance_model.pkl', 'rb') as f:
        model = pickle.load(f)
    return model

def load_authority_model():
    with open('authority_model.pkl', 'rb') as f:
        model = pickle.load(f)
    return model

def load_sensor_data():
    return pd.read_csv('expanded_sensor_data.csv')

def feature_engineering(sensor_data):
    sensor_data['temperature_roll_mean'] = sensor_data['temperature'].rolling(window=3).mean()
    sensor_data['gas_roll_mean'] = sensor_data['gas_value'].rolling(window=3).mean()
    sensor_data['timestamp'] = pd.to_datetime(sensor_data['timestamp'])
    sensor_data['hour'] = sensor_data['timestamp'].dt.hour
    sensor_data['day_of_week'] = sensor_data['timestamp'].dt.dayofweek
    sensor_data.bfill(inplace=True)
    return sensor_data

def aggregate_data_per_sensor(sensor_data):
    return sensor_data.groupby('sensor_id').agg({
        'temperature': 'mean',
        'gas_value': 'mean',
        'temperature_roll_mean': 'mean',
        'gas_roll_mean': 'mean',
        'hour': 'mean',
        'day_of_week': 'mean'
    }).reset_index()

def prepare_data(sensor_data):
    feature_cols = ['temperature', 'gas_value', 'temperature_roll_mean', 'gas_roll_mean', 'hour', 'day_of_week']
    X = sensor_data[feature_cols]
    sensor_ids = sensor_data['sensor_id']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, sensor_ids

@app.route('/predict', methods=['POST'])
def get_predictions():
    sensor_data = load_sensor_data()
    sensor_data = feature_engineering(sensor_data)
    aggregated_data = aggregate_data_per_sensor(sensor_data)
    
    X_scaled, sensor_ids = prepare_data(aggregated_data)
    
    model = load_model()
    predictions = model.predict(X_scaled)

    results = []
    for i, pred in enumerate(predictions):
        results.append({
            'sensor_id': sensor_ids.iloc[i],
            'next_maintenance': (datetime.now() + timedelta(days=np.random.randint(1, 30))).strftime('%Y-%m-%d'),
            'severity': int(pred)
        })
    
    return jsonify(results)

@app.route('/predict_authority', methods=['POST'])
def predict_fastest_authority():
    try:
        data = request.json
        user_location = data.get('location')
        accident_type = data.get('accident_type')

        if not user_location or not accident_type:
            return jsonify({"error": "Invalid input"}), 400

        authority_model = load_authority_model()

        location_mapping = {
            'Navi Mumbai': 0,
            'Chembur': 1,
            'Kurla': 2,
            'Vashi': 3,
            'Panvel': 4
        }
        accident_type_mapping = {
            'fire_accident': 0,
            'gas_leak_accident': 1
        }
        
        location_code = location_mapping.get(user_location)
        accident_type_code = accident_type_mapping.get(accident_type)

        if location_code is None or accident_type_code is None:
            return jsonify({"error": "Invalid location or accident type"}), 400

        input_data = pd.DataFrame([[location_code, accident_type_code]], columns=['user_location', 'accident_type'])
        prediction = authority_model.predict(input_data)

        authority_mapping = {
            0: "Police Department",
            1: "Fire Department",
            2: "Municipal Authority Ambulance"
        }

        return jsonify({
            "predicted_authority": authority_mapping.get(prediction[0]),
            "status": "Prediction successful"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/details', methods=['GET'])
def get_sensor_details():
    sensor_name = request.args.get('sensor')
    
    return jsonify({
        "sensor": sensor_name,
        "message": f"Details for {sensor_name}",
        "status": "Operational",
        "last_maintenance": (datetime.now() - timedelta(days=np.random.randint(1, 30))).strftime('%Y-%m-%d')
    })

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        to_email = data['to']
        subject = data['subject']
        body = data['body']
        recipient_name = data.get('recipient_name', 'Recipient')

        print(f"Sending email to {to_email} with subject '{subject}'")

        mailjet = Client(auth=(os.getenv('MAILJET_API_KEY'), os.getenv('MAILJET_SECRET_KEY')), version='v3.1')
        email_data = {
            'Messages': [
                {
                    "From": {
                        "Email": "coc17903@gmail.com",
                        "Name": "Alert System"
                    },
                    "To": [
                        {
                            "Email": to_email,
                            "Name": recipient_name
                        }
                    ],
                    "Subject": subject,
                    "TextPart": body
                }
            ]
        }
        
        response = mailjet.send.create(data=email_data)

        # Log the Mailjet response
        print(f"Mailjet response: {response.status_code}, {response.json()}")

        if response.status_code == 200:
            return jsonify({
                'success': True,
                'message': 'Email sent successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send email'
            }), 500

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400



if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    firebase_listener() 
    app.run(host='0.0.0.0', port=port)