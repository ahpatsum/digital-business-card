import './style.css'
import QRCode from 'qrcode'
import { VCard } from 'vcard-creator'

// State management
let currentView = 'list';
let editingCardId = null;
let businessCards = JSON.parse(localStorage.getItem('businessCards')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Theme management
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme = theme;
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  }
}

function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialize theme
setTheme(currentTheme);

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <div class="header-content">
        <h1>Carte de Visite Numérique</h1>
        <button id="themeToggle" class="theme-toggle" aria-label="Changer de thème">
          <span class="theme-icon">☀️</span>
        </button>
      </div>
      <p>Gérez vos cartes de visite professionnelles</p>
    </header>

    <div id="listView" class="view">
      <div class="view-header">
        <button id="createBtn" class="primary-btn">Créer une Nouvelle Carte</button>
      </div>
      <div id="cardsList" class="cards-list">
        <!-- Cards will be rendered here -->
      </div>
    </div>

    <div id="formView" class="view hidden">
      <form id="contactForm" class="contact-form">
        <div class="form-header">
          <button type="button" id="backBtn" class="back-btn">← Retour</button>
          <h2 id="formTitle">Créer une Carte</h2>
        </div>

        <div class="form-group">
          <label for="name">Nom complet *</label>
          <input type="text" id="name" required placeholder="Jean Dupont">
        </div>

        <div class="form-group">
          <label for="title">Titre du poste</label>
          <input type="text" id="title" placeholder="Développeur Logiciel">
        </div>

        <div class="form-group">
          <label for="company">Entreprise</label>
          <input type="text" id="company" placeholder="Tech Corp">
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" required placeholder="jean@example.com">
        </div>

        <div class="form-group">
          <label for="phone">Telephone</label>
          <input type="tel" id="phone" placeholder="+33 1 23 45 67 89">
        </div>

        <div class="form-group">
          <label for="website">Site web</label>
          <input type="url" id="website" placeholder="https://exemple.com">
        </div>

        <div class="form-group">
          <label for="address">Adresse</label>
          <textarea id="address" placeholder="123 Rue Principale, Ville, État 12345"></textarea>
        </div>

        <button type="submit" class="generate-btn" id="submitBtn">Sauvegarder la Carte</button>
      </form>
    </div>

    <div id="qrContainer" class="qr-container hidden">
      <h2>Votre Carte de Visite Numerique</h2>
      <div id="qrCode"></div>
      <p class="qr-instruction">Scannez ce code QR pour ajouter mes informations de contact a votre telephone</p>
      <button id="resetBtn" class="reset-btn">Retour à la Liste</button>
    </div>
  </div>
`

// View management functions
function showView(viewName) {
  document.getElementById('listView').classList.toggle('hidden', viewName !== 'list');
  document.getElementById('formView').classList.toggle('hidden', viewName !== 'form');
  document.getElementById('qrContainer').classList.toggle('hidden', viewName !== 'qr');
  currentView = viewName;
}

function renderCardsList() {
  const cardsList = document.getElementById('cardsList');
  if (businessCards.length === 0) {
    cardsList.innerHTML = '<p class="empty-state">Aucune carte de visite créée. Cliquez sur "Créer une Nouvelle Carte" pour commencer.</p>';
    return;
  }

  cardsList.innerHTML = businessCards.map(card => `
    <div class="card-item" data-id="${card.id}">
      <div class="card-info">
        <h3>${card.name}</h3>
        <p>${card.email}</p>
        ${card.company ? `<p>${card.company}</p>` : ''}
      </div>
      <div class="card-actions">
        <button class="edit-btn" data-id="${card.id}" title="Modifier cette carte">✏️</button>
        <button class="generate-btn" data-id="${card.id}" title="Générer le QR Code">📱</button>
        <button class="delete-btn" data-id="${card.id}" title="Supprimer cette carte">🗑️</button>
      </div>
    </div>
  `).join('');
}

function saveCardsToStorage() {
  localStorage.setItem('businessCards', JSON.stringify(businessCards));
}

function loadCardIntoForm(cardId) {
  const card = businessCards.find(c => c.id === cardId);
  if (card) {
    document.getElementById('name').value = card.name || '';
    document.getElementById('title').value = card.title || '';
    document.getElementById('company').value = card.company || '';
    document.getElementById('email').value = card.email || '';
    document.getElementById('phone').value = card.phone || '';
    document.getElementById('website').value = card.website || '';
    document.getElementById('address').value = card.address || '';
  }
}

function clearForm() {
  document.getElementById('contactForm').reset();
  editingCardId = null;
  document.getElementById('formTitle').textContent = 'Créer une Carte';
  document.getElementById('submitBtn').textContent = 'Sauvegarder la Carte';
}

// Event listeners
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('createBtn').addEventListener('click', () => {
  clearForm();
  showView('form');
});

document.getElementById('backBtn').addEventListener('click', () => {
  showView('list');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  showView('list');
});

document.getElementById('cardsList').addEventListener('click', (e) => {
  const cardId = e.target.dataset.id;
  if (!cardId) return;

  if (e.target.classList.contains('edit-btn')) {
    editingCardId = cardId;
    loadCardIntoForm(cardId);
    document.getElementById('formTitle').textContent = 'Modifier la Carte';
    document.getElementById('submitBtn').textContent = 'Mettre à Jour';
    showView('form');
  } else if (e.target.classList.contains('generate-btn')) {
    generateQRForCard(cardId);
  } else if (e.target.classList.contains('delete-btn')) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      businessCards = businessCards.filter(c => c.id !== cardId);
      saveCardsToStorage();
      renderCardsList();
    }
  }
});

// Form handling
const form = document.getElementById('contactForm');
const qrContainer = document.getElementById('qrContainer');
const qrCodeDiv = document.getElementById('qrCode');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const title = document.getElementById('title').value;
  const company = document.getElementById('company').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const website = document.getElementById('website').value;
  const address = document.getElementById('address').value;

  const cardData = { name, title, company, email, phone, website, address };

  if (editingCardId) {
    // Update existing card
    const index = businessCards.findIndex(c => c.id === editingCardId);
    if (index !== -1) {
      businessCards[index] = { ...businessCards[index], ...cardData };
    }
  } else {
    // Create new card
    const newCard = {
      id: Date.now().toString(),
      ...cardData
    };
    businessCards.push(newCard);
  }

  saveCardsToStorage();
  clearForm();
  renderCardsList();
  showView('list');
});

function generateQRForCard(cardId) {
  const card = businessCards.find(c => c.id === cardId);
  if (!card) return;

  // Create vCard
  const myVCard = new VCard();

  myVCard.addName({ givenName: card.name.split(' ')[0], familyName: card.name.split(' ').slice(1).join(' ') });
  if (card.title) myVCard.addJobtitle(card.title);
  if (card.company) myVCard.addCompany({ name: card.company });
  myVCard.addEmail({ address: card.email });
  if (card.phone) myVCard.addPhoneNumber({ number: card.phone, type: ['pref'] });
  if (card.website) myVCard.addUrl({ url: card.website });
  if (card.address) {
    const parts = card.address.split(',').map(p => p.trim());
    myVCard.addAddress({
      street: parts[0] || '',
      locality: parts[1] || '',
      region: parts[2] || '',
      postalCode: parts[3] || '',
      country: parts[4] || ''
    });
  }

  const vCardString = myVCard.toString();

  // Generate QR Code
  QRCode.toDataURL(vCardString, {
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }).then(qrCodeDataURL => {
    qrCodeDiv.innerHTML = `<img src="${qrCodeDataURL}" alt="QR Code" class="qr-image">`;
    showView('qr');
  }).catch(err => {
    console.error(err);
    alert('Erreur lors de la génération du code QR. Veuillez réessayer.');
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize
renderCardsList();

// Initialize theme after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
});
