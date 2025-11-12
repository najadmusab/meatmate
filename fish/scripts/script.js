// ==========================
// INTRO PAGE TRANSITION
// ==========================
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  const main = document.getElementById("main");

  if (intro && main) {
    setTimeout(() => {
      intro.style.display = "none";
      main.classList.remove("hidden");
      main.style.opacity = 0;
      setTimeout(() => {
        main.style.transition = "opacity 1s";
        main.style.opacity = 1;
      }, 50);
    }, 4000); // 4 seconds intro
  }
});

// ==========================
// SELLER PAGE: ADD FISH LOGIC
// ==========================
const fishForm = document.getElementById("fishForm");
const addFish = document.getElementById("addFish");
const resetFish = document.getElementById("resetFish");

if (fishForm) {
  function saveFish() {
    const shopName = document.getElementById("shopName").value;
    const location = document.getElementById("fishLocation").value;
    const phone = document.getElementById("phone").value;
    const fishName = document.getElementById("fishName").value;
    const fishPrice = document.getElementById("fishPrice").value;
    const fishWeight = document.getElementById("fishWeight").value;
    const fishImageInput = document.getElementById("fishImage");

    if (!fishImageInput.files[0]) {
      alert("Please upload an image!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const fishData = {
        shop: shopName,
        location,
        phone,
        name: fishName,
        price: parseFloat(fishPrice),
        weight: fishWeight || "N/A",
        image: reader.result
      };

      let fishList = JSON.parse(localStorage.getItem("fishList")) || [];
      fishList.push(fishData);
      localStorage.setItem("fishList", JSON.stringify(fishList));

      alert(`✅ Fish "${fishName}" added!`);
      clearFishFields();
    };
    reader.readAsDataURL(fishImageInput.files[0]);
  }

  function clearFishFields() {
    document.getElementById("fishName").value = "";
    document.getElementById("fishPrice").value = "";
    document.getElementById("fishWeight").value = "";
    document.getElementById("fishImage").value = "";
  }

  addFish.addEventListener("click", saveFish);
  resetFish.addEventListener("click", clearFishFields);
}

// ==========================
// MAIN PAGE: DISPLAY FISH
// ==========================
/// ==========================
// MAIN PAGE: DISPLAY FISH
// ==========================
const fishListings = document.getElementById("fishListings");
const cartContainer = document.getElementById("cartContainer");
const cartItemsDiv = document.getElementById("cartItems");
const cartTab = document.getElementById("cartTab");
const checkoutBtn = document.getElementById("checkoutBtn");

if (fishListings) {
  const fishList = JSON.parse(localStorage.getItem("fishList")) || [];

  fishListings.innerHTML = "";

  fishList.forEach((fish, index) => {
    const card = document.createElement("div");
    card.classList.add("fish-card");
    card.innerHTML = `
      <img src="${fish.image}" alt="${fish.name}">
      <h3>${fish.name}</h3>
      <p>₹${fish.price} / kg</p>
      <p>Shop: ${fish.shop}, ${fish.location}</p>
      <div class="fish-buttons">
        <button class="add-cart" data-index="${index}">🛒 Add to Cart</button>
        <button class="order-now" data-index="${index}">⚡ Order Now</button>
      </div>
    `;
    fishListings.appendChild(card);
  });

  // Add to Cart
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      addToCart(fishList[idx]);
    });
  });

  // Order Now
  document.querySelectorAll(".order-now").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      const item = { ...fishList[idx], quantity: "1" };
      localStorage.setItem("currentOrder", JSON.stringify(item));
      window.location.href = "order.html";
    });
  });
  
}

// ==========================
// SIDEBAR CART FUNCTIONS
// ==========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartUI();

function addToCart(fish) {
  const newItem = {
    ...fish,
    quantity: "1",
  };
  cart.push(newItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  if (!cartItemsDiv) return;
  cartItemsDiv.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        ₹${item.price}/kg
      </div>
      <select data-index="${index}" class="qtySelect">
        <option value="0.5" ${item.quantity == "0.5" ? "selected" : ""}>½</option>
        <option value="1" ${item.quantity == "1" ? "selected" : ""}>1</option>
        <option value="2" ${item.quantity == "2" ? "selected" : ""}>2</option>
        <option value="3" ${item.quantity == "3" ? "selected" : ""}>3</option>
      </select>
      <span class="remove" data-index="${index}">✖</span>
    `;
    cartItemsDiv.appendChild(div);
  });

  // handle quantity change
  document.querySelectorAll(".qtySelect").forEach(sel => {
    sel.addEventListener("change", e => {
      const idx = e.target.dataset.index;
      cart[idx].quantity = e.target.value;
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });

  // handle remove
  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    });
  });
}

// Toggle cart visibility
if (cartTab) {
  cartTab.addEventListener("click", e => {
    e.preventDefault();
    cartContainer.classList.toggle("active");
  });
  
}

// Proceed to order
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    localStorage.setItem("currentCart", JSON.stringify(cart));
    window.location.href = "order.html";
  });
}



// ==========================
// SIGN-IN PAGE LOGIC
// ==========================
const signinForm = document.getElementById("signinForm");

if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const storedUser = localStorage.getItem("sellerUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (email === user.email && password === user.password) {
        alert("✅ Login successful!");
        window.location.href = "seller.html";
      } else {
        alert("❌ Invalid email or password.");
      }
    } else {
      const user = { email, password };
      localStorage.setItem("sellerUser", JSON.stringify(user));
      alert("✅ Account created! Logging in...");
      window.location.href = "seller.html";
    }
  });
}
// ==========================
// SIDEBAR TOGGLE LOGIC
// ==========================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}
// ==========================
// ORDER PAGE LOGIC
// ==========================
const orderItemDiv = document.getElementById("orderItem");
const totalAmount = document.getElementById("totalAmount");
const confirmOrder = document.getElementById("confirmOrder");

// Load order data (from currentOrder or currentCart)
const order = JSON.parse(localStorage.getItem("currentOrder")) || {};
if (order.name) {
  orderItemDiv.innerHTML = `
    <img src="${order.image}" alt="${order.name}">
    <div>
      <h3>${order.name}</h3>
      <p>₹${order.price} per kg</p>
      <p>Quantity: ${order.quantity || 1} kg</p>
    </div>
  `;
  const total = (order.price * (order.quantity || 1)).toFixed(2);
  totalAmount.innerText = `Total: ₹${total}`;
}

// Choose quick address
document.querySelectorAll(".place-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("custAddress").value = btn.innerText;
  });
});


function saveFish() {
  const shopName = document.getElementById("shopName").value;
  const location = document.getElementById("fishLocation").value;
  const phone = document.getElementById("phone").value;
  const fishName = document.getElementById("fishName").value;
  const fishPrice = document.getElementById("fishPrice").value;
  const fishImageInput = document.getElementById("fishImage");

  const storedUser = JSON.parse(localStorage.getItem("sellerUser"));
  const sellerEmail = storedUser ? storedUser.email : "unknown@example.com";

  if (!fishImageInput.files[0]) {
    alert("Please upload an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const fishData = {
      shop: shopName,
      location,
      phone,
      name: fishName,
      price: parseFloat(fishPrice),
      image: reader.result,
      weight: "",
      createdAt: Date.now(),
      sellerEmail // link fish to logged-in seller
    };

    let fishList = JSON.parse(localStorage.getItem("fishList")) || [];
    fishList.push(fishData);
    localStorage.setItem("fishList", JSON.stringify(fishList));

    alert(`✅ Fish "${fishName}" added!`);
    clearFishFields();
    showSellerFish(); // refresh list after adding
  };
  reader.readAsDataURL(fishImageInput.files[0]);
}
function showSellerFish() {
  const fishList = JSON.parse(localStorage.getItem("fishList")) || [];
  const storedUser = JSON.parse(localStorage.getItem("sellerUser"));
  const sellerEmail = storedUser ? storedUser.email : null;

  if (!sellerEmail) return;

  const myFishes = fishList.filter(fish => fish.sellerEmail === sellerEmail);

  sellerFishList.innerHTML = "";

  if (myFishes.length === 0) {
    sellerFishList.innerHTML = "<p>No fishes added yet.</p>";
    return;
  }

  myFishes.forEach((fish, index) => {
    const div = document.createElement("div");
    div.classList.add("seller-fish-card");
    div.innerHTML = `
      <img src="${fish.image}" alt="${fish.name}">
      <div class="fish-info">
        <h3>${fish.name}</h3>
        <p>₹${fish.price} / kg</p>
        <p>${fish.shop}, ${fish.location}</p>
        <button class="deleteFish" data-index="${index}">🗑️ Delete</button>
      </div>
    `;
    sellerFishList.appendChild(div);
  });

  // Delete fish event
  document.querySelectorAll(".deleteFish").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      if (confirm("Are you sure you want to delete this fish?")) {
        deleteMyFish(idx, myFishes);
      }
    });
  });
}

function deleteMyFish(index, myFishes) {
  let fishList = JSON.parse(localStorage.getItem("fishList")) || [];
  const fishToDelete = myFishes[index];

  // Remove the fish with matching createdAt + sellerEmail
  fishList = fishList.filter(fish =>
    !(fish.createdAt === fishToDelete.createdAt && fish.sellerEmail === fishToDelete.sellerEmail)
  );

  localStorage.setItem("fishList", JSON.stringify(fishList));
  showSellerFish();
  alert("🗑️ Fish deleted successfully!");
}
// ==========================
// SELLER PAGE: MANAGE FISH LIST
// ==========================
const sellerFishList = document.getElementById("sellerFishList");

if (sellerFishList) {
  showSellerFish();

  function showSellerFish() {
    const fishList = JSON.parse(localStorage.getItem("fishList")) || [];
    sellerFishList.innerHTML = "";

    if (fishList.length === 0) {
      sellerFishList.innerHTML = "<p>No fishes added yet.</p>";
      return;
    }

    fishList.forEach((fish, index) => {
      const div = document.createElement("div");
      div.classList.add("seller-fish-card");
      div.innerHTML = `
        <img src="${fish.image}" alt="${fish.name}">
        <div class="fish-info">
          <h3>${fish.name}</h3>
          <p>₹${fish.price} / kg</p>
          <p>${fish.shop}, ${fish.location}</p>
          <button class="deleteFish" data-index="${index}">🗑️ Delete</button>
        </div>
      `;
      sellerFishList.appendChild(div);
    });

    // Delete fish event
    document.querySelectorAll(".deleteFish").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        if (confirm("Are you sure you want to delete this fish?")) {
          deleteFish(idx);
        }
      });
    });
  }

  function deleteFish(index) {
    let fishList = JSON.parse(localStorage.getItem("fishList")) || [];
    fishList.splice(index, 1);
    localStorage.setItem("fishList", JSON.stringify(fishList));
    showSellerFish();
    alert("🗑️ Fish deleted successfully!");
  }
}
// ==========================
// SETTINGS PAGE LOGIC
// ==========================
const userEmailSpan = document.getElementById("userEmail");
const userNameInput = document.getElementById("userName");
const userPhoneInput = document.getElementById("userPhone");
const saveProfileBtn = document.getElementById("saveProfile");

const shopNameInput = document.getElementById("shopNameSetting");
const shopLocationInput = document.getElementById("shopLocationSetting");
const saveShopBtn = document.getElementById("saveShop");

const notifyOrders = document.getElementById("notifyOrders");
const toggleThemeBtn = document.getElementById("toggleTheme");
const clearDataBtn = document.getElementById("clearData");
const logoutBtn = document.getElementById("logoutBtn");

// Load User Info
const user = JSON.parse(localStorage.getItem("sellerUser"));
if (userEmailSpan && user) {
  userEmailSpan.textContent = user.email || "Not Logged In";
  userNameInput.value = user.name || "";
  userPhoneInput.value = user.phone || "";
}

// Save Profile
if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", () => {
    if (!user) return alert("Please log in first!");

    user.name = userNameInput.value;
    user.phone = userPhoneInput.value;
    localStorage.setItem("sellerUser", JSON.stringify(user));

    const popup = document.createElement("div");
    popup.textContent = "✅ Profile updated!";
    popup.classList.add("popup-message");
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  });
}

// Save Shop Info
if (saveShopBtn) {
  saveShopBtn.addEventListener("click", () => {
    const shopInfo = {
      name: shopNameInput.value,
      location: shopLocationInput.value,
    };
    localStorage.setItem("shopInfo", JSON.stringify(shopInfo));
    showPopup("🏪 Shop Info Saved!");
  });
}

// Notifications Toggle
if (notifyOrders) {
  notifyOrders.checked = localStorage.getItem("notifyOrders") === "true";
  notifyOrders.addEventListener("change", () => {
    localStorage.setItem("notifyOrders", notifyOrders.checked);
    showPopup(
      notifyOrders.checked
        ? "🔔 Notifications Enabled!"
        : "🔕 Notifications Disabled!"
    );
  });
}

// Theme Toggle
if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    toggleThemeBtn.textContent = isDark
      ? "🌚 Switch to Light Mode"
      : "🌞 Switch to Dark Mode";
  });
}

// Clear Fish Listings
if (clearDataBtn) {
  clearDataBtn.addEventListener("click", () => {
    localStorage.removeItem("fishList");
    showPopup("🗑️ All fish listings cleared!");
  });
}



// Popup Message Function
function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup-message";
  popup.textContent = text;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

// Popup Style
const style = document.createElement("style");
style.textContent = `
.popup-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #00ffc6;
  color: #000;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 600;
  animation: fadeIn 0.4s ease, fadeOut 0.4s ease 1.6s;
  z-index: 1000;
}
@keyframes fadeOut {
  to { opacity: 0; transform: translate(-50%, -70%); }
}
`;
document.head.appendChild(style);
// ==========================
// LOGIN / SIGNUP LOGIC
// ==========================
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

if (showSignup) showSignup.onclick = () => {
  loginBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
};
if (showLogin) showLogin.onclick = () => {
  signupBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
};



// Preview image while signing up
const signupPhoto = document.getElementById("signupPhoto");
const photoPreview = document.getElementById("photoPreview");
if (signupPhoto) {
  signupPhoto.addEventListener("change", () => {
    const file = signupPhoto.files[0];
    if (file) {
      photoPreview.classList.remove("hidden");
      photoPreview.src = URL.createObjectURL(file);
    }
  });
}

// --- Seller Page: Add Fish ---
const addFishBtn = document.getElementById('addFish');
const resetFishBtn = document.getElementById('resetFish');
const sellerFishListDiv = document.getElementById('sellerFishList');

function getFishList() {
  return JSON.parse(localStorage.getItem('fishList')) || [];
}

function saveFishList(list) {
  localStorage.setItem('fishList', JSON.stringify(list));
}

// Add new fish
addFishBtn.addEventListener('click', () => {
  const shopName = document.getElementById('shopName').value.trim();
  const fishName = document.getElementById('fishName').value.trim();
  const fishLocation = document.getElementById('fishLocation').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const fishPrice = parseFloat(document.getElementById('fishPrice').value);
  const fishWeight = parseFloat(document.getElementById('fishWeight').value) || 0;
  const fishImage = document.getElementById('fishImage').files[0];

  if (!shopName || !fishName || !fishLocation || !phone || !fishPrice || !fishImage) {
    alert("Please fill in all required fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newFish = {
      shopName,
      fishName,
      location: fishLocation,
      phone,
      price: fishPrice,
      weight: fishWeight,
      image: e.target.result, // store image as base64
      seller: shopName
    };

    const fishList = getFishList();
    fishList.push(newFish);
    saveFishList(fishList);

    alert("✅ Fish added successfully!");
    renderSellerFishList(shopName);
  };
  reader.readAsDataURL(fishImage);
});

// Reset form
resetFishBtn.addEventListener('click', () => {
  document.getElementById('fishForm').reset();
});

// Render seller's fish
function renderSellerFishList(shopName) {
  const fishList = getFishList();
  sellerFishListDiv.style.display = 'block';
  sellerFishListDiv.innerHTML = '';

  const myFishes = fishList.filter(fish => fish.seller === shopName);
  if (myFishes.length === 0) {
    sellerFishListDiv.innerHTML = '<p>No fishes added yet.</p>';
    return;
  }

  myFishes.forEach((fish, index) => {
    const div = document.createElement('div');
    div.classList.add('fish-card');
    div.innerHTML = `
      <h3>${fish.fishName} (${fish.weight}kg)</h3>
      <p><strong>Price:</strong> ₹${fish.price}</p>
      <p><strong>Location:</strong> ${fish.location}</p>
      <img src="${fish.image}" alt="${fish.fishName}" style="max-width:100px;"/>
    `;
    sellerFishListDiv.appendChild(div);
  });
}

// Optional: View button
document.getElementById('viewMyFishes').addEventListener('click', () => {
  const shopName = document.getElementById('shopName').value.trim();
  if (!shopName) {
    alert("Please enter your Shop Name first!");
    return;
  }
  renderSellerFishList(shopName);
});





