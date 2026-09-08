const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const swCode = `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(err => console.error('SW unregister error', err));
}
`;

if (!code.includes('serviceWorker')) {
  code = code + '\n' + swCode;
  fs.writeFileSync('src/main.tsx', code);
}
