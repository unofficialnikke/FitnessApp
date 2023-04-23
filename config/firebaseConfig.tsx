import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA4WpVrSlTSM1bpy6faWilQHjKtQwsq51o",
    authDomain: "fitnessapp-7487c.firebaseapp.com",
    projectId: "fitnessapp-7487c",
    storageBucket: "fitnessapp-7487c.appspot.com",
    messagingSenderId: "755447253804",
    appId: "1:755447253804:web:ba29f01b5c8cafeaf2fa89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }