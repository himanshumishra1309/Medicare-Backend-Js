import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/doctor.controller.js";
import { verifyDoctorJWT } from "../middlewares/doctor.middleware.js";

const router = Router();

router.route('/register').post(registerUser);

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(verifyDoctorJWT, logoutUser)
//verifyDoctorJWT was a middleware and here we are using two methods one is verify jwt and another is logout user and we have used verifyDoctorJWT fist so it will execute first and then to execture other process it will need a sign and that sign is the next() that we used in verifyDoctorJWT, so as soon as the first program finishes it will start exectuting the next program

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyDoctorJWT, changeCurrentPassword)
router.route('/current-user').get(verifyDoctorJWT, getCurrentUser)
router.route('/update-account').patch(verifyDoctorJWT, updateAccountDetails) // we are using patch so that all the values dont get updated and only the changed values get updated, if we used post we will be updating each and every value


export default router;