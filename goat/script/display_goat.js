// 🐐 GOAT GALLERY DISPLAY

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
    loadGoatGallery();
  } catch (error) {
    console.error("Firebase init failed:", error);
    alert("Error initializing Firebase!");
  }
});

// 🟢 Load goat listings
function loadGoatGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) {
    console.error("❌ No element with id 'galleryGrid' found!");
    return;
  }

  galleryGrid.innerHTML = `<p class="loading">Loading goat listings...</p>`;

  database.ref("images").on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      galleryGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🐐</div>
          <p>No goat uploaded yet.</p>
        </div>`;
      return;
    }

    const images = Object.values(data)
      .filter((img) => img.category === "goat")
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    renderGoatGallery(images);
  });
}

// 🟣 Render goat cards
function renderGoatGallery(images) {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  if (images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🐐</div>
        <p>No goat uploaded yet.</p>
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
          <img src="${img.image}" alt="${img.fishName || "Goat"}" />
          <div class="image-info">
            <h3>${img.fishName || "Fresh Goat"}</h3>
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
              <button class="btn-order" onclick="openOrderForm(${i}, '${(img.fishName || "Goat").replace(/'/g, "\\'")}', '${(img.shopName || "").replace(/'/g, "\\'")}', '${(img.location || "").replace(/'/g, "\\'")}', '${price}')">🐐 Order Now</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

// 🟡 Create popup form dynamically
function openOrderForm(index, goatName, shopName, location, price) {
  const existing = document.getElementById("orderPopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "orderPopup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.background = "rgba(0,0,0,0.6)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "9999";

  popup.innerHTML = `
    <div style="background:#fff; padding:20px 24px; border-radius:12px; width:90%; max-width:400px; box-shadow:0 8px 24px rgba(0,0,0,0.2); font-family:Poppins;">
      <h2>🐐 Order Goat</h2>
      <p><strong>Shop:</strong> ${shopName}</p>
      <p><strong>Item:</strong> ${goatName}</p>
      <p><strong>Price per kg:</strong> ₹${price}</p>

      <label>Your Name:</label>
      <input id="custName" type="text" placeholder="Enter your name" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #ccc;">

      <label>Your Phone:</label>
      <input id="custPhone" type="tel" placeholder="Enter your phone number" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #ccc;">

      <label>Your Location:</label>
      <input id="custAddress" type="text" placeholder="Enter your location" style="width:100%;padding:8px;margin-bottom:12px;border-radius:6px;border:1px solid #ccc;">

      <button id="confirmOrder" style="background:#8b4513;color:white;border:none;padding:10px 14px;border-radius:8px;width:100%;font-weight:600;cursor:pointer;">Confirm Order</button>
      <button id="closePopup" style="margin-top:8px;background:#ccc;border:none;padding:8px 10px;border-radius:6px;width:100%;cursor:pointer;">Cancel</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("closePopup").onclick = () => popup.remove();

  document.getElementById("confirmOrder").onclick = () => {
    const customerName = document.getElementById("custName").value.trim();
    const customerPhone = document.getElementById("custPhone").value.trim();
    const customerAddress = document.getElementById("custAddress").value.trim();
    const weight = parseFloat(document.getElementById(`weight${index}`).value);
    const deliveryCharge = 30;

    if (!customerName || !customerPhone || !customerAddress) {
      alert("⚠️ Please fill in all details!");
      return;
    }

    const total = price * weight + deliveryCharge;

    const message = encodeURIComponent(
      `New Goat Order\n--------------------\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Address: ${customerAddress}\n\n` +
      `Shop: ${shopName}\n` +
      `Location: ${location}\n\n` +
      `Goat: ${goatName}\n` +
      `Quantity: ${weight} kg\n` +
      `Price: ₹${(price * weight).toFixed(2)}\n` +
      `Delivery Charge: ₹${deliveryCharge}\n--------------------\n` +
      `Total = ₹${total.toFixed(2)}`
    );

    window.open(`https://wa.me/9526226011?text=${message}`, "_blank");
    popup.remove();
  };
}


// 🟡 Create popup form dynamically
function openOrderForm(index, goatName, shopName, location, price) {
  const existing = document.getElementById("orderPopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "orderPopup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.background = "rgba(0,0,0,0.6)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "9999";

  popup.innerHTML = `
    <div style="background:#fff; padding:20px 24px; border-radius:12px; width:90%; max-width:400px; box-shadow:0 8px 24px rgba(0,0,0,0.2); font-family:Poppins;">
      <h2>🐐 Order Goat</h2>
      <p><strong>Shop:</strong> ${shopName}</p>
      <p><strong>Item:</strong> ${goatName}</p>
      <p><strong>Price per kg:</strong> ₹${price}</p>

      <label>Your Name:</label>
      <input id="custName" type="text" placeholder="Enter your name" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #ccc;">

      <label>Your Phone:</label>
      <input id="custPhone" type="tel" placeholder="Enter your phone number" style="width:100%;padding:8px;margin-bottom:8px;border-radius:6px;border:1px solid #ccc;">

      <label>Your Location:</label>
      <input id="custAddress" type="text" placeholder="Enter your location" style="width:100%;padding:8px;margin-bottom:12px;border-radius:6px;border:1px solid #ccc;">

      <button id="confirmOrder" style="background:#27ae60;color:white;border:none;padding:10px 14px;border-radius:8px;width:100%;font-weight:600;cursor:pointer;">Confirm Order</button>
      <button id="closePopup" style="margin-top:8px;background:#ccc;border:none;padding:8px 10px;border-radius:6px;width:100%;cursor:pointer;">Cancel</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("closePopup").onclick = () => popup.remove();

  document.getElementById("confirmOrder").onclick = () => {
    const customerName = document.getElementById("custName").value.trim();
    const customerPhone = document.getElementById("custPhone").value.trim();
    const customerAddress = document.getElementById("custAddress").value.trim();
    const weight = parseFloat(document.getElementById(`weight${index}`).value);
    const deliveryCharge = 30;

    if (!customerName || !customerPhone || !customerAddress) {
      alert("⚠️ Please fill in all details!");
      return;
    }

    const total = price * weight + deliveryCharge;

    const message = encodeURIComponent(
      `New Goat Order\n--------------------\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Address: ${customerAddress}\n\n` +
      `Shop: ${shopName}\n` +
      `Location: ${location}\n\n` +
      `Goat: ${goatName}\n` +
      `Quantity: ${weight} kg\n` +
      `Price: ₹${(price * weight).toFixed(2)}\n` +
      `Delivery Charge: ₹${deliveryCharge}\n--------------------\n` +
      `Total = ₹${total.toFixed(2)}`
    );

    window.open(`https://wa.me/9526226011?text=${message}`, "_blank");
    popup.remove();
  };
}
