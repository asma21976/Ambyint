import express from 'express';
import { processCitizens } from './citizens';

const app = express();
const PORT = 3000;

// Endpoint to trigger citizen data processing
app.get('/process', async (req, res) => {
    try {
        await processCitizens();  // Calls the processCitizens function to handle the data
        res.send('Citizen data processed successfully!');  // Sends success message after processing
    } catch (error) {
        console.error(error);  // Logs any errors during processing
        res.status(500).send('Error processing citizens');  // Sends an error response if something goes wrong
    }
});

// Starts the server and listens on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
