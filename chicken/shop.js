// --- Sidebar toggle ---
const sidebar = document.getElementById('sidebar');
const menuIcon = document.getElementById('menu-icon');
const closeBtn = document.querySelector('.close-btn');

if (menuIcon && closeBtn && sidebar) {
  menuIcon.addEventListener('click', () => {
    sidebar.style.left = '0';
  });

  closeBtn.addEventListener('click', () => {
    sidebar.style.left = '-250px';
  });
}

// --- Modern booking popup system ---
const createBookingModal = (shop, index) => {
  const modal = document.createElement('div');
  modal.classList.add('booking-modal');
  modal.innerHTML = `
    <div class="booking-box">
      <h3>🐔 Order from ${shop.name}</h3>
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
      modal.remove();

      const pricePerKg = 120;
      const delivery = 30;
      const subtotal = pricePerKg * kg;
      const total = subtotal + delivery;

      const message = `
New Chicken Order
--------------------
Name: [Enter Your Name]
Phone: [Enter Your Phone]
Address: [Enter Your Address]

Shop: ${shop.name}
Location: ${shop.location}

Chicken: Fresh Chicken
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

// --- Handle Shop Form Submission ---
const shopForm = document.getElementById('shopForm');

shopForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('shopName').value.trim();
  const location = document.getElementById('shopLocation').value.trim();
  const phone = document.getElementById('shopPhone').value.trim();
  const photosInput = document.getElementById('shopPhotos');

  if (!name || !location || !phone) {
    alert("⚠️ Please fill all required fields!");
    return;
  }

  const photos = [];

  // Function to save shops to localStorage and redirect
  function saveShop() {
    const shops = JSON.parse(localStorage.getItem('chickenShops')) || [];
    shops.push({ name, location, phone, photos });
    localStorage.setItem('chickenShops', JSON.stringify(shops));

    // Redirect to chicken.html
    window.location.href = 'chicken.html';
  }

  if (photosInput.files.length > 0) {
    let loaded = 0;
    for (let i = 0; i < photosInput.files.length; i++) {
      const reader = new FileReader();
      reader.onload = function(event) {
        photos.push(event.target.result);
        loaded++;
        if (loaded === photosInput.files.length) saveShop();
      };
      reader.readAsDataURL(photosInput.files[i]);
    }
  } else {
    saveShop();
  }
});
