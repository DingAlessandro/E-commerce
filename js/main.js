// 示例：更新购物车数量
const cartCount = document.querySelector('.cart-count');
let count = 0;

function updateCart() {
    count++;
    cartCount.textContent = count;
}

// 点击购物车图标时更新数量
document.querySelector('.navbar-cart').addEventListener('click', updateCart);