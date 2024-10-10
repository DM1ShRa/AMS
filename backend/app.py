import os
from flask import Flask, request, jsonify
from svix.webhooks import Webhook, WebhookVerificationError
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, db as firebase_db
from pymongo import MongoClient
from datetime import datetime, timezone

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

@app.route('/api/sensor', methods=['GET'])
def get_sensor_data():
    try:
        # Reference to your Firebase Realtime Database or Firestore
        sensors_ref = db.collection('sensors')
        sensors = sensors_ref.stream()

        sensor_data = []
        for sensor in sensors:
            sensor_data.append(sensor.to_dict())

        return jsonify(sensor_data), 200
    except Exception as e:
        print(f"Error fetching sensor data: {e}")
        return jsonify({"error": "Failed to fetch sensor data"}), 500

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


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    firebase_listener() 
    app.run(host='0.0.0.0', port=port)
