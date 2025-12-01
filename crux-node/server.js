import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import router from './router.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use("/api/",router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});