document.getElementById('shopForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('shopName').value.trim();
  const location = document.getElementById('shopLocation').value.trim();
  const phone = document.getElementById('shopPhone').value.trim();
  const files = document.getElementById('shopPhotos').files;

  const fileReaders = [];
  const base64Images = [];

  // 🐐 Convert each uploaded photo to Base64
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    fileReaders.push(
      new Promise((resolve) => {
        reader.onload = (e) => {
          base64Images.push(e.target.result);
          resolve();
        };
        reader.readAsDataURL(files[i]);
      })
    );
  }

  Promise.all(fileReaders).then(() => {
    const newShop = {
      name,
      location,
      phone,
      photos: base64Images
    };

    // 🐐 Store goat shops in localStorage
    const shops = JSON.parse(localStorage.getItem('goatShops')) || [];
    shops.push(newShop);
    localStorage.setItem('goatShops', JSON.stringify(shops));

    alert("✅ Goat shop added successfully!");
    window.location.href = "goat.html";
  });
});
