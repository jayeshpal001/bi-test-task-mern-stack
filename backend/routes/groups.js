import express from 'express';
import {
  createGroup,
  inviteMember,
  joinGroup,
  addExpense,
  getUserGroups
} from '../controllers/groups.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createGroup);
router.post('/:groupId/invite', auth, inviteMember);
router.post('/join/:shortId', auth, joinGroup);
router.post('/:groupId/expenses', auth, addExpense);
router.get('/', auth, getUserGroups);

export default router;
