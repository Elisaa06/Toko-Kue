// Main JavaScript file
document.addEventListener("DOMContentLoaded", function () {
  console.log("Document ready!");

  // Initialize Feather Icons
  feather.replace();

  // Toggle class active for hamburger menu
  const navbarNav = document.querySelector(".navbar-nav");
  const hamburger = document.querySelector("#hamburger-menu");

  // When hamburger menu is clicked
  hamburger.onclick = (e) => {
    e.preventDefault();
    navbarNav.classList.toggle("active");
  };

  // Click outside sidebar to hide nav
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });

  // ----- SHOPPING CART FUNCTIONALITY -----
  const cartIcon = document.getElementById("shopping-cart");
  const cartContainer = document.querySelector(".shopping-cart-container");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const clearCartBtn = document.querySelector(".clear-cart-btn");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const notificationToast = document.getElementById("notification-toast");
  const notificationMessage = document.getElementById("notification-message");

  // Cart state
  let cart = [];

  // Initialize cart from localStorage if available
  function initializeCart() {
    const savedCart = localStorage.getItem("cakeCastleCart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
      updateCartTotal();
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cakeCastleCart", JSON.stringify(cart));
  }

  // Open cart
  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    cartContainer.classList.add("open");
  });

  // Close cart
  closeCartBtn.addEventListener("click", function () {
    cartContainer.classList.remove("open");
  });

  // Add item to cart
  function addToCart(name, price, image) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.name === name);

    if (existingItemIndex > -1) {
      // Increment quantity if item exists
      cart[existingItemIndex].quantity += 1;
      showNotification(`${name} jumlah ditambah!`);
    } else {
      // Add new item if it doesn't exist
      cart.push({
        name: name,
        price: price,
        image: image,
        quantity: 1,
      });
      showNotification(`${name} ditambahkan ke keranjang!`);
    }

    updateCartDisplay();
    updateCartTotal();
    saveCart();
  }

  // Remove item from cart
  function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartTotal();
    saveCart();
    showNotification(`${removedItem.name} dihapus dari keranjang`);
  }

  // Increment item quantity
  function incrementQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
    updateCartTotal();
    saveCart();
  }

  // Decrement item quantity
  function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      updateCartDisplay();
      updateCartTotal();
      saveCart();
    } else {
      removeFromCart(index);
    }
  }

  // Clear cart
  function clearCart() {
    cart = [];
    updateCartDisplay();
    updateCartTotal();
    saveCart();
    showNotification("Keranjang telah dikosongkan");
  }

  // Update cart display
  function updateCartDisplay() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<p class="empty-cart">Keranjang belanja masih kosong</p>';
      return;
    }

    cart.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");

      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.name}</h3>
          <p class="cart-item-price">IDR ${formatPrice(item.price)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrement" data-index="${index}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="quantity-btn increment" data-index="${index}">+</button>
            <button class="remove-item" data-index="${index}">
              <i data-feather="trash-2"></i>
            </button>
          </div>
        </div>
      `;

      cartItems.appendChild(cartItemElement);
    });

    // Re-initialize Feather icons for dynamically added content
    feather.replace();

    // Add event listeners to new buttons
    const decrementButtons = document.querySelectorAll(".decrement");
    const incrementButtons = document.querySelectorAll(".increment");
    const removeButtons = document.querySelectorAll(".remove-item");

    decrementButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        decrementQuantity(index);
      });
    });

    incrementButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        incrementQuantity(index);
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        removeFromCart(index);
      });
    });
  }

  // Update cart total
  function updateCartTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.textContent = `IDR ${formatPrice(total)}`;
  }

  // Format price (e.g. 90000 to 90K)
  function formatPrice(price) {
    if (price >= 1000) {
      return `${price / 1000}K`;
    }
    return price.toString();
  }

  // Show notification
  function showNotification(message) {
    notificationMessage.textContent = message;
    notificationToast.classList.add("show");

    setTimeout(() => {
      notificationToast.classList.remove("show");
    }, 3000);
  }

  // Add event listeners to "Add to Cart" buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const menuCard = this.closest(".menu-card");
      const name = menuCard.getAttribute("data-name");
      const price = parseInt(menuCard.getAttribute("data-price"));
      const image = menuCard.querySelector("img").src;

      addToCart(name, price, image);
    });
  });

  // Checkout button event listener
  checkoutBtn.addEventListener("click", function () {
    if (cart.length > 0) {
      alert(
        "Terima kasih telah berbelanja di Cake Castle!\nPesanan Anda akan segera diproses."
      );
      clearCart();
      cartContainer.classList.remove("open");
    } else {
      showNotification("Keranjang belanja masih kosong");
    }
  });

  // Clear cart button event listener
  clearCartBtn.addEventListener("click", clearCart);

  // ----- SEARCH FUNCTIONALITY -----
  const searchIcon = document.getElementById("search");
  const searchWrapper = document.querySelector(".search-wrapper");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const menuCards = document.querySelectorAll(".menu-card");

  // Toggle search form
  searchIcon.addEventListener("click", function (e) {
    e.preventDefault();
    searchWrapper.classList.toggle("visible");
    if (searchWrapper.classList.contains("visible")) {
      searchInput.focus();
    }
  });

  // Close search form when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchWrapper.contains(e.target) && !searchIcon.contains(e.target)) {
      searchWrapper.classList.remove("visible");
    }
  });

  // Search functionality
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      // If search term is empty, show all menu items
      menuCards.forEach((card) => {
        card.classList.remove("hidden");
      });
      return;
    }

    // Filter menu cards based on search term
    let resultsFound = false;

    menuCards.forEach((card) => {
      const title = card
        .querySelector(".menu-card-title")
        .textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        card.classList.remove("hidden");
        resultsFound = true;
      } else {
        card.classList.add("hidden");
      }
    });

    // Show notification if no results found
    if (!resultsFound) {
      showNotification("Tidak ada hasil yang ditemukan");
      // After showing notification, show all items again
      setTimeout(() => {
        menuCards.forEach((card) => {
          card.classList.remove("hidden");
        });
      }, 1500);
    } else {
      // Scroll to menu section
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
      // Close search wrapper
      searchWrapper.classList.remove("visible");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document ready!");

    // ----- CONTACT FORM HANDLING -----
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Tampilkan loading
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";

        // Simulasi pengiriman data
        setTimeout(() => {
          // Reset form
          this.reset();

          // Refresh Feather Icons
          feather.replace();

          // Tampilkan notifikasi
          showNotification("Pesan terkirim! Form telah direset.");

          // Kembalikan tombol
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      });
    }

    // Initialize cart on page load
    initializeCart();
  });
  // Initialize cart on page load
  initializeCart();
});
