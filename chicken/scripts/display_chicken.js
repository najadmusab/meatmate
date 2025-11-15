// 🐔 CHICKEN GALLERY DISPLAY

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBekUGQp88BILN7wvdFQOCxh3TiNx2Uf5A",
  authDomain: "meatfyll.firebaseapp.com",
  databaseURL: "https://meatfyll-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meatfyll",
  storageBucket: "meatfyll.appspot.com",
  messagingSenderId: "996875029846",
  appId: "1:996875029846:web:c293c3118952de1acf1af7"
};

let firebaseApp;
let database;

// 🔥 Initialize Firebase
window.addEventListener("DOMContentLoaded", () => {
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    database = firebase.database(firebaseApp);
    loadGallery();
  } catch (error) {
    console.error("Firebase init failed:", error);
    alert("Error initializing Firebase!");
  }
});

// 🟢 Load all chicken listings
function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) {
    console.error("❌ No element with id 'galleryGrid' found in HTML!");
    return;
  }

  galleryGrid.innerHTML = `<p class="loading">Loading chicken listings...</p>`;

  database.ref("images").on(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        galleryGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🍗</div>
            <p>No chicken uploaded yet. Upload the first one!</p>
          </div>`;
        return;
      }

      const images = Object.values(data)
        .filter((img) => img.category === "chicken")
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      renderGallery(images);
    },
    (error) => {
      console.error("Error reading database:", error);
      galleryGrid.innerHTML = `<p class="error">Failed to load chicken listings.</p>`;
    }
  );
}

// 🟣 Render chicken cards
function renderGallery(images) {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  if (images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🐔</div>
        <p>No chicken uploaded yet. Upload the first one!</p>
      </div>`;
    return;
  }

  galleryGrid.innerHTML = images
    .map((img, i) => {
      const date = img.timestamp ? new Date(img.timestamp) : new Date();
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const price = parseFloat(img.price) || 0;

      return `
        <div class="image-card">
          <img src="${img.image}" alt="${img.fishName || "Chicken"}" />
          <div class="image-info">
            <h3>${img.fishName || "Fresh Chicken"}</h3>
            <p><strong>🏪 Shop:</strong> ${img.shopName || "Unknown"}</p>
            <p><strong>📍 Location:</strong> ${img.location || "Not specified"}</p>
            <p><strong>💰 Price per kg:</strong> ₹${price}</p>
            <p><strong>⚖️ Quantity:</strong>
              <select id="weight${i}" class="weight-select">
                <option value="0.5">0.5 kg</option>
                <option value="1">1 kg</option>
                <option value="2">2 kg</option>
                <option value="3">3 kg</option>
                <option value="5">5 kg</option>
              </select>
            </p>
            <p><strong>📞 Phone:</strong> ${img.phone || "No phone"}</p>
            <p class="timestamp">${dateStr} at ${timeStr}</p>

            <div class="button-group">
              <button class="btn-call" onclick="window.open('tel:${img.phone}')">📞 Call</button>
              <button class="btn-order" onclick="orderChicken(${i}, '${(img.fishName || "Chicken").replace(/'/g, "\\'")}', '${(img.shopName || "").replace(/'/g, "\\'")}', '${(img.location || "").replace(/'/g, "\\'")}', '${price}')">🍗 Order Now</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

// 🟢 WhatsApp Order with customer info + total
function orderChicken(index, chickenName, shopName, location, price) {
  const weight = parseFloat(document.getElementById(`weight${index}`).value);
  const deliveryCharge = 30;

  // ⚠️ Replace these with actual customer inputs or session data
  const customerName = "Najad Musab";
  const customerPhone = "9567226075";
  const customerAddress = "Mallappuram";

  const total = price * weight + deliveryCharge;

  const message = encodeURIComponent(
    `New Chicken Order\n--------------------\n` +
    `Name: ${customerName}\n` +
    `Phone: ${customerPhone}\n` +
    `Address: ${customerAddress}\n\n` +
    `Shop: ${shopName}\n` +
    `Location: ${location}\n\n` +
    `Chicken: ${chickenName}\n` +
    `Quantity: ${weight} kg\n` +
    `Price: ₹${(price * weight).toFixed(2)}\n` +
    `Delivery Charge: ₹${deliveryCharge}\n--------------------\n` +
    `Total = ₹${total.toFixed(2)}`
  );

  window.open(`https://wa.me/9526226011?text=${message}`, "_blank");
}

