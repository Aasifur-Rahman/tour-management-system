import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  // here we will add multerupload
  // and if we want to send single image or file we will use single here and if we want to send multiple uploads then we will use Array
  // we will name the file in file so form data will get the data from the file
  // form data -> body, file {file: image, data: body text data => req.body => req.body.data}
  multerUpload.single("file"),
  validateRequest(createDivisionSchema),
  DivisionController.createDivision
);

router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionSchema),
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const DivisionRoutes = router;
