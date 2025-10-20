import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();


router.get("/", checkAuth.)