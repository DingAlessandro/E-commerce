document.addEventListener("DOMContentLoaded", function () {
    // Recupera il parametro 'name' dalla query string dell'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');  // nome del prodotto nella query string

    // Recupera l'elemento footer
    const footer = document.querySelector('.footer');

    if (productName) {
        // Carica i dati del prodotto dal JSON
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                // Trova il prodotto che corrisponde al nome
                const product = data.products.find(item => item.name === productName);

                if (product) {
                    // Popola il nome, il prezzo e l'immagine principale
                    document.querySelector('.product-header h1').textContent = product.name;
                    document.querySelector('.product-price').textContent = product.price;

                    const mainImage = document.getElementById('main-image');
                    mainImage.src = product.colors[0].image; // Prima immagine del primo colore
                    mainImage.alt = product.name;

                    // Descrizione del prodotto
                    const description = document.querySelector('.product-description');
                    description.innerHTML = '';
                    description.innerHTML = `<h2>Dettagli del prodotto</h2>`;
                    product.description.forEach(paragraph => {
                        description.innerHTML += `<p>${paragraph}</p>`;
                    });

                    // Popola le specifiche del prodotto
                    const productSpecsTable = document.querySelector('.product-specs table');
                    productSpecsTable.innerHTML = ''; // Pulisce la tabella esistente
                    if (product.specs && product.specs.length > 0) {
                        const headers = Object.keys(product.specs[0]);
                        productSpecsTable.innerHTML = `<tr>${headers.map(header => `<th>${header.toUpperCase()}</th>`).join('')}</tr>`;
                        product.specs.forEach(spec => {
                            productSpecsTable.innerHTML += `
                                <tr>
                                    ${Object.values(spec).map(value => `<td>${value}</td>`).join('')}
                                </tr>
                            `;
                        });
                    }

                    // Popola le opzioni di colore
                    const productOptions = document.querySelector('.product-options');
                    productOptions.innerHTML = ''; // Pulisce le opzioni esistenti

                    product.colors.forEach(color => {
                        const optionDiv = document.createElement('div');
                        optionDiv.classList.add('option');

                        const thumbnailDiv = document.createElement('div');
                        thumbnailDiv.classList.add('thumbnail-item');
                        const colorImage = document.createElement('img');
                        colorImage.src = color.image;
                        colorImage.alt = color.color_name;
                        thumbnailDiv.appendChild(colorImage);

                        const colorName = document.createElement('h3');
                        colorName.textContent = color.color_name;

                        const sizeOptionsDiv = document.createElement('div');
                        sizeOptionsDiv.classList.add('size-options');

                        // Aggiungi il selettore delle taglie, se disponibile
                        if (color.sizes && color.sizes.length > 0) {
                            const sizeSelect = document.createElement('select');
                            color.sizes.forEach(size => {
                                const optionSize = document.createElement('option');
                                optionSize.value = size;
                                optionSize.textContent = `Size ${size}`;
                                sizeSelect.appendChild(optionSize);
                            });
                            sizeOptionsDiv.appendChild(sizeSelect);
                        } else {
                            // Se non ci sono taglie, nascondi il selettore
                            sizeOptionsDiv.style.display = 'none';
                        }

                        // Aggiungi il bottone "Aggiungi al carrello"
                        const addToCartButton = document.createElement('button');
                        addToCartButton.classList.add('add-to-cart');
                        addToCartButton.textContent = 'Aggiungi al carrello';
                        sizeOptionsDiv.appendChild(addToCartButton);

                        optionDiv.appendChild(thumbnailDiv);
                        optionDiv.appendChild(colorName);
                        optionDiv.appendChild(sizeOptionsDiv);

                        productOptions.appendChild(optionDiv);

                        // Cambia l'immagine principale al click sulla miniatura
                        thumbnailDiv.addEventListener('click', function () {
                            mainImage.src = color.image;
                            mainImage.alt = color.color_name;
                        });
                    });

                    // Ripristina il margin-top del footer se il prodotto viene trovato
                    footer.style.marginTop = '110px'; 
                } else {
                    console.error("Prodotto non trovato");
                    // Mostra un messaggio all'utente
                    document.querySelector('.product-detail').innerHTML = "<p>Prodotto non trovato.</p>";
                    
                    // Modifica il margine del footer quando il prodotto non è trovato
                    footer.style.marginTop = '90vh';
                }
            })
            .catch(error => {
                console.error("Errore nel caricare il prodotto:", error);
                // Mostra un messaggio di errore all'utente
                document.querySelector('.product-detail').innerHTML = "<p>Errore nel caricamento dei dati del prodotto.</p>";
                
                // Modifica il margine del footer in caso di errore
                footer.style.marginTop = '90vh';
            });
    } else {
        console.error("Parametro 'name' mancante nell'URL");
        // Mostra un messaggio all'utente se il parametro 'name' è mancante
        document.querySelector('.product-detail').innerHTML = "<p>Parametro 'name' mancante nell'URL.</p>";
        
        // Modifica il margine del footer se il parametro 'name' è mancante
        footer.style.marginTop = '90vh';
    }
});


// Cambia immagine principale
function changeImage(src) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = src; // Aggiorna src dell'immagine principale
    } else {
        console.error('Elemento immagine principale non trovato');
    }
}
