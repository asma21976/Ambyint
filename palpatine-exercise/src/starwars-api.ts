import axios from 'axios';

// Fetches the homeworld name based on the given URL
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
        return response.data.name || updatedUrl;  // Return the name or fallback to URL
    } catch (error) {
        // Log error if request fails
        if (error instanceof Error) {
            console.error(`Failed to fetch homeworld for URL ${updatedUrl}:`, error.message);
        } else {
            console.error(`Failed to fetch homeworld for URL ${updatedUrl}: An unknown error occurred.`);
        }
        
        return updatedUrl;  // Return URL as fallback in case of error
    }
}
