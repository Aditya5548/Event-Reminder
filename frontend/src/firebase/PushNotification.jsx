import { useEffect } from 'react';
import { messaging } from './firebaseConfig.jsx';
import { getToken, onMessage } from 'firebase/messaging';
import { useUser } from '../context/UserContext.jsx';

export function PushNotification() {
  const { setFcmtoken } = useUser();

  useEffect(() => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          return getToken(messaging);
        } else {
          console.log('Unable to get permission to notify.');
        }
      })
      .then((token) => {
        if (token) {
          setFcmtoken(token); 
        }
      })
      .catch((err) => {
        console.error('Error getting notification permission:', err);
      });

    const unsubscribe = onMessage(messaging, (payload) => {
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      }
    });

    return () => unsubscribe(); 
  }, [setFcmtoken]);

  return null;
}
