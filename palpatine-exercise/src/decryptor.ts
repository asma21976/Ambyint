import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Loads environment variables from a .env file

interface DecryptedData {
    name: string;
    homeworld: string;
}

// Helper function to break the encrypted data into smaller chunks for efficient processing
function chunkArray(arr: string[], size: number): string[][] {
    const result: string[][] = [];
    // Loop through the array and create chunks of the specified size
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// Function to decrypt the encrypted citizen data
export async function decryptData(encryptedData: string[]): Promise<DecryptedData[]> {
    const CHUNK_SIZE = 1000; // Defines the size of each chunk to send in the request
    let decryptedData: DecryptedData[] = []; // Array to store the final decrypted data

    // Split the encrypted data into smaller chunks to avoid potential issues with large payloads
    const chunks = chunkArray(encryptedData, CHUNK_SIZE);

    for (const chunk of chunks) {
        try {
            const requestBody = chunk; // The chunk of encrypted data to send in the API request

            // Send the chunk to the decryption API
            const response = await axios.post<DecryptedData[]>(
                'https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt', // The API endpoint for decryption
                requestBody,  // The request body containing the chunk of encrypted data
                {
                    headers: {
                        'x-api-key': process.env.API_KEY, // API key for authentication
                    },
                }
            );
            console.log('Decrypted Response Data:', response.data); // Log the response data for debugging

            // Parse the decrypted data and validate each citizen's data
            const parsedCitizens = response.data.map((citizen, index) => {
                console.log(`Citizen ${index}:`, citizen); // Log the raw citizen data for inspection

                let parsedCitizen;
                // Check if the citizen is a string that needs to be parsed as JSON
                if (typeof citizen === 'string') {
                    try {
                        parsedCitizen = JSON.parse(citizen); // Try parsing the citizen data
                        console.log(`Parsed Citizen ${index}:`, parsedCitizen); // Log the parsed citizen for debugging
                    } catch (error) {
                        console.error(`Error parsing citizen data at index ${index}:`, error); // Log any parsing errors
                        return null;  // Return null if parsing fails
                    }
                } else {
                    // If the citizen is already an object, use it as is
                    parsedCitizen = citizen;
                    console.log(`Citizen ${index} is already an object:`, parsedCitizen); // Log the citizen if no parsing is needed
                }

                // Validate that the citizen has both a valid name and homeworld
                const isNameValid = parsedCitizen.name && parsedCitizen.name.trim().length > 0;
                const isHomeworldValid = parsedCitizen.homeworld && parsedCitizen.homeworld.trim().length > 0;

                // If either the name or homeworld is invalid, log a warning and skip this citizen
                if (!isNameValid || !isHomeworldValid) {
                    console.warn(`Citizen ${index} has missing data:`, parsedCitizen); // Log a warning for missing data
                    return null; // Skip this citizen
                } else {
                    console.log(`Citizen ${index} has valid data:`, parsedCitizen); // Log valid citizen data
                    return parsedCitizen; // Return the valid citizen data
                }
            }).filter(Boolean);  // Filter out any invalid or null citizens

            // Concatenate the successfully parsed and validated citizens into the final result
            decryptedData = decryptedData.concat(parsedCitizens);

        } catch (error) {
            // Handle any errors that occur during the decryption process
            if (axios.isAxiosError(error)) {

                console.error('Error processing chunk:', error.response?.data || error.message); // Log the error details
            } else {
                // If the error is not from Axios, it's an unknown error
                console.error('Unknown error:', error);
            }
            throw error;
        }
        break; // This `break` statement limits the function to process only the first chunk
    }

    return decryptedData; // Return the decrypted data (with valid citizens) after processing
}
