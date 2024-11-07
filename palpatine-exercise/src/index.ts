import express from 'express';
import { processCitizens } from './citizens';

const app = express();
const PORT = 3000;

// Endpoint to trigger citizen data processing
app.get('/process', async (req, res) => {
    try {
        await processCitizens();  // Calls the processCitizens function to handle the data
        res.send('Citizen data processed successfully!'); 
    } catch (error) {
        console.error(error);  
        res.status(500).send('Error processing citizens');  
    }
});

// Starts the server and listens on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
