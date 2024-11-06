import axios from 'axios';

export async function fetchHomeworldName(homeworldUrl: string): Promise<string> {
    if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
        console.error(`Invalid homeworld URL: ${homeworldUrl}`);
        return homeworldUrl;
    }

    const updatedUrl = homeworldUrl.replace('https://swapi.co', 'https://swapi.dev');

    try {
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
