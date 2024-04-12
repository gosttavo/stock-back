import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.get('/user', UserController.getUsers);
router.post('/user', UserController.storeUser);
// router.get('/user/:id', UserController.getUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

export default router;