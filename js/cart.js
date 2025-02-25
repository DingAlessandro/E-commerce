let isDiscountApplied = false; // 标记是否已应用折扣

// 更新总金额和按钮状态的函数
function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const totalAmount = document.getElementById('total');
    const originalTotalValue = document.getElementById('original-total-value');
    const originalTotal = document.getElementById('original-total');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let total = 0;
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent);
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        total += price * quantity;
    });

    // 更新总金额
    if (isDiscountApplied) {
        originalTotalValue.textContent = total.toFixed(2); // 显示原价
        originalTotal.style.display = 'inline'; // 显示划掉的原价
        total = total * 0.9; // 应用 10% 折扣
    } else {
        originalTotal.style.display = 'none'; // 隐藏原价
    }
    totalAmount.textContent = total.toFixed(2);

    // 检查购物车是否为空
    if (cartItems.length === 0) {
        checkoutButton.disabled = true; // 禁用按钮
        checkoutButton.style.opacity = 0.5; // 按钮变淡
        emptyCartMessage.style.display = 'block'; // 显示提示信息
    } else {
        checkoutButton.disabled = false; // 启用按钮
        checkoutButton.style.opacity = 1; // 按钮恢复正常
        emptyCartMessage.style.display = 'none'; // 隐藏提示信息
    }
}

// 删除商品的逻辑
document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
        const cartItem = button.closest('.cart-item');
        const previousElement = cartItem.previousElementSibling;

        // 如果前一个元素是分割线，则一起删除
        if (previousElement && previousElement.classList.contains('cart-divider')) {
            previousElement.remove();
        }

        // 删除商品
        cartItem.remove();
        updateCart(); // 更新总金额和按钮状态
    });
});

// 增加和减少商品数量的逻辑
document.querySelectorAll('.quantity-control').forEach(control => {
    const decreaseButton = control.querySelector('.decrease');
    const increaseButton = control.querySelector('.increase');
    const quantityDisplay = control.querySelector('.quantity');

    let quantity = parseInt(quantityDisplay.textContent);

    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            updateCart(); // 更新总金额和按钮状态
        }
    });

    increaseButton.addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
        updateCart(); // 更新总金额和按钮状态
    });
});

// 优惠码逻辑
document.querySelector('.discount-code button').addEventListener('click', () => {
    const discountInput = document.querySelector('.discount-code input');
    const discountError = document.querySelector('.discount-error');

    if (isDiscountApplied) {
        discountError.textContent = '不能使用多个码';
        discountError.style.display = 'block';
        return;
    }

    if (discountInput.value === 'sconto') {
        isDiscountApplied = true; // 标记已应用折扣
        discountError.style.display = 'none'; // 隐藏错误提示
        updateCart(); // 更新总金额
    } else {
        discountError.textContent = 'Codice non valido';
        discountError.style.display = 'block'; // 显示错误提示
    }
});

// 初始化
updateCart();