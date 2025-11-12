document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  // Create a WhatsApp message
  const whatsappMessage = `
New Inquiry from Chicken Port
-------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
-------------------------
Sent via Chicken Port Contact Page
  `;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/9526226011?text=${encodedMessage}`, '_blank');

  // Reset form
  this.reset();

  // Fancy alert
  alert('✅ Thank you for reaching out! We will get back to you soon.');
});
