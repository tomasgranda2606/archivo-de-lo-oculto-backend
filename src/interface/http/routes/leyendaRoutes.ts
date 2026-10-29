import { Router } from 'express';
import { LeyendaController } from '../controllers/LeyendaController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { soloAdmin } from '../middlewares/roleMiddleware.js';

export function createLeyendaRouter(leyendaController: LeyendaController): Router {
  const router = Router();

  // Endpoints públicos
  router.get('/', leyendaController.getAll);
  router.get('/:id', leyendaController.getById);

  // Endpoints protegidos exclusivos para Administradores
  router.post('/', authenticateJWT, soloAdmin, leyendaController.create);
  router.put('/:id', authenticateJWT, soloAdmin, leyendaController.update);
  router.delete('/:id', authenticateJWT, soloAdmin, leyendaController.delete);

  return router;
}
