import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.use('/auth', AuthController.authenticate)

export default router;