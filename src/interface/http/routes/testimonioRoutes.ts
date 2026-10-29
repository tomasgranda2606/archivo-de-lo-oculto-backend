import { Router } from 'express';
import { TestimonioController } from '../controllers/TestimonioController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { soloAdmin } from '../middlewares/roleMiddleware.js';

export function createTestimonioRouter(testimonioController: TestimonioController): Router {
  const router = Router();

  // POST /api/testimonios: Usuario autenticado (queda a nombre del usuario del token)
  router.post('/', authenticateJWT, testimonioController.create);

  // GET /api/testimonios/mias: Usuario autenticado (solo las suyas)
  router.get('/mias', authenticateJWT, testimonioController.getMyTestimonios);

  // GET /api/testimonios: Solo admin (todas las interacciones de todos los usuarios)
  router.get('/', authenticateJWT, soloAdmin, testimonioController.getAll);

  // DELETE /api/testimonios/:id: Creador o admin
  router.delete('/:id', authenticateJWT, testimonioController.delete);

  return router;
}
