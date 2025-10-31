document.addEventListener("DOMContentLoaded", () => {
  const orderItemsContainer = document.getElementById("orderItems");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const orderTotalElement = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  const SHIPPING_FEE = 150;
  let cart = JSON.parse(localStorage.getItem("checkoutItems")) || [];

  //Redirect if cart is empty
  if (cart.length === 0) {
    showToast("Empty Cart", "Your cart is empty!");
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 5000);
    return;
  }

  //Render order summary
  function renderOrderSummary() {
    const itemsHTML = cart.map(item => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
          <img src="${item.images[0]}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;" class="me-2">
          <div>
            <small class="d-block">${item.name}</small>
            <small class="text-muted">Qty: ${item.quantity}</small>
          </div>    
        </div>
        <span>₱${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    orderItemsContainer.innerHTML = itemsHTML;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;

    subtotalElement.textContent = `₱${subtotal.toLocaleString()}`;
    shippingElement.textContent = `₱${SHIPPING_FEE.toLocaleString()}`;
    orderTotalElement.textContent = `₱${total.toLocaleString()}`;
  }

  //Handle form submission
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //Validate form
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    //Get form data
    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      province: document.getElementById("province").value,
      zipCode: document.getElementById("zipCode").value,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    //Create order object
    const order = {
      orderNumber: 'ORD-' + Date.now(),
      date: new Date().toLocaleString(),
      customer: formData,
      items: cart,
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping: SHIPPING_FEE,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + SHIPPING_FEE
    };

    //Remove only the selected items from the real cart
    let originalCart = JSON.parse(localStorage.getItem("cart")) || [];
    let remainingCart = originalCart.filter(item => !item.selected);
    localStorage.setItem("cart", JSON.stringify(remainingCart));

    //Clear temporary checkout store
    localStorage.removeItem("checkoutItems");

    //Show success message
    showToast('Order Placed', `Order placed successfully! \nOrder Number: ${order.orderNumber} \n\nThank you for shopping with OnWear! 🛍️`)
    
    setTimeout(() => {
       window.location.href = '../index.html';
      }, 5000);
  });

  //Handle brand navigation
  document.querySelectorAll('.nav-link[data-brand]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const brand = e.target.dataset.brand;
      window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
    });
  });

  //Update cart badge
  function updateCartBadge() {
    const badge = document.getElementById("cartCountBadge");
    badge.textContent = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
  }

  //Initialize
  renderOrderSummary();
  updateCartBadge();
});