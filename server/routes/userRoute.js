import express from "express";
import {
  bookVisit,
  cancelBooking,
  whoAmI,
  getAllBookings,
  getAllFavorites,
  toFav,
} from "../controllers/userCntrl.js";
import { verifyPass } from "../middleware/jwt.js";


const router = express.Router();


router.post("/whoami", whoAmI)

router.post("/bookVisit/:id", verifyPass(true), bookVisit)

router.post("/allBookings", verifyPass(true), getAllBookings)

router.post("/removeBooking/:id", verifyPass(true), cancelBooking)

router.post("/toFav/:rid", verifyPass(true), toFav)

router.post("/allFav/", verifyPass(true), getAllFavorites)


export { router as userRoute }