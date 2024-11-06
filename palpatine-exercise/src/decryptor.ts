import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); 

interface DecryptedData {
    name: string;
    homeworld: string;
}

function chunkArray(arr: string[], size: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export async function decryptData(encryptedData: string[]): Promise<DecryptedData[]> {
    const CHUNK_SIZE = 1000;
    let decryptedData: DecryptedData[] = [];

    const chunks = chunkArray(encryptedData, CHUNK_SIZE);

    for (const chunk of chunks) {
        try {
            const requestBody = chunk;

            const response = await axios.post<DecryptedData[]>(
                'https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt',
                requestBody, 
                {
                    headers: {
                        'x-api-key': process.env.API_KEY, 
                    },
                }
            );
            console.log('Decrypted Response Data:', response.data);

            const parsedCitizens = response.data.map((citizen, index) => {
                console.log(`Citizen ${index}:`, citizen);

                let parsedCitizen;
                if (typeof citizen === 'string') {
                    try {

                        parsedCitizen = JSON.parse(citizen);
                        console.log(`Parsed Citizen ${index}:`, parsedCitizen);
                    } catch (error) {
                        console.error(`Error parsing citizen data at index ${index}:`, error);
                        return null;  
                    }
                } else {
                    parsedCitizen = citizen; 
                    console.log(`Citizen ${index} is already an object:`, parsedCitizen);
                }

                const isNameValid = parsedCitizen.name && parsedCitizen.name.trim().length > 0;
                const isHomeworldValid = parsedCitizen.homeworld && parsedCitizen.homeworld.trim().length > 0;

                if (!isNameValid || !isHomeworldValid) {
                    console.warn(`Citizen ${index} has missing data:`, parsedCitizen);
                    return null; 
                } else {
                    console.log(`Citizen ${index} has valid data:`, parsedCitizen);
                    return parsedCitizen;  
                }
            }).filter(Boolean);  
            
            decryptedData = decryptedData.concat(parsedCitizens);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error processing chunk:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
        break;
    }

    return decryptedData;
}
