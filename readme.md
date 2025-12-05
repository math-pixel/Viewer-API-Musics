# 🎵 Mixxx API Browser

Interface de recherche et téléchargement de musique pour Mixxx, connectée à une API multi-plateformes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Mixxx](https://img.shields.io/badge/Mixxx-2.5.3+-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Reference](#-api-reference)
- [Plateformes supportées](#-plateformes-supportées)
- [Dépannage](#-dépannage)
- [Contribuer](#-contribuer)

---

## ✨ Fonctionnalités

- 🔍 **Recherche multi-plateformes** - Recherchez sur SoundCloud, YouTube, Deezer et Spotify simultanément
- ⬇️ **Téléchargement direct** - Téléchargez les tracks en MP3 320kbps
- 🎚️ **Intégration Mixxx** - Chargez les tracks directement dans vos decks
- 🖼️ **Artwork automatique** - Récupération des pochettes d'album
- 🎵 **Détection BPM** - Récupération automatique du BPM (Deezer, Spotify)
- 📱 **Interface responsive** - Fonctionne sur desktop et tablette
- 🌙 **Mode sombre** - Interface optimisée pour le DJing

---

## 📦 Prérequis

### Pour l'API (Backend)

- **Python 3.10+**
- **FFmpeg** (pour la conversion audio)
- **yt-dlp** (installé automatiquement)

### Pour l'interface (Frontend)

- **Navigateur moderne** (Chrome, Firefox, Edge)
- Aucun serveur requis !

### Pour Mixxx

- **Mixxx 2.5.0+** recommandé

---

## 🚀 Installation

### Étape 1 : Cloner l'API

```bash
# Cloner le repository de l'API
git clone https://github.com/math-pixel/API-Download-Music
cd music-api

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Étape 2 : Configurer l'API

Créez un fichier `.env` à la racine du projet API :

```env
# Configuration générale
HOST=0.0.0.0
PORT=3000
DEBUG=true

# Spotify (optionnel - pour recherche Spotify)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# YouTube (optionnel - améliore les résultats)
YOUTUBE_API_KEY=your_api_key

# Dossier de téléchargement
DOWNLOAD_PATH=./downloads
```

### Étape 3 : Lancer l'API

```bash
# Depuis le dossier de l'API
python -m uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

L'API sera disponible sur : `http://localhost:3000`

### Étape 4 : Ouvrir l'interface

```bash
# Aucun serveur nécessaire !
# Double-cliquez simplement sur le fichier :

index.html
```

Ou ouvrez-le dans votre navigateur :
```
file:///chemin/vers/index.html
```

---

## ⚙️ Configuration

### Configuration de l'interface

Modifiez les paramètres dans `index.html` ou `config.js` :

```javascript
const CONFIG = {
    // URL de votre API
    API_URL: "http://localhost:3000",
    
    // Dossier de téléchargement (relatif à l'API)
    DOWNLOAD_DIR: "downloads",
    
    // Nombre de résultats par recherche
    SEARCH_LIMIT: 20,
    
    // Deck par défaut pour le chargement
    DEFAULT_DECK: 1,
    
    // Activer les logs de debug
    DEBUG: true
};
```

### Configuration Mixxx

Pour que les fichiers téléchargés apparaissent dans Mixxx :

1. Ouvrez **Mixxx**
2. Allez dans **Préférences** → **Bibliothèque**
3. Cliquez sur **Ajouter un dossier**
4. Sélectionnez le dossier `downloads` de l'API

---

## 🎮 Utilisation

### Recherche basique

1. **Ouvrez** `index.html` dans votre navigateur
2. **Tapez** votre recherche dans la barre
3. **Sélectionnez** une plateforme (ou "Toutes")
4. **Cliquez** sur 🔍 ou appuyez sur `Entrée`

### Téléchargement et chargement

1. **Trouvez** la track souhaitée
2. **Cliquez** sur le bouton de téléchargement ⬇️
3. **Attendez** la fin du téléchargement
4. **Chargez** dans Mixxx automatiquement ou manuellement

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Entrée` | Lancer la recherche |
| `Échap` | Effacer la recherche |
| `1-4` | Sélectionner le deck |
| `D` | Télécharger la track sélectionnée |
| `Espace` | Play/Pause preview |

---

## 📡 API Reference

### Informations

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Informations de l'API |
| `GET` | `/platforms` | Liste des plateformes disponibles |

### Recherche

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/search?q={query}` | Recherche sur toutes les plateformes |
| `GET` | `/search/{platform}?q={query}` | Recherche sur une plateforme spécifique |

**Paramètres de recherche :**

| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `q` | string | Terme de recherche (obligatoire) | - |
| `limit` | int | Nombre de résultats | 20 |

**Exemple :**
```bash
curl "http://localhost:3000/search/soundcloud?q=daft%20punk&limit=10"
```

### Tracks

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/track/{source}/{track_id}` | Informations d'une track |

**Exemple :**
```bash
curl "http://localhost:3000/track/soundcloud/sc_123456789"
```

### Téléchargement

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/download/{source}/{track_id}` | Télécharger une track (MP3) |

**Exemple :**
```bash
curl "http://localhost:3000/download/youtube/dQw4w9WgXcQ" --output track.mp3
```

### Format de réponse Track

```json
{
    "id": "sc_123456789",
    "title": "Get Lucky",
    "artist": "Daft Punk",
    "album": "Random Access Memories",
    "source": "soundcloud",
    "url": "https://soundcloud.com/daftpunk/get-lucky",
    "duration": 248,
    "bpm": 116.0,
    "artwork_url": "https://i1.sndcdn.com/artworks-xxx-t300x300.jpg",
    "genre": "Electronic"
}
```

---

## 🎧 Plateformes supportées

| Plateforme | Recherche | Téléchargement | BPM | Artwork |
|------------|:---------:|:--------------:|:---:|:-------:|
| SoundCloud | ✅ | ✅ | ❌ | ✅ |
| YouTube | ✅ | ✅ | ❌ | ✅ |
| Deezer | ✅ | ✅* | ✅ | ✅ |
| Spotify | ✅ | ❌** | ✅ | ✅ |

\* *Deezer télécharge via YouTube avec correspondance automatique*  
\** *Spotify ne permet pas le téléchargement direct (DRM)*

### Qualité audio

| Plateforme | Format | Bitrate |
|------------|--------|---------|
| SoundCloud | MP3 | 128-320 kbps |
| YouTube | MP3 | 320 kbps |
| Deezer | MP3 | 320 kbps |

---

## 📁 Structure du projet

```
mixxx-api-browser/
├── index.html              # Interface principale (ouvrir directement)
├── css/
│   └── style.css          # Styles de l'interface
├── js/
│   ├── app.js             # Application principale
│   ├── api-client.js      # Client API
│   └── config.js          # Configuration
├── assets/
│   └── icons/             # Icônes de l'interface
└── README.md              # Ce fichier

# API (repository séparé)
music-api/
├── main.py                # Point d'entrée FastAPI
├── app/
│   ├── platforms/
│   │   ├── soundcloud.py
│   │   ├── youtube.py
│   │   ├── deezer.py
│   │   └── spotify.py
│   ├── models/
│   │   └── track.py
│   └── routers/
│       ├── search.py
│       └── download.py
├── downloads/             # Fichiers téléchargés
├── requirements.txt
└── .env
```

---

## 🔧 Dépannage

### L'API ne démarre pas

```bash
# Vérifier que le port 3000 est libre
netstat -ano | findstr :3000

# Vérifier les dépendances
pip install -r requirements.txt --force-reinstall

# Lancer avec logs détaillés
python -m uvicorn main:app --log-level debug
```

### Erreur CORS

Si vous voyez une erreur CORS dans la console :

```python
# Dans main.py de l'API, vérifiez que CORS est configuré :
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En dev uniquement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Les téléchargements échouent

1. **Vérifiez FFmpeg :**
```bash
ffmpeg -version
```

2. **Mettez à jour yt-dlp :**
```bash
pip install -U yt-dlp
```

3. **Vérifiez les permissions du dossier downloads**

### Spotify ne fonctionne pas

1. Créez une app sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Récupérez le `Client ID` et `Client Secret`
3. Ajoutez-les dans le fichier `.env`

### La recherche est lente

- SoundCloud et YouTube peuvent être lents (5-10s normal)
- Utilisez une plateforme spécifique plutôt que "Toutes"
- Réduisez le `limit` de résultats

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner l'API
git clone xxx
cd music-api

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer l'API
uvicorn main:app --port 3000

# 4. Ouvrir l'interface (dans un autre terminal ou explorateur)
# Double-cliquez sur index.html
# OU
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 📝 Notes importantes

### Légalité

⚠️ **Avertissement** : Ce projet est destiné à un usage personnel uniquement. Respectez les droits d'auteur et les conditions d'utilisation des plateformes. Ne téléchargez que du contenu dont vous avez les droits.

### Performance

- Les recherches multi-plateformes peuvent prendre 5-15 secondes
- Le téléchargement dépend de votre connexion et de la plateforme source
- Les fichiers sont mis en cache localement après le premier téléchargement

### Sécurité

- Ne partagez pas vos clés API
- L'API est prévue pour un usage local uniquement
- N'exposez pas l'API sur Internet sans authentification

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Crédits

- [Mixxx](https://mixxx.org/) - Logiciel DJ open source
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Téléchargement de médias
- [FastAPI](https://fastapi.tiangolo.com/) - Framework API Python
- [Spotipy](https://spotipy.readthedocs.io/) - Client Spotify Python

