# Digital Business Card

A mobile-first Progressive Web App (PWA) that generates QR codes containing vCard contact information for easy sharing during networking events.

## Features

- **Mobile-First Design**: Optimized for mobile devices
- **QR Code Generation**: Creates scannable QR codes with contact information
- **vCard Format**: Generates standard vCard data that can be imported into contact apps
- **PWA Support**: Can be installed as a standalone app on mobile devices
- **Local Storage**: Saves your contact information for quick reuse
- **Offline Capable**: Basic caching for offline functionality

## How to Use

1. Open the app on your mobile device
2. Fill in your contact information (name and email are required)
3. Click "Generate QR Code"
4. Show the QR code to others - they can scan it to instantly add your contact info to their phone

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **Vite**: Build tool and development server
- **Vanilla JavaScript**: No framework dependencies
- **QRCode.js**: QR code generation
- **vcard-creator**: vCard format generation
- **PWA Features**: Service Worker and Web App Manifest

## Deployment

The app can be deployed to any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Browser Support

- Modern mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)
- Desktop browsers for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on mobile devices
5. Submit a pull request