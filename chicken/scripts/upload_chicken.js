// 🟢 Firebase Image Uploader (Beef Version)
const firebaseConfig = {
  apiKey: "AIzaSyBekUGQp88BILN7wvdFQOCxh3TiNx2Uf5A",
  authDomain: "meatfyll.firebaseapp.com",
  databaseURL: "https://meatfyll-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meatfyll",
  storageBucket: "meatfyll.appspot.com",
  messagingSenderId: "996875029846",
  appId: "1:996875029846:web:c293c3118952de1acf1af7"
};

let firebaseApp = null;
let database = null;
let selectedFileBase64 = null;

window.addEventListener("DOMContentLoaded", () => {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  database = firebase.database(firebaseApp);
  setupUploadUI();
});

function setupUploadUI() {
  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const previewImg = document.getElementById("previewImage");
  const previewContainer = document.getElementById("previewContainer");
  const uploadBtnText = document.getElementById("uploadBtnText");

  uploadBox.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
  uploadBtn.addEventListener("click", uploadImage);

  uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
  });
  uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("dragover"));
  uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("dragover");
    handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      showStatus("Please select a valid image", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedFileBase64 = e.target.result;
      previewImg.src = selectedFileBase64;
      previewContainer.classList.remove("hidden");
      uploadBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage() {
    if (!selectedFileBase64) {
      showStatus("No image selected!", "error");
      return;
    }

    uploadBtn.disabled = true;
    uploadBtnText.innerHTML = '<span class="loader"></span> Uploading...';

    try {
      const shopName = document.getElementById("shopName").value.trim();
      const location = document.getElementById("shopLocation").value.trim();
      const phone = document.getElementById("shopPhone").value.trim();
      const price = document.getElementById("meatPrice").value.trim();
      const weight = document.getElementById("meatWeight").value.trim();

      if (!shopName || !location || !phone || !price || !weight) {
        showStatus("Please fill all required fields!", "error");
        uploadBtn.disabled = false;
        uploadBtnText.textContent = "Upload Beef";
        return;
      }

      const data = {
        shopName,
        location,
        phone,
        price,
        weight,
        category: "beef",
        image: selectedFileBase64,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      const newRef = database.ref("images").push();
      await newRef.set(data);

      showStatus("Beef uploaded successfully! 🥩", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      showStatus("Upload failed: " + err.message, "error");
    } finally {
      uploadBtn.disabled = false;
      uploadBtnText.textContent = "Upload Beef";
    }
  }

  function showStatus(msg, type) {
    const status = document.getElementById("statusMessage");
    status.textContent = msg;
    status.className = "status-message show status-" + type;
    setTimeout(() => status.classList.remove("show"), 4000);
  }
}
