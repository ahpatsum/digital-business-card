import './style.css'
import QRCode from 'qrcode'
import { VCard } from 'vcard-creator'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <h1>Digital Business Card</h1>
      <p>Enter your contact information and generate a QR code for easy sharing</p>
    </header>

    <form id="contactForm" class="contact-form">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" required placeholder="John Doe">
      </div>

      <div class="form-group">
        <label for="title">Job Title</label>
        <input type="text" id="title" placeholder="Software Developer">
      </div>

      <div class="form-group">
        <label for="company">Company</label>
        <input type="text" id="company" placeholder="Tech Corp">
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" required placeholder="john@example.com">
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" placeholder="+1 (555) 123-4567">
      </div>

      <div class="form-group">
        <label for="website">Website</label>
        <input type="url" id="website" placeholder="https://example.com">
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <textarea id="address" placeholder="123 Main St, City, State 12345"></textarea>
      </div>

      <button type="submit" class="generate-btn">Generate QR Code</button>
    </form>

    <div id="qrContainer" class="qr-container hidden">
      <h2>Your Digital Business Card</h2>
      <div id="qrCode"></div>
      <p class="qr-instruction">Scan this QR code to add my contact information to your phone</p>
      <button id="resetBtn" class="reset-btn">Create New Card</button>
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

  myVCard
    .addName(name.split(' ')[0], name.split(' ').slice(1).join(' '))
    .addJobtitle(title)
    .addCompany(company)
    .addEmail(email)
    .addPhoneNumber(phone, 'PREF')
    .addURL(website)
    .addAddress('', '', address.split(',')[0] || '', address.split(',')[1] || '', '', '', '');

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
    alert('Error generating QR code. Please try again.');
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
