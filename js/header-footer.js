document.addEventListener("DOMContentLoaded", function () {
    // Carica i dati dal file JSON
    fetch('header-footer.json')
      .then(response => response.json())
      .then(data => {
        // Gestisci l'header
        const header = data.header;
        const navbar = document.querySelector('.navbar');

        // Modifica il logo
        navbar.querySelector('.navbar-brand img').src = header.logo;
        
        // Aggiungi il link alla home
        const homeLink = navbar.querySelector('.home-link');
        homeLink.href = header.homeLink;
        
        // Gestisci il carrello
        const cartLink = navbar.querySelector('.navbar-cart a');
        cartLink.href = header.cartLink;
        const cartIcon = navbar.querySelector('.navbar-cart img');
        cartIcon.src = header.cartIcon;
        const cartCount = navbar.querySelector('.cart-count');
        cartCount.textContent = header.cartCount;  // Aggiungi il numero del carrello

        // Gestisci il footer
        const footer = data.footer;
        const footerText = document.querySelector('.footer-bottom p');
        footerText.innerHTML = footer.text;
      })
      .catch(error => console.error("Errore nel caricare i dati dell'header e footer:", error));
});
