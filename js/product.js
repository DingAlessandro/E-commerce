document.addEventListener("DOMContentLoaded", function () {
    // Carica i dati dal file JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const textContent = data.textContent;

            // Recupera il parametro 'name' dalla query string dell'URL
            const urlParams = new URLSearchParams(window.location.search);
            const productName = urlParams.get('name');

            // Recupera l'elemento footer
            const footer = document.querySelector('.footer');

            if (productName) {
                // Trova il prodotto che corrisponde al nome
                const product = products.find(item => item.name === productName);

                if (product) {
                    // Popola il nome, il prezzo e l'immagine principale
                    document.getElementById('product-name').textContent = product.name;
                    document.getElementById('product-price').textContent = product.price;

                    const mainImage = document.getElementById('main-image');
                    mainImage.src = product.colors[0].image; // Prima immagine del primo colore
                    mainImage.alt = product.name;

                    // Popola la descrizione del prodotto
                    const description = document.getElementById('product-description');
                    description.innerHTML = `<h2>${textContent.productDetailsHeader}</h2>`;
                    product.description.forEach(paragraph => {
                        description.innerHTML += `<p>${paragraph}</p>`;
                    });

                    // Popola le opzioni di colore
                    const productOptions = document.getElementById('product-options');
                    productOptions.innerHTML = ''; // Pulisce le opzioni esistenti

                    product.colors.forEach((color, index) => {
                        const optionDiv = document.createElement('div');
                        optionDiv.classList.add('option');

                        // Immagine thumbnail
                        const thumbnailDiv = document.createElement('div');
                        thumbnailDiv.classList.add('thumbnail-item');
                        const colorImage = document.createElement('img');
                        colorImage.src = color.image;
                        colorImage.alt = color.color_name;
                        thumbnailDiv.appendChild(colorImage);

                        // Nome del colore
                        const colorName = document.createElement('h3');
                        colorName.textContent = color.color_name;

                        // Selettore per la taglia
                        const sizeOptionsDiv = document.createElement('div');
                        sizeOptionsDiv.classList.add('size-options');

                        let sizeSelect = null;
                        if (color.sizes && color.sizes.length > 0) {
                            sizeSelect = document.createElement('select');
                            sizeSelect.classList.add('size-select');
                            color.sizes.forEach(size => {
                                const optionSize = document.createElement('option');
                                optionSize.value = size;
                                optionSize.textContent = `Size ${size}`;
                                sizeSelect.appendChild(optionSize);
                            });
                            sizeOptionsDiv.appendChild(sizeSelect);
                        } else {
                            sizeOptionsDiv.style.display = 'none';
                        }

                        // Bottone "Aggiungi al carrello"
                        const addToCartButton = document.createElement('button');
                        addToCartButton.classList.add('add-to-cart');
                        addToCartButton.textContent = textContent.addToCartButton;
                        sizeOptionsDiv.appendChild(addToCartButton);

                        optionDiv.appendChild(thumbnailDiv);
                        optionDiv.appendChild(colorName);
                        optionDiv.appendChild(sizeOptionsDiv);

                        productOptions.appendChild(optionDiv);

                        // Aggiungi un divisore tra le opzioni (tranne l'ultima)
                        if (index < product.colors.length - 1) {
                            const divider = document.createElement('div');
                            divider.classList.add('thumbnail-divider');
                            productOptions.appendChild(divider);
                        }

                        // Cambia l'immagine principale al click sulla miniatura
                        thumbnailDiv.addEventListener('click', function () {
                            mainImage.src = color.image;
                            mainImage.alt = color.color_name;
                        });

                        // Aggiungi il prodotto al carrello
                        addToCartButton.addEventListener('click', function () {
                            const selectedSize = sizeSelect ? sizeSelect.value : null;
                            addToCart(product.name, color.color_name, selectedSize, color.image, product.price);
                        });
                    });

                    // Popola le specifiche del prodotto
                    const productSpecs = document.getElementById('product-specs');
                    productSpecs.innerHTML = `
                        <h2>${textContent.productSpecsHeader}</h2>
                        <a id="view-specs-link" class="specs" href="product2.html?name=${encodeURIComponent(productName)}">${textContent.viewSpecsLink}</a>
                    `;

                    // Ripristina il margin-top del footer
                    footer.style.marginTop = '110px';
                } else {
                    console.error("Prodotto non trovato");
                    document.querySelector('.product-detail').innerHTML = `<p>${textContent.productNotFound}</p>`;
                    footer.style.marginTop = '90vh';
                }
            } else {
                console.error("Parametro 'name' mancante nell'URL");
                document.querySelector('.product-detail').innerHTML = `<p>${textContent.missingNameParam}</p>`;
                footer.style.marginTop = '90vh';
            }
        })
        .catch(error => {
            console.error("Errore nel caricamento dei dati del prodotto:", error);
            document.querySelector('.product-detail').innerHTML = `<p>${textContent.productLoadError}</p>`;
            footer.style.marginTop = '90vh';
        });
});

// Funzione per aggiungere un prodotto al carrello
function addToCart(productName, color, size, image, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItem = {
        name: productName,
        color: color,
        size: size,
        image: image,
        price: price,
        quantity: 1
    };

    const existingItem = cart.find(item => 
        item.name === cartItem.name && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Prodotto aggiunto al carrello!');
}