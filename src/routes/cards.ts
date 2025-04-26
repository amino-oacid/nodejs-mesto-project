import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import validateRequest from '../middlewares/validate-request';
import { validateCardIdSchema, validateCreateCardSchema } from '../validators/card-validator';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', validateRequest(validateCardIdSchema), deleteCard);
cardsRouter.post('/', validateRequest(validateCreateCardSchema), createCard);
cardsRouter.put('/:cardId/likes', validateRequest(validateCardIdSchema), likeCard);
cardsRouter.delete('/:cardId/likes', validateRequest(validateCardIdSchema), dislikeCard);

export default cardsRouter;
