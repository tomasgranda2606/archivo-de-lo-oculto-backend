import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createApiRouter } from './http/routes/index.js';
import { errorHandler } from './http/middlewares/errorHandler.js';

export function createApp(): Application {
  const app = express();

  // Configuración de CORS estricto
  // Permite localhost en desarrollo y el dominio de Vercel en producción
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://archivo-de-lo-oculto.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir peticiones sin origen (por ejemplo Postman, cURL o apps móviles)
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') // Permite previsualizaciones en Vercel
        ) {
          return callback(null, true);
        }
        return callback(new Error(`CORS no permitido para el origen: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Montaje de la API REST
  app.use('/api', createApiRouter());

  // Manejador para endpoints no existentes (404)
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: `Ruta ${req.method} ${req.path} no encontrada en esta API`,
        statusCode: 404,
      },
    });
  });

  // Middleware global de manejo de errores
  app.use(errorHandler);

  return app;
}
