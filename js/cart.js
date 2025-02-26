document.addEventListener("DOMContentLoaded", function () {
    // Carica i testi dinamici dal file cart.json
    fetch('cart.json')
        .then(response => response.json())
        .then(data => {
            const textContent = data.textContent;

            // Imposta i testi dinamici
            document.getElementById('cart-title').textContent = textContent.cartTitle;
            document.getElementById('total-amount-label').textContent = textContent.totalAmountLabel;
            document.getElementById('discount-input').placeholder = textContent.discountCodePlaceholder;
            document.getElementById('apply-discount-button').textContent = textContent.applyDiscountButton;
            document.getElementById('discount-error').textContent = textContent.invalidCodeMessage;
            document.getElementById('view-bundle-button').textContent = textContent.viewBundleButton;
            document.getElementById('checkout-button').textContent = textContent.checkoutButton;
            document.getElementById('empty-cart-message').textContent = textContent.emptyCartMessage;
            document.getElementById('purchase-success-title').textContent = textContent.purchaseSuccessTitle;
            document.getElementById('purchase-success-message').textContent = textContent.purchaseSuccessMessage;
            document.getElementById('modal-close-btn').textContent = textContent.closeModalButton;

            // Carica i dati del carrello
            const cartItemsContainer = document.querySelector('.cart-items');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.length === 0) {
                document.getElementById('empty-cart-message').style.display = 'block';
            } else {
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');

                    const itemImage = document.createElement('div');
                    itemImage.classList.add('item-image');
                    const img = document.createElement('img');
                    img.src = item.image || 'images/default-product.jpg';
                    img.alt = item.name;
                    itemImage.appendChild(img);

                    const itemDetails = document.createElement('div');
                    itemDetails.classList.add('item-details');
                    itemDetails.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>Size: ${item.size || '-'}</p>
                        <p>Color: ${item.color}</p>
                        <p class="item-price">Price: US<span class="price">${item.price || '0.00'}</span></p>
                    `;

                    const itemActions = document.createElement('div');
                    itemActions.classList.add('item-actions');
                    itemActions.innerHTML = `
                        <div class="quantity-control">
                            <button class="decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase">+</button>
                        </div>
                        <button class="delete">Delete</button>
                    `;

                    cartItem.appendChild(itemImage);
                    cartItem.appendChild(itemDetails);
                    cartItem.appendChild(itemActions);
                    cartItemsContainer.appendChild(cartItem);

                    const divider = document.createElement('div');
                    divider.classList.add('cart-divider');
                    cartItemsContainer.appendChild(divider);
                });
            }

            initializeCart();
        })
        .catch(error => {
            console.error("Errore nel caricare i testi dinamici:", error);
        });
});

function initializeCart() {
    let isDiscountApplied = false;

    function updateCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        const totalAmount = document.getElementById('total');
        const originalTotalValue = document.getElementById('original-total-value');
        const originalTotal = document.getElementById('original-total');
        const checkoutButton = document.getElementById('checkout-button');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        let total = 0;
        cartItems.forEach(item => {
            const priceText = item.querySelector('.price').textContent.replace('$', '').trim();
            const price = parseFloat(priceText) || 0;
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            total += price * quantity;
        });

        if (isDiscountApplied) {
            originalTotalValue.textContent = total.toFixed(2);
            originalTotal.style.display = 'inline';
            total *= 0.9;
        } else {
            originalTotal.style.display = 'none';
        }

        totalAmount.textContent = total.toFixed(2);

        if (cartItems.length === 0) {
            checkoutButton.disabled = true;
            checkoutButton.style.opacity = 0.5;
            emptyCartMessage.style.display = 'block';
        } else {
            checkoutButton.disabled = false;
            checkoutButton.style.opacity = 1;
            emptyCartMessage.style.display = 'none';
        }
    }

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
            const cartItem = button.closest('.cart-item');
            const nextElement = cartItem.nextElementSibling;

            if (nextElement && nextElement.classList.contains('cart-divider')) {
                nextElement.remove();
            }

            cartItem.remove();
            updateLocalStorage();
            updateCart();
        });
    });

    document.querySelectorAll('.quantity-control').forEach(control => {
        const decreaseButton = control.querySelector('.decrease');
        const increaseButton = control.querySelector('.increase');
        const quantityDisplay = control.querySelector('.quantity');

        let quantity = parseInt(quantityDisplay.textContent);

        decreaseButton.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updateLocalStorage();
                updateCart();
            }
        });

        increaseButton.addEventListener('click', () => {
            quantity++;
            quantityDisplay.textContent = quantity;
            updateLocalStorage();
            updateCart();
        });
    });

    document.querySelector('.discount-code button').addEventListener('click', () => {
        const discountInput = document.querySelector('.discount-code input');
        const discountError = document.querySelector('.discount-error');

        if (isDiscountApplied) {
            discountError.textContent = 'Cannot use multiple codes';
            discountError.style.display = 'block';
            return;
        }

        if (discountInput.value === 'sconto') {
            isDiscountApplied = true;
            discountError.style.display = 'none';
            updateCart();
        } else {
            discountError.textContent = 'Invalid code';
            discountError.style.display = 'block';
        }
    });

    document.getElementById('checkout-button').addEventListener('click', () => {
        const cartItems = document.querySelectorAll('.cart-item');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        document.querySelector('.cart-items').innerHTML = '';
        localStorage.removeItem('cart');
        updateCart();

        const modal = document.getElementById('success-modal');
        modal.style.display = 'flex';

        document.getElementById('modal-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        emptyCartMessage.style.display = 'block';
    });

    updateCart();
}

function updateLocalStorage() {
    const cartItems = document.querySelectorAll('.cart-item');
    const updatedCart = [];

    cartItems.forEach(item => {
        const name = item.querySelector('h3').textContent;
        const size = item.querySelector('p:nth-child(2)').textContent.replace('Size: ', '');
        const color = item.querySelector('p:nth-child(3)').textContent.replace('Color: ', '');
        const price = "$" + item.querySelector('.price').textContent.replace('$', '').trim();
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const image = item.querySelector('img').src;

        updatedCart.push({ name, size, color, price, quantity, image });
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
}