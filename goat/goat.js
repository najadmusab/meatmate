// 🐐 Connect goat.js to Firebase Firestore
import { db } from "../Script/firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🐐 Firestore collection
const goatShopsRef = collection(db, "goatShops");

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const menuIcon = document.getElementById('menu-icon');
const closeBtn = document.querySelector('.close-btn');

menuIcon.addEventListener('click', () => {
  sidebar.style.left = '0';
});
closeBtn.addEventListener('click', () => {
  sidebar.style.left = '-250px';
});

// --- Load added goat shops dynamically ---
document.addEventListener('DOMContentLoaded', () => {
  const shopList = document.getElementById('shopList');
  const shops = JSON.parse(localStorage.getItem('goatShops')) || [];

  if (shops.length === 0) {
    shopList.innerHTML = "<p>No shops added yet. <a href='shop.html'>Add one now!</a></p>";
    return;
  }

  shops.forEach((shop, index) => {
    const card = document.createElement('div');
    card.classList.add('shop-card');
    card.innerHTML = `
      <img src="${shop.photos[0] || 'images/goat-logo.png'}" alt="${shop.name}">
      <h3>${shop.name}</h3>
      <p><strong>Location:</strong> ${shop.location}</p>
      <p><strong>Contact:</strong> ${shop.phone}</p>
      <div class="card-buttons">
        <button class="call-btn" data-phone="${shop.phone}">📞 Call</button>
        <button class="book-btn" data-index="${index}">🐐 Book Now</button>
      </div>
    `;
    shopList.appendChild(card);
  });

  // --- Call button ---
  document.querySelectorAll('.call-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone');
      window.location.href = `tel:${phone}`;
    });
  });

  // --- Book Now button ---
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.getAttribute('data-index');
      const shop = shops[i];
      createBookingModal(shop);
    });
  });
});

// --- Booking Popup with WhatsApp message ---
const createBookingModal = (shop) => {
  const modal = document.createElement('div');
  modal.classList.add('booking-modal');
  modal.innerHTML = `
    <div class="booking-box">
      <img src="images/goat-logo.png" alt="GOAT Logo" style="width:80px; margin-bottom:10px;">
      <h3>🐐 Order from ${shop.name}</h3>
      <input type="text" id="custName" placeholder="Your Name" required>
      <input type="tel" id="custPhone" placeholder="Your Phone" required>
      <textarea id="custAddress" placeholder="Your Address" required></textarea>

      <p>Select Quantity (1 - 5 kg):</p>
      <div class="kg-options">
        ${[1,2,3,4,5].map(k => `<button class="kg-btn" data-kg="${k}">${k} kg</button>`).join('')}
      </div>
      <button class="close-modal">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);

  modal.querySelectorAll('.kg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const kg = parseInt(btn.dataset.kg);
      const name = modal.querySelector('#custName').value.trim() || '[Enter Your Name]';
      const phone = modal.querySelector('#custPhone').value.trim() || '[Enter Your Phone]';
      const address = modal.querySelector('#custAddress').value.trim() || '[Enter Your Address]';
      modal.remove();

      const pricePerKg = 420; // Goat price (customizable)
      const delivery = 50;
      const subtotal = pricePerKg * kg;
      const total = subtotal + delivery;

      const message = `
New Goat Order
--------------------
Name: ${name}
Phone: ${phone}
Address: ${address}

Shop: ${shop.name}
Location: ${shop.location}

Goat: Fresh Goat Meat
Quantity: ${kg} kg
Price: ₹${subtotal}
Delivery Charge: ₹${delivery}
--------------------
Total = ₹${total.toFixed(2)}
      `;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/9526226011?text=${encoded}`, '_blank');
    });
  });

  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  });
};

// --- 🛠️ Manage Goat Shops (Admin) ---
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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const dbRT = firebase.database(app);

// DOM Elements
const manageShopsBtn = document.getElementById('manageShopsBtn');
const manageShopsSection = document.getElementById('manageShopsSection');
const manageShopList = document.getElementById('manageShopList');

// Manage Shops
manageShopsBtn.addEventListener('click', async () => {
  const enteredPwd = prompt("Enter admin password to manage shops:");
  if (!enteredPwd) return;

  // ✅ Get password from Firebase
  const passwordSnapshot = await dbRT.ref("admin/password").once("value");
  const storedPwd = passwordSnapshot.val();

  if (enteredPwd !== storedPwd) {
    alert("❌ Incorrect password!");
    return;
  }

  manageShopsSection.style.display = "block";
  manageShopList.innerHTML = "<p>Loading shops...</p>";

  // ✅ Load goat shops
  const shopSnapshot = await dbRT.ref("shops/goat").once("value");
  const shops = shopSnapshot.val();

  if (!shops) {
    manageShopList.innerHTML = "<p>No shops to manage.</p>";
    return;
  }

  manageShopList.innerHTML = "";
  Object.entries(shops).forEach(([id, shop]) => {
    const shopDiv = document.createElement('div');
    shopDiv.classList.add('manage-shop-card');
    shopDiv.innerHTML = `
      <h3>${shop.name}</h3>
      <p><strong>Location:</strong> ${shop.location}</p>
      <p><strong>Phone:</strong> ${shop.phone}</p>
      <button class="delete-shop-btn" data-id="${id}">Delete Shop</button>
    `;
    manageShopList.appendChild(shopDiv);
  });

  // 🗑️ Delete shop
  document.querySelectorAll('.delete-shop-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const name = btn.parentElement.querySelector('h3').innerText;

      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        await dbRT.ref(`shops/goat/${id}`).remove();
        alert(`✅ "${name}" has been deleted.`);
        btn.parentElement.remove();
      }
    });
  });
});

// --- Reattach events (for dynamic content) ---
document.querySelectorAll('.call-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = `tel:${btn.dataset.phone}`;
  });
});

document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = btn.dataset.index;
    const shop = JSON.parse(localStorage.getItem('goatShops'))[i];
    createBookingModal(shop);
  });
});
