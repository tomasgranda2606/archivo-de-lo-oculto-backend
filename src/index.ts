import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './interface/app.js';

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🕯️  Servidor de Archivo de lo Oculto ejecutándose en el puerto ${PORT}`);
  console.log(`📡 Endpoints base: http://localhost:${PORT}/api`);
});
