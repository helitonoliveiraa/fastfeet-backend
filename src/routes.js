import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';

import DeliverymanDeliveryController from './app/controllers/DeliverymanDeliveryController';
import DeliverymanDeliveriedController from './app/controllers/DeliverymanDeliveriedController';
import DeliveryPickupController from './app/controllers/DeliveryPickupController';
import DeliveryPickupCompleteController from './app/controllers/DeliveryPickupCompleteController';

import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryOneProblemController from './app/controllers/DeliveryOneProblemController';
import DeliverymanProblemController from './app/controllers/DeliverymanProblemController';
import DeliveryCancelController from './app/controllers/DeliveryCancelController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

/**
 * Deliveryman routes without login
 */
routes.get('/deliveryman/:id/deliveries', DeliverymanDeliveryController.index);
routes.get(
  '/deliveryman/:id/deliveried',
  DeliverymanDeliveriedController.index
);
routes.put('/deliveries/:id/pickup', DeliveryPickupController.update);
routes.put(
  '/deliveries/:id/complete',
  uploads.single('file'),
  DeliveryPickupCompleteController.update
);
routes.post('/delivery/:id/problems', DeliverymanProblemController.store);

/**
 * Login
 */
routes.post('/sessions', SessionController.store);

/**
 * Middleware of authentication
 */
routes.use(authMiddleware);

/**
 * Routes that need authentication
 */
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.post('/files', uploads.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.get('/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryOneProblemController.index);

routes.delete('/problem/:id/cancel-delivery', DeliveryCancelController.delete);

export default routes;
