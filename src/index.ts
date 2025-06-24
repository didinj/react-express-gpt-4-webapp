import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // or use a dynamic whitelist for multiple origins
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

app.post('/api/chat', async (req: Request, res: Response) => {
    const { messages } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error: any) {
        console.error('Error from OpenAI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from GPT-3.5 Turbo' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
