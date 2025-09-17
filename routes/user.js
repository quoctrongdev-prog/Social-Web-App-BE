import express from 'express';
import { getUser, updateUser } from '../controllers/user.js';

const router = express.Router();

router.get("/find/:id", getUser)
router.patch("/", updateUser)

export default router;