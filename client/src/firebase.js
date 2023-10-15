import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'mern-estate-20d98.firebaseapp.com',
	projectId: 'mern-estate-20d98',
	storageBucket: 'mern-estate-20d98.appspot.com',
	messagingSenderId: '485333035492',
	appId: '1:485333035492:web:d72be14ef8c20d60703ff1',
};

export const app = initializeApp(firebaseConfig);
