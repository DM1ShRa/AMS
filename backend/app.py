import os
from flask import Flask, request, jsonify
from svix.webhooks import Webhook, WebhookVerificationError
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS_PATH'))
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)

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

            print(filtered_data)
            db.collection('users').document(user_id).set(filtered_data)

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)