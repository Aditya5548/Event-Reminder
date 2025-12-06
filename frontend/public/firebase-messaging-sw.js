if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }

importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyA7I-OwWeoNbL9bQzIUIzzkRCDEB1qrpzY",
  authDomain: "event-reminder-32ea4.firebaseapp.com",
  projectId: "event-reminder-32ea4",
  storageBucket: "event-reminder-32ea4.firebasestorage.app",
  messagingSenderId: "468022126432",
  appId: "1:468022126432:web:864c975613f149f5f96005",
  measurementId: "G-V2C12M9B0E"
};

firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
