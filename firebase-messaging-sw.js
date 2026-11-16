// Firebase Messaging background handler; app-specific Firebase config is public.
importScripts('https://www.gstatic.com/firebasejs/13.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.3.0/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyClAjzLsBmIaISpzVKvS_tLQQGSF_8ALGg',authDomain:'asem-algel.firebaseapp.com',projectId:'asem-algel',storageBucket:'asem-algel.firebasestorage.app',messagingSenderId:'273464507861',appId:'1:273464507861:web:6bbf2068f69dba5466d15c'});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{const title=payload.data?.title||'AlGel';const body=payload.data?.body||'Yeni alışveriş hatırlatması';self.registration.showNotification(title,{body,icon:'./icon-192.png',data:{url:'./'}})});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(new URL('./',self.location).href))});
