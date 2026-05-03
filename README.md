# Carte de Visite Numérique

Une application web progressive (PWA) mobile-first qui génère des codes QR contenant des informations de contact au format vCard pour un partage facile lors d'événements de networking.

## Fonctionnalités

- **Design Mobile-First** : Optimisé pour les appareils mobiles
- **Génération de Code QR** : Crée des codes QR scannables avec les informations de contact
- **Format vCard** : Génère des données vCard standard qui peuvent être importées dans les applications de contacts
- **Support PWA** : Peut être installé comme application autonome sur les appareils mobiles
- **Stockage Local** : Sauvegarde vos informations de contact pour une réutilisation rapide
- **Capable Hors Ligne** : Cache de base pour une fonctionnalité hors ligne

## Comment Utiliser

1. Ouvrez l'application sur votre appareil mobile
2. Remplissez vos informations de contact (nom et email sont requis)
3. Cliquez sur "Générer le code QR"
4. Montrez le code QR aux autres - ils peuvent le scanner pour ajouter instantanément vos informations de contact à leur téléphone

## Développement

### Prérequis

- Node.js (v16 ou supérieur)
- npm

### Installation

```bash
npm install
```

### Serveur de Développement

```bash
npm run dev
```

### Build pour la Production

```bash
npm run build
```

### Aperçu du Build de Production

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