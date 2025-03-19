const cartCount = document.querySelector('.cart-count');
let count = 0;

function updateCart() {
    count++;
    cartCount.textContent = count;
}

document.querySelector('.navbar-cart').addEventListener('click', updateCart);