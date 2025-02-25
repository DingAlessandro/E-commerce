// Cambia immagine principale
function changeImage(src) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = src; // Aggiorna src dell'immagine principale
    } else {
        console.error('Elemento immagine principale non trovato');
    }
}

// Associa eventi click alle miniature
document.addEventListener('DOMContentLoaded', function () {
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    thumbnailItems.forEach(item => {
        item.addEventListener('click', function () {
            const imgSrc = item.querySelector('img').src; // Ottieni src della miniatura
            changeImage(imgSrc); // Cambia immagine principale
        });
    });
});
