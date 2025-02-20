// Fonction pour récupérer les villes basées sur le code postal
async function fetchCities(postalCode) {
    try {
        const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom`);
        const cities = await response.json();
        return cities;
    } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        return [];
    }
}

// Mise à jour de la liste des villes quand le code postal change
document.addEventListener('DOMContentLoaded', function() {
    const postalCodeInput = document.getElementById('postalCode');
    const citySelect = document.getElementById('city');
    const contactForm = document.getElementById('contactForm');

    let timeout = null;

    postalCodeInput.addEventListener('input', function(e) {
        const postalCode = e.target.value;
        
        // Validation du code postal (5 chiffres)
        if (!/^\d{5}$/.test(postalCode)) {
            citySelect.innerHTML = '<option value="">Sélectionnez une ville</option>';
            citySelect.disabled = true;
            return;
        }

        // Debounce pour éviter trop d'appels API
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            citySelect.disabled = true;
            citySelect.innerHTML = '<option value="">Chargement...</option>';

            const cities = await fetchCities(postalCode);
            
            citySelect.innerHTML = '<option value="">Sélectionnez une ville</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.nom;
                option.textContent = city.nom;
                citySelect.appendChild(option);
            });
            
            citySelect.disabled = false;
        }, 300);
    });

    // Gestion de l'envoi du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des valeurs du formulaire
        const establishment = document.getElementById('establishment').value;
        const postalCode = document.getElementById('postalCode').value;
        const city = document.getElementById('city').value;
        const contact = document.getElementById('contact').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        // Construction du corps du mail
        const mailBody = `
Nom de l'établissement : ${establishment}
Code Postal : ${postalCode}
Ville : ${city}
Personne à contacter : ${contact}
Téléphone : ${phone}
Email : ${email}
        `.trim();

        // Création du lien mailto
        const mailtoLink = `mailto:ruddyboyer@live.fr?subject=Nouvelle demande de contact - ${establishment}&body=${encodeURIComponent(mailBody)}`;
        
        // Ouverture du client mail
        window.location.href = mailtoLink;
    });
});
