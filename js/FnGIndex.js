async function fetchCryptoIndex() {
    try {
        const response = await fetch("https://api.alternative.me/fng/");
        console.log(response);
        const data = await response.json();
        const value = data.data[0].value;
        const sentiment = data.data[0].value_classification;

        document.querySelector("#crypto-index .countdown").textContent =
            `${value} (${sentiment})`;
    } catch (error) {
        document.querySelector("#crypto-index .countdown").textContent =
            "Erreur de chargement de l'indice.";
    }
}

// Appeler l'API au chargement et actualiser toutes les heures
fetchCryptoIndex();
setInterval(fetchCryptoIndex, 60 * 60 * 1000); // Toutes les heures