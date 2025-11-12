// 🥩 Beef Uploader

const firebaseConfig = {
  apiKey: "AIzaSyBekUGQp88BILN7wvdFQOCxh3TiNx2Uf5A",
  authDomain: "meatfyll.firebaseapp.com",
  databaseURL: "https://meatfyll-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meatfyll",
  storageBucket: "meatfyll.appspot.com",
  messagingSenderId: "996875029846",
  appId: "1:996875029846:web:c293c3118952de1acf1af7"
};

// ✅ Initialize Firebase safely (avoid duplicate init)
const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();
const db = firebase.database(app);

let selectedFile = null;

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("previewImage");
const status = document.getElementById("statusMessage");

// 🖼️ Preview image
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = ev => {
      selectedFile = ev.target.result;
      preview.src = selectedFile;
      preview.style.display = "block";
      uploadBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
});

// 🚀 Upload beef data
uploadBtn.addEventListener("click", async () => {
  const shopName = document.getElementById("shopName").value.trim();
  const location = document.getElementById("shopLocation").value.trim();
  const phone = document.getElementById("shopPhone").value.trim();
  const price = document.getElementById("beefPrice").value.trim();
  const weight = document.getElementById("beefWeight").value.trim();

  if (!shopName || !location || !phone || !price || !weight || !selectedFile) {
    status.textContent = "⚠️ Please fill all fields and upload an image!";
    status.style.color = "red";
    return;
  }

  const data = {
    shopName,
    location,
    phone,
    price,
    weight,
    category: "beef",
    image: selectedFile,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  };

  try {
    await db.ref("images").push(data);
    status.textContent = "✅ Beef uploaded successfully!";
    status.style.color = "green";
    setTimeout(() => window.location.href = "index.html", 1500);
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Upload failed: " + err.message;
    status.style.color = "red";
  }
});
