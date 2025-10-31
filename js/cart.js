document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartCountBadge");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  //Update cart badge count
  function updateBadge() {
    const count = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
    cartBadge.textContent = count;
  }

  //Calculate and display total price
  function updateTotal() {
  const total = cart
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartTotal.textContent = `Total: ₱${total.toLocaleString()}`;
  }

  //Render cart items
  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<h5 class="text-center mt-5">🛍️ Your cart is empty.</h5>`;
      cartTotal.textContent = "";
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    cartContainer.innerHTML = cart.map((item, index) => 
    `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0 align-items-center">

          <div class="col-md-1 text-center">
            <input type="checkbox" class="form-check-input item-check" data-index="${index}" ${item.selected ? 'checked' : ''}>
          </div>

          <div class="col-md-2 text-center">
            <img src="${item.images[0]}" class="img-fluid p-2" alt="${item.name}" style="max-height: 120px; object-fit: contain;">
          </div>

          <div class="col-md-5">
            <div class="card-body">
              <h5 class="card-title mb-1">${item.name}</h5>
              <p class="text-muted mb-1">${item.brand}</p>
              <p class="text-success fw-bold mb-0">₱${item.price.toLocaleString()}</p>
            </div>
          </div>

          <div class="col-md-3 d-flex align-items-center justify-content-center">
            <button class="btn btn-outline-secondary btn-sm me-2 decrease" data-index="${index}">−</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm ms-2 increase" data-index="${index}">+</button>
          </div>

          <div class="col-md-1 text-end pe-3">
            <button class="btn btn-danger btn-sm remove" data-index="${index}">✕</button>
          </div>

        </div>
      </div>
    `).join("");

    updateBadge();
    updateTotal();
  }

  //Event delegation for cart actions
  document.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    } else if (e.target.classList.contains("remove")) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  //Checkout functionality
  checkoutBtn.addEventListener("click", () => {
    const selectedItems = cart.filter(item => item.selected);

    if (selectedItems.length === 0) {
      showToast("No items selected", "Please select items to checkout.");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

    window.location.href = 'checkout.html';
  });


  //Handle brand navigation
  document.querySelectorAll('.nav-link[data-brand]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const brand = e.target.dataset.brand;
      window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
    });
  });

  //Handle item selection
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("item-check")) {
      const index = e.target.dataset.index;
      cart[index].selected = e.target.checked;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal();
    }
  });

  //Handle select all
  document.getElementById("selectAll").addEventListener("change", (e) => {
    const checked = e.target.checked;
    cart.forEach(item => item.selected = checked);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });

  //Initialize cart display
  renderCart();
});