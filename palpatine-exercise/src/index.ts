import express from 'express';
import { processCitizens } from './citizens';


const app = express();
const PORT = 3000;

app.get('/process', async (req, res) => {
    try {
        await processCitizens();
        res.send('Citizen data processed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing citizens');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
