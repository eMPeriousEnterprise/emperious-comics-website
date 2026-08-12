const products = [
  { id: 1, title: "Carnage U.S.A.", price: 5.99, image: "images/caranageusa.jpg" },
  { id: 2, title: "Peter Parker The Spectacular Spider-man", price: 4.99, image: "images/peterparkerthespectacularspiderman.jpg" },
  { id: 3, title: "Moon Knight", price: 6.49, image: "images/moonKnight.jpg" },
  { id: 4, title: "Uncanny X-Men #6", price: 7.99, image: "images/Uncanny%20X-Men%20%236.jpg" },
  { id: 5, title: "Iron Ghost #3", price: 5.49, image: "https://placehold.co/300x450/2a0a0a/e31c25?text=Iron+Ghost+%233" },
  { id: 6, title: "Nebula Tales #8", price: 4.49, image: "https://placehold.co/300x450/1e1b4b/818cf8?text=Nebula+Tales+%238" },
  { id: 7, title: "Red Vengeance #1", price: 6.99, image: "https://placehold.co/300x450/450a0a/f87171?text=Red+Vengeance+%231" },
  { id: 8, title: "Blue Horizon #15", price: 5.99, image: "https://placehold.co/300x450/172554/60a5fa?text=Blue+Horizon+%2315" }
];

const CART_KEY = "emperious_cart";

const productGrid = document.getElementById("product-grid");
const cartToggle = document.getElementById("cart-toggle");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.title} cover" class="product-cover" loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    </article>
  `).join("");

  productGrid.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.dataset.id, 10);
      addToCart(id);
    });
  });
}

function addToCart(id) {
  const cart = loadCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    if (product) cart.push({ id, title: product.title, price: product.price, qty: 1 });
  }
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(id) {
  let cart = loadCart().filter(c => c.id !== id);
  saveCart(cart);
  updateCartUI();
}

function changeQty(id, delta) {
  const cart = loadCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
  }
  saveCart(cart);
  updateCartUI();
}

function updateCartUI() {
  const cart = loadCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `<li class="empty-cart">Your cart is empty.</li>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <li class="cart-item">
        <div>
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" aria-label="Decrease quantity" data-id="${item.id}" data-delta="-1">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" aria-label="Increase quantity" data-id="${item.id}" data-delta="1">+</button>
          <button class="remove-item" data-id="${item.id}" aria-label="Remove item">Remove</button>
        </div>
      </li>
    `).join("");

    cartItems.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        changeQty(parseInt(btn.dataset.id, 10), parseInt(btn.dataset.delta, 10));
      });
    });

    cartItems.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id, 10)));
    });
  }
}

function openCart() {
  cartModal.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartModal.setAttribute("aria-hidden", "true");
}

cartToggle.addEventListener("click", openCart);
closeModal.addEventListener("click", closeCart);
cartModal.querySelector(".modal-backdrop").addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  alert("Checkout is not connected yet. Replace this with your payment or order form.");
});

renderProducts();
updateCartUI();
