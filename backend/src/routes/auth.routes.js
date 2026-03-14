import { Router } from "express";
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

// routes

// POST /api/auth/register ; { username, email, password }
authRouter.post("/register", registerValidator, register);

// POST /api/auth/login ; { email, password }
authRouter.post("/login", loginValidator, login)

// GET /api/auth/get-me 
authRouter.get('/get-me', authUser, getMe)

// GET /api/auth/verify-email ; { token }
authRouter.get('/verify-email', verifyEmail)

export default authRouter