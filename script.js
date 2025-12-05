const API_URL = "http://localhost:8000"; 

// Gestion des clics sur les filtres
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active'); // Ajoute ou enlève la classe "active"
    });
});

document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) return;

    // 1. Récupérer les plateformes sélectionnées
    const activeButtons = document.querySelectorAll('.filter-btn.active');
    const selectedPlatforms = Array.from(activeButtons).map(btn => btn.getAttribute('data-platform'));

    resultsDiv.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Recherche en cours...</p>';

    try {
        let allData = [];

        // CAS 1 : Aucun filtre sélectionné -> On appelle la recherche globale "/search"
        if (selectedPlatforms.length === 0) {
            console.log("Recherche globale");
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            data = data.results || [];
            allData = Array.isArray(data) ? data : [data];
        } 
        // CAS 2 : Filtres sélectionnés -> On appelle "/search/{platform}" en PARALLÈLE
        else {
            console.log("Recherche ciblée :", selectedPlatforms);
            
            // On crée une liste de requêtes (Promesses)
            const promises = selectedPlatforms.map(platform => {
                // Chaque fetch est indépendant
                return fetch(`${API_URL}/search/${platform}?q=${encodeURIComponent(query)}`)
                    .then(res => {
                        if (!res.ok) throw new Error('Network response was not ok');
                        return res.json();
                    })
                    .then(jsonResponse => {
                        // MODIFICATION ICI : On extrait .results pour chaque plateforme
                        return jsonResponse.results || [];
                    })
                    .catch(err => {
                        console.error(`Erreur sur ${platform}:`, err);
                        return []; // En cas d'erreur sur UNE plateforme, on renvoie une liste vide pour ne pas tout bloquer
                    });
            });

            // On attend que TOUTES les requêtes soient finies
            const results = await Promise.all(promises);

            // "results" est un tableau de tableaux (ex: [[resSoundcloud], [resSpotify]])
            // On utilise .flat() pour tout mettre dans un seul tableau
            allData = results.flat();
        }

        // --- Affichage des résultats (Identique à avant) ---
        resultsDiv.innerHTML = '';

        if (allData.length === 0) {
            resultsDiv.innerHTML = '<p style="text-align:center; width:100%;">Aucun résultat trouvé.</p>';
            return;
        }

        allData.forEach(item => {
            const card = document.createElement('div');
            const platformClass = item.source ? item.source.toLowerCase() : 'default';
            card.className = `card ${platformClass}`;

            let imageHtml;
            if (item.artwork_url) {
                imageHtml = `<img src="${item.artwork_url}" class="cover-img" alt="Cover">`;
            } else {
                imageHtml = `<div class="no-cover">Pas d'image</div>`;
            }

            card.innerHTML = `
                <div class="cover-container">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <div class="info-top">
                        <span class="platform-tag">${item.source || 'Inconnu'}</span>
                        <h3 class="track-title" title="${item.title}">${item.title || 'Sans titre'}</h3>
                        <p class="track-artist">${item.artist || 'Artiste inconnu'}</p>
                    </div>
                    <button class="download-btn" onclick="downloadItem('${item.source}', '${item.id}')">
                        Télécharger
                    </button>
                </div>
            `;
            resultsDiv.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur globale:', error);
        resultsDiv.innerHTML = '<p style="color:red; text-align:center;">Erreur lors de la recherche.</p>';
    }
}

function downloadItem(platform, id) {
    const url = `${API_URL}/${platform}/${id}`;
    fetch(url).then(res => {
        if(res.ok) alert("Téléchargement lancé !");
    }).catch(err => console.error(err));
}