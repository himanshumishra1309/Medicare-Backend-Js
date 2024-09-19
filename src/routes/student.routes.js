import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/student.controller.js";
import { verifyStudentJWT } from "../middlewares/student.middleware.js";

const router = Router();

router.route('/register').post(registerUser);

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(verifyStudentJWT, logoutUser)
//verifyStudentJWT was a middleware and here we are using two methods one is verify jwt and another is logout user and we have used verifyStudentJWT fist so it will execute first and then to execture other process it will need a sign and that sign is the next() that we used in verifyStudentJWT, so as soon as the first program finishes it will start exectuting the next program

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyStudentJWT, changeCurrentPassword)
router.route('/current-user').get(verifyStudentJWT, getCurrentUser)
router.route('/update-account').patch(verifyStudentJWT, updateAccountDetails) // we are using patch so that all the values dont get updated and only the changed values get updated, if we used post we will be updating each and every value


export default router;