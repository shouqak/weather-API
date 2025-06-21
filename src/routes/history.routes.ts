
import { Router } from "express"
import { authorized } from "../middleware/auth.middleware"
import { listHistory} from "../controllers/history.controller"

const router = Router()

router.get('/', authorized, listHistory);

export default router