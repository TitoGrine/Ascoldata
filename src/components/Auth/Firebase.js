import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

var config = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
	storageBucket: process.env.REACT_APP_FIREBAES_STORAGE_BUCKET,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

let fb = firebase.initializeApp(config);
let firestore = firebase.firestore();

let functions = firebase.functions();

export const firebase_authenticate = () => {
	functions.httpsCallable('redirect')({}).then((data) => {
		console.log(data);
	});
};
