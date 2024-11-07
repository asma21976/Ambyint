import axios from 'axios';

export async function fetchHomeworldName(homeworldUrl: string): Promise<string> {
    // Check for valid URL format
    if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
        console.error(`Invalid homeworld URL: ${homeworldUrl}`);
        return homeworldUrl;  // Return the original URL if invalid
    }

    // Update the URL to point to the active API endpoint
    const updatedUrl = homeworldUrl.replace('https://swapi.co', 'https://swapi.dev');

    try {
        // Fetch the homeworld data from the updated URL
        const response = await axios.get(updatedUrl);
        return response.data.name || updatedUrl;
    } catch (error) {

        if (error instanceof Error) {
            console.error(`Failed to fetch homeworld for URL ${updatedUrl}:`, error.message);
        } else {
            console.error(`Failed to fetch homeworld for URL ${updatedUrl}: An unknown error occurred.`);
        }
        
        return updatedUrl; 
    }
}
