import './style.css'
import QRCode from 'qrcode'
import { VCard } from 'vcard-creator'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <h1>Carte de Visite Numérique</h1>
      <p>Entrez vos informations de contact et générez un code QR pour un partage facile</p>
    </header>

    <form id="contactForm" class="contact-form">
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
        <label for="phone">Téléphone</label>
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

      <button type="submit" class="generate-btn">Générer le code QR</button>
    </form>

    <div id="qrContainer" class="qr-container hidden">
      <h2>Votre Carte de Visite Numérique</h2>
      <div id="qrCode"></div>
      <p class="qr-instruction">Scannez ce code QR pour ajouter mes informations de contact à votre téléphone</p>
      <button id="resetBtn" class="reset-btn">Créer une Nouvelle Carte</button>
    </div>
  </div>
`

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

// Form handling
const form = document.getElementById('contactForm');
const qrContainer = document.getElementById('qrContainer');
const qrCodeDiv = document.getElementById('qrCode');
const resetBtn = document.getElementById('resetBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const title = document.getElementById('title').value;
  const company = document.getElementById('company').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const website = document.getElementById('website').value;
  const address = document.getElementById('address').value;

  // Create vCard
  const myVCard = new VCard();

  myVCard.addName({ givenName: name.split(' ')[0], familyName: name.split(' ').slice(1).join(' ') });
  if (title) myVCard.addJobtitle(title);
  if (company) myVCard.addCompany({ name: company });
  myVCard.addEmail({ address: email });
  if (phone) myVCard.addPhoneNumber({ number: phone, type: ['pref'] });
  if (website) myVCard.addUrl({ url: website });
  if (address) {
    const parts = address.split(',').map(p => p.trim());
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
  try {
    const qrCodeDataURL = await QRCode.toDataURL(vCardString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    qrCodeDiv.innerHTML = `<img src="${qrCodeDataURL}" alt="QR Code" class="qr-image">`;
    form.classList.add('hidden');
    qrContainer.classList.remove('hidden');

    // Save to localStorage
    const contactData = { name, title, company, email, phone, website, address };
    localStorage.setItem('businessCardData', JSON.stringify(contactData));

  } catch (err) {
    console.error(err);
    alert('Erreur lors de la génération du code QR. Veuillez réessayer.');
  }
});

resetBtn.addEventListener('click', () => {
  qrContainer.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
});

// Load saved data on page load
window.addEventListener('load', () => {
  const savedData = localStorage.getItem('businessCardData');
  if (savedData) {
    const data = JSON.parse(savedData);
    document.getElementById('name').value = data.name || '';
    document.getElementById('title').value = data.title || '';
    document.getElementById('company').value = data.company || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('website').value = data.website || '';
    document.getElementById('address').value = data.address || '';
  }
});
