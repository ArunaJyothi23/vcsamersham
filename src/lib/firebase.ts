// Firebase App & Analytics Configuration for VCS Amersham
// Project: vcs-amersham

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCd6EskMn3ED4SJ2FeeiWwOtYP1nXaKxeU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vcs-amersham.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vcs-amersham",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vcs-amersham.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "137380635485",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:137380635485:web:3f44af3eaf6bfa28c6beb4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F2MH45D28E",
};

/**
 * Initializes Firebase in the browser environment
 */
export function initFirebaseClient() {
  if (typeof window === "undefined") return null;

  try {
    // If Firebase is loaded via window/scripts or modules
    const w = window as any;
    if (w.firebase) {
      if (!w.firebase.apps?.length) {
        w.firebase.initializeApp(firebaseConfig);
      }
      return w.firebase;
    }
  } catch (err) {
    console.debug('Firebase client initialization note:', err);
  }
  return null;
}
