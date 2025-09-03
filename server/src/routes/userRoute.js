import express from 'express';
import {createUser, getUser, updateUser, deleteUser} from '../controllers/userController.js'
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',createUser);
router.get('/',verifyAccessToken,getUser);
router.get('/:id',verifyAccessToken,getUser);
router.put('/:id',verifyAccessToken,updateUser);
router.delete('/:id',verifyAccessToken,deleteUser);

export default router;