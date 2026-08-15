import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNPMd11HldQlqSweyESfAnXqGmpl34ZfM",
  authDomain: "profrance-497a2.firebaseapp.com",
  projectId: "profrance-497a2",
  storageBucket: "profrance-497a2.firebasestorage.app",
  messagingSenderId: "471627181427",
  appId: "1:471627181427:web:c47dd91b117559d6b8a906",
  measurementId: "G-1JEX10SMK0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Sincronización de lecciones y vocabulario guardado
export async function saveLessonToCloud(userId, lesson) {
  if (!userId || !lesson.id) return;
  const docRef = doc(db, "users", userId, "saved_lessons", lesson.id);
  await setDoc(docRef, {
    ...lesson,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteLessonFromCloud(userId, lessonId) {
  if (!userId || !lessonId) return;
  const docRef = doc(db, "users", userId, "saved_lessons", lessonId);
  await deleteDoc(docRef);
}

export function subscribeToCloudLessons(userId, callback) {
  if (!userId) return () => {};
  const q = query(
    collection(db, "users", userId, "saved_lessons")
  );
  return onSnapshot(q, (snapshot) => {
    const cloudLessons = [];
    snapshot.forEach((doc) => {
      cloudLessons.push(doc.data());
    });
    // Ordenar por fecha descendente
    cloudLessons.sort((a, b) => parseInt(b.id || 0) - parseInt(a.id || 0));
    callback(cloudLessons);
  }, (error) => {
    console.error("Error en la sincronización en tiempo real:", error);
  });
}
