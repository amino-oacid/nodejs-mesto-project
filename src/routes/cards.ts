import { Router } from 'express';
import { getCards, createCard, deleteCard } from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.post('/cards', createCard);

export default cardsRouter;
