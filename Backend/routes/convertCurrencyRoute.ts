import express from 'express';
import { getConvertAll, SaveConvert } from '../controllers/convertCurrencyController';

const router = express.Router();

router.get('/getConvert', getConvertAll);
router.post('/saveConvert', SaveConvert);

export default router;
