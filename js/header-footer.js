document.addEventListener("DOMContentLoaded", function () {
  
  // Carica i dati dal file JSON
  fetch('header-footer.json')
      .then(response => {
          if (!response.ok) {
              throw new Error("Errore nel caricare il file JSON: " + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          // Gestisci l'header
          const header = data.header;
          const navbar = document.querySelector('.navbar');

          if (!navbar) {
              console.error("Elemento .navbar non trovato nel DOM.");
              return;
          }

          // Modifica il logo
          const logoImg = navbar.querySelector('.navbar-brand img');
          if (logoImg) {
              logoImg.src = header.logo;
          } else {
              console.error("Elemento .navbar-brand img non trovato nel DOM.");
          }

          // Aggiungi il link alla home
          const homeLink = navbar.querySelector('.home-link');
          if (homeLink) {
              homeLink.href = header.homeLink; // Imposta il link alla home
              homeLink.textContent = header.homeText; // Imposta il testo del link dalla JSON
          } else {
              console.error("Elemento .home-link non trovato nel DOM.");
          }

          // Gestisci il carrello
          const cartLink = navbar.querySelector('.navbar-cart a');
          if (cartLink) {
              cartLink.href = header.cartLink;
          } else {
              console.error("Elemento .navbar-cart a non trovato nel DOM.");
          }

          const cartIcon = navbar.querySelector('.navbar-cart img');
          if (cartIcon) {
              cartIcon.src = header.cartIcon;
          } else {
              console.error("Elemento .navbar-cart img non trovato nel DOM.");
          }

          // Gestisci il footer
          const footer = data.footer;
          const footerText = document.querySelector('.footer-bottom p');
          if (footerText) {
              footerText.innerHTML = footer.text;
          } else {
              console.error("Elemento .footer-bottom p non trovato nel DOM.");
          }
      })
      .catch(error => console.error("Errore nel caricare i dati dell'header e footer:", error));
});

