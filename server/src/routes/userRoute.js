import express from 'express';
import {createUser, getUser, updateUser, deleteUser, updatePassword, updateProfilePicture} from '../controllers/userController.js'
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',createUser);
router.get('/',verifyAccessToken,getUser);
router.get('/:id',verifyAccessToken,getUser);
router.put('/:id',verifyAccessToken,updateUser);
router.delete('/:id',verifyAccessToken,deleteUser);
router.patch("/:id/password", verifyAccessToken, updatePassword);
router.patch("/:id/profile-picture", verifyAccessToken, updateProfilePicture);

export default router;