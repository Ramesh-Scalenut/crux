import express from 'express';
import { getCruxData } from './controllers/crux.controller.js';

const router = express.Router();


router.get('/', (req, res) => {
    res.json({ message: 'ok' });
});


router.post("/get-crux-data", getCruxData);



export default  router;