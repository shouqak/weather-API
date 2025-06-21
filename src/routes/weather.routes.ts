
import { Router } from "express"
import { authorized } from "../middleware/auth.middleware"
import { getWeather } from "../controllers/weather.controller";

const router = Router()
router.get('/', authorized, getWeather);


export default router