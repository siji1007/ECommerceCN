import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: {
      key: 'C:/Users/Fox/Documents/GitHub/ECommerceCN/key.pem',   // Correct path to the key file
      cert: 'C:/Users/Fox/Documents/GitHub/ECommerceCN/cert.pem', // Correct path to the certificate file
    },
    host: '0.0.0.0',  // Allows access from other devices in the local network
    port: 5173,
  },
});
