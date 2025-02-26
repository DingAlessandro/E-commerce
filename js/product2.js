document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');

    if (productName) {
        // Carica i testi dinamici dal file product2.json
        fetch('product2.json')
            .then(response => response.json())
            .then(data => {
                const textContent = data.textContent;

                // Imposta i testi dinamici
                document.getElementById('specs-header').textContent = textContent.specsHeader;
                document.getElementById('colors-header').textContent = textContent.colorsHeader;
                document.getElementById('back-button').textContent = textContent.backButton;

                // Carica i dati del prodotto dal file products.json
                fetch('products.json')
                    .then(response => response.json())
                    .then(data => {
                        const product = data.products.find(item => item.name === productName);

                        if (product) {
                            // Imposta il nome del prodotto
                            document.getElementById('product-name').textContent = product.name;

                            // Popola la tabella delle specifiche
                            const specsTable = document.getElementById('specs-table');
                            if (product.specs && product.specs.length > 0) {
                                const headers = Object.keys(product.specs[0]);
                                specsTable.innerHTML = `<tr>${headers.map(header => `<th>${header.toUpperCase()}</th>`).join('')}</tr>`;
                                product.specs.forEach(spec => {
                                    specsTable.innerHTML += `
                                        <tr>
                                            ${Object.values(spec).map(value => `<td>${value}</td>`).join('')}
                                        </tr>
                                    `;
                                });
                            }

                            // Popola la tabella dei colori
                            const colorsTable = document.getElementById('colors-table');
                            if (product.colors && product.colors.length > 0) {
                                colorsTable.innerHTML = `
                                    <tr>
                                        <th>${textContent.colorHeader}</th>
                                        <th>${textContent.imageHeader}</th>
                                        <th>${textContent.sizesHeader}</th>
                                    </tr>
                                `;
                                product.colors.forEach(color => {
                                    colorsTable.innerHTML += `
                                        <tr>
                                            <td>${color.color_name}</td>
                                            <td><img src="${color.image}" alt="${color.color_name}"></td>
                                            <td>${color.sizes.join(', ')}</td>
                                        </tr>
                                    `;
                                });
                            }
                        } else {
                            console.error("Prodotto non trovato");
                            document.querySelector('.product-specs-colors').innerHTML = `<p>${textContent.productNotFound}</p>`;
                        }
                    })
                    .catch(error => {
                        console.error("Errore nel caricare i dati del prodotto:", error);
                        document.querySelector('.product-specs-colors').innerHTML = `<p>${textContent.productLoadError}</p>`;
                    });
            })
            .catch(error => {
                console.error("Errore nel caricare i testi dinamici:", error);
            });
    } else {
        console.error("Parametro 'name' mancante nell'URL");
        document.querySelector('.product-specs-colors').innerHTML = `<p>${textContent.missingNameParam}</p>`;
    }
});

// Aggiungi un listener per il pulsante "Indietro"
document.getElementById('back-button').addEventListener('click', function() {
    window.history.back(); // Torna indietro nella cronologia del browser
});