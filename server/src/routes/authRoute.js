import express from "express";
import { signup, login, logout, refreshAccessToken } from "../controllers/authController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyAccessToken, logout); 
router.post('/refreshAccessToken', refreshAccessToken);

export default router;