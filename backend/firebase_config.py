import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("amsproj-f7dbd-firebase-adminsdk-fuesr-dd04cce976.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
