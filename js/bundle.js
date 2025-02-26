document.addEventListener("DOMContentLoaded", function () {
    // Carica i dati dal file JSON
    fetch('bundle.json')
        .then(response => response.json())
        .then(data => {
            const bundle = data.bundle;
            const textContent = data.textContent;

            // Imposta il nome, il prezzo e la descrizione del bundle
            document.getElementById('bundle-name').textContent = bundle.name;
            document.getElementById('bundle-price').textContent = bundle.price;
            document.getElementById('bundle-description').textContent = bundle.description;

            // Imposta l'immagine principale del bundle
            const mainImage = document.getElementById('bundle-main-image');
            mainImage.src = bundle.image;
            mainImage.alt = bundle.name;

            // Imposta il testo dinamico per l'header dei dettagli
            document.getElementById('bundle-details-header').textContent = textContent.bundleDetailsHeader;

            // Imposta il testo del pulsante "Aggiungi al carrello"
            document.getElementById('add-bundle-to-cart').textContent = textContent.addToCartButton;

            // Renderizza le opzioni dei prodotti
            const productOptions = document.getElementById('product-options');
            bundle.items.forEach((item, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('option');

                // Immagine thumbnail
                const thumbnailDiv = document.createElement('div');
                thumbnailDiv.classList.add('thumbnail-item');
                const thumbnailImage = document.createElement('img');
                thumbnailImage.src = item.colors[0].image; // Usa la prima immagine come predefinita
                thumbnailImage.alt = item.name;
                thumbnailImage.classList.add('thumbnail-image');
                thumbnailDiv.appendChild(thumbnailImage);

                // Nome del prodotto
                const productName = document.createElement('h3');
                productName.textContent = item.name;

                // Selettori per colore e taglia
                const sizeOptionsDiv = document.createElement('div');
                sizeOptionsDiv.classList.add('size-options');

                // Selettore per il colore
                const colorSelect = document.createElement('select');
                colorSelect.classList.add('color-select');
                item.colors.forEach(color => {
                    const option = document.createElement('option');
                    option.value = color.color_name;
                    option.textContent = color.color_name;
                    colorSelect.appendChild(option);
                });

                // Selettore per la taglia
                const sizeSelect = document.createElement('select');
                sizeSelect.classList.add('size-select');
                item.colors[0].sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = `Size: ${size}`;
                    sizeSelect.appendChild(option);
                });

                // Aggiungi un listener per il cambio di colore
                colorSelect.addEventListener('change', function () {
                    // Aggiorna l'immagine thumbnail
                    const selectedColor = item.colors.find(color => color.color_name === this.value);
                    thumbnailImage.src = selectedColor.image;

                    // Aggiorna le opzioni della taglia in base al colore selezionato
                    sizeSelect.innerHTML = '';
                    selectedColor.sizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.textContent = `Size: ${size}`;
                        sizeSelect.appendChild(option);
                    });
                });

                // Aggiungi i selettori al div delle opzioni
                sizeOptionsDiv.appendChild(colorSelect);
                sizeOptionsDiv.appendChild(sizeSelect);

                // Aggiungi gli elementi al div dell'opzione
                optionDiv.appendChild(thumbnailDiv);
                optionDiv.appendChild(productName);
                optionDiv.appendChild(sizeOptionsDiv);

                // Aggiungi il div dell'opzione al contenitore delle opzioni
                productOptions.appendChild(optionDiv);

                // Aggiungi un divisore tra le opzioni (tranne l'ultima)
                if (index < bundle.items.length - 1) {
                    const divider = document.createElement('div');
                    divider.classList.add('thumbnail-divider');
                    productOptions.appendChild(divider);
                }
            });

            // Renderizza le specifiche dei prodotti
            const productSpecs = document.getElementById('product-specs');
            bundle.items.forEach(item => {
                const specsDiv = document.createElement('div');
                specsDiv.classList.add('product-specs');

                const specsHeader = document.createElement('h2');
                specsHeader.textContent = `${item.name} ${textContent.detailsHeader}`;

                const specsLink = document.createElement('a');
                specsLink.classList.add('specs');
                specsLink.href = `product2.html?name=${encodeURIComponent(item.name)}`;
                specsLink.textContent = textContent.viewDetails;

                specsDiv.appendChild(specsHeader);
                specsDiv.appendChild(specsLink);
                productSpecs.appendChild(specsDiv);
            });

            // Aggiungi un listener per il pulsante "Aggiungi al carrello"
            const addBundleToCartButton = document.getElementById('add-bundle-to-cart');
            addBundleToCartButton.addEventListener('click', function () {
                addBundleToCart(bundle);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dei dati del bundle:", error);
        });
});

// Funzione per aggiungere il bundle al carrello
function addBundleToCart(bundle) {
    // Recupera il carrello dal localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Crea un oggetto per il bundle
    const bundleItem = {
        name: bundle.name,
        price: bundle.price,
        image: bundle.image,
        quantity: 1,
        color: '',
        size: ''
    };

    // Raccogli le informazioni su colore e taglia per ogni prodotto nel bundle
    const colorInfo = [];
    const sizeInfo = [];

    bundle.items.forEach(item => {
        const h3Elements = document.querySelectorAll('.option h3');
        let optionDiv = null;

        h3Elements.forEach(h3 => {
            if (h3.textContent === item.name) {
                optionDiv = h3.parentElement;
            }
        });

        if (optionDiv) {
            const colorSelect = optionDiv.querySelector('.color-select');
            const sizeSelect = optionDiv.querySelector('.size-select');

            const selectedColor = colorSelect ? colorSelect.value : 'N/A';
            const selectedSize = sizeSelect ? sizeSelect.value : 'N/A';

            colorInfo.push(`${item.name}=${selectedColor}`);
            sizeInfo.push(`${item.name}=${selectedSize}`);
        }
    });

    // Unisci le informazioni su colore e taglia in stringhe
    bundleItem.color = colorInfo.join(', ');
    bundleItem.size = sizeInfo.join(', ');

    // Controlla se il bundle è già nel carrello
    const existingBundle = cart.find(item => item.name === bundleItem.name);

    if (existingBundle) {
        existingBundle.quantity += 1;
    } else {
        cart.push(bundleItem);
    }

    // Salva il carrello aggiornato nel localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Bundle aggiunto al carrello!');
}