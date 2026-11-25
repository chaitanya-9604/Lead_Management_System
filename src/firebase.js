import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBWTyviWts487PstE309EIGoYo6ZJh6Qs4",
  authDomain: "lead-management-system-b6d65.firebaseapp.com",
  projectId: "lead-management-system-b6d65",
  storageBucket: "lead-management-system-b6d65.firebasestorage.app",
  messagingSenderId: "710408532466",
  appId: "1:710408532466:web:f1a6cfb8c29a0db270bb6b"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)