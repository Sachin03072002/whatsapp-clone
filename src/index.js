import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const firebaseConfig = {
  apiKey: "AIzaSyDUTZbaj1afYUBh_t4BCpq3SBeLV3Pzrdo",
  authDomain: "whatsapp-chat-382b5.firebaseapp.com",
  databaseURL: "https://whatsapp-chat-382b5-default-rtdb.firebaseio.com",
  projectId: "whatsapp-chat-382b5",
  storageBucket: "whatsapp-chat-382b5.appspot.com",
  messagingSenderId: "334704267695",
  appId: "1:334704267695:web:04db63fb2927dba8e59f5a",
  measurementId: "G-4EHTWTN9BC"
};

firebase.initializeApp(firebaseConfig);

// Define the createNotification function here
export function createNotification(type) {
  switch (type) {
    case 'info':
      NotificationManager.info('Info message');
      break;
    case 'success':
      NotificationManager.success('Success message', 'Title here');
      break;
    case 'warning':
      NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
      break;
    case 'error':
      NotificationManager.error('Error message', 'Click me!', 5000, () => {
        alert('callback');
      });
      break;
    default:
      break;
  }
}



// Render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <NotificationContainer />
  </React.StrictMode>
);


