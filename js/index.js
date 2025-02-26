
document.addEventListener("DOMContentLoaded", function () {
    // Carica i dati dal file JSON
    fetch('index.json')
        .then(response => response.json())
        .then(data => {
            // Gestisci l'hero image
            const hero = data.hero;
            const heroImage = document.querySelector('.hero-image img');
            heroImage.src = hero.image;
            heroImage.alt = hero.alt;

            // Gestisci la griglia dei prodotti
            const productGrid = document.querySelector('.product-grid');
            data.products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.dataset.name = product.name;

                const tag = product.tag ? `<div class="product-tag">${product.tag}</div>` : '';

                productItem.innerHTML = `
            ${tag}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.price}</p>
            </div>
          `;

                // Supponiamo che tu abbia un array di prodotti
                productItem.addEventListener('click', function () {
                    // Passa il nome del prodotto tramite l'URL
                    window.location.href = `product.html?name=${encodeURIComponent(product.name)}`;
                });


                productGrid.appendChild(productItem);
            });
        })
        .catch(error => console.error("Errore nel caricare i dati dei prodotti:", error));
});
