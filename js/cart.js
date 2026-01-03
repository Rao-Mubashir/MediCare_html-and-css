// MediCare Central Cart Logic
const CART_STORAGE_KEY = 'medicare_cart';

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);

    // Optional: Visual feedback if event target exists
    if (window.event && window.event.currentTarget) {
        const btn = window.event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Added!</span>';
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
        }, 2000);
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    // If we are on the cart page, re-render
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// Update quantity
function updateQuantity(productId, delta) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart(cart);
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// Update the shopping cart icon badge
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Format price
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Initialize badge on every page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
