document.addEventListener("DOMContentLoaded", () => {
  const orderItemDiv = document.getElementById("orderItem");
  const totalAmount = document.getElementById("totalAmount");
  const confirmOrder = document.getElementById("confirmOrder");

  // Get order data from localStorage
  const order = JSON.parse(localStorage.getItem("currentOrder"));

  if (!order || !order.name || !order.price) {
    orderItemDiv.innerHTML = `<p style="color:red;">⚠️ No fish selected. Please go back and choose one from the home page.</p>`;
    return;
  }

  let quantity = 1;

  // Show fish details
  orderItemDiv.innerHTML = `
    <img src="${order.image}" alt="${order.name}" width="120" height="100" />
    <p><strong>Fish:</strong> ${order.name}</p>
    <p><strong>Price per kg:</strong> ₹${order.price}</p>
    <label>Quantity (kg):</label>
    <input type="number" id="fishQty" min="0.5" step="0.5" value="1" />
  `;

  const qtyInput = document.getElementById("fishQty");
  const updateTotal = () => {
    quantity = parseFloat(qtyInput.value);
    const total = (order.price * quantity).toFixed(2);
    totalAmount.textContent = `Total = ₹${total}`;
  };
  qtyInput.addEventListener("input", updateTotal);
  updateTotal();

  confirmOrder.addEventListener("click", () => {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();

    if (!name || !phone || !address) {
      alert("⚠️ Please fill in all customer details!");
      return;
    }

    const total = (order.price * quantity).toFixed(2);
    const message = `
New Fish Order
--------------------
Name: ${name}
Phone: ${phone}
Address: ${address}

Fish: ${order.name}
Quantity: ${quantity} kg
Price: ₹${order.price}
--------------------
Total = ₹${total}
`.trim();

    const whatsappNumber = "9526226011";
    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    console.log("Opening WhatsApp:", whatsappURL); // For debugging

    // ✅ Works on both desktop and mobile
    window.open(whatsappURL, "_blank");
  });
});
