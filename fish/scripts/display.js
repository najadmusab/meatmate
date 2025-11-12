// 🐟 FISH GALLERY DISPLAY (display.js)

// Firebase Config
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

// Initialize Firebase when DOM is ready
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

// 🟢 Load all fish listings
function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) {
    console.error("No element with id 'galleryGrid' found in HTML!");
    return;
  }

  galleryGrid.innerHTML = `<p class="loading">Loading fish listings...</p>`;

  // Listen to the Firebase "images" node
  database.ref("images").on(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        galleryGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🐟</div>
            <p>No fish uploaded yet. Upload the first one!</p>
          </div>`;
        return;
      }

      // Convert to array and sort by timestamp
      const images = Object.values(data)
        .filter((img) => img.category === "fish")
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      // Render them
      renderGallery(images);
    },
    (error) => {
      console.error("Error reading database:", error);
      galleryGrid.innerHTML = `<p class="error">Failed to load fish listings.</p>`;
    }
  );
}

// 🟣 Render all fish cards
function renderGallery(images) {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  if (images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🐠</div>
        <p>No fish uploaded yet. Upload the first one!</p>
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

      return `
        <div class="image-card">
          <img src="${img.image}" alt="${img.fishName || "Fish"}" />
          <div class="image-info">
            <h3>${img.fishName || "Unnamed Fish"}</h3>
            <p><strong>🏪 Shop:</strong> ${img.shopName || "Unknown"}</p>
            <p><strong>📍 Location:</strong> ${img.location || "Not specified"}</p>
            <p><strong>💰 Price:</strong> ₹${img.price || "0"}</p>
            <p><strong>⚖️ Weight:</strong>
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
              <button class="btn-order" onclick="orderFish(${i}, '${img.fishName}', '${img.shopName}', '${img.location}', '${img.price}', '${img.image}')">🐟 Order Now</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

// 🟢 Send WhatsApp order
function orderFish(index, fishName, shopName, location, price, image) {
  const weight = document.getElementById(`weight${index}`).value;
  const message = encodeURIComponent(
    `Hello! I would like to order:\n\n🐟 Fish: ${fishName}\n🏪 Shop: ${shopName}\n📍 Location: ${location}\n💰 Price: ₹${price}\n⚖️ Weight: ${weight} kg\n🖼️ Image: ${image}`
  );
  window.open(`https://wa.me/9526226011?text=${message}`, "_blank");
}
