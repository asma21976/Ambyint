import { decryptData } from './decryptor';
import { fetchHomeworldName } from './starwars-api';
import { loadFile, saveFile } from './utils/file-helper';

interface Citizen {
    name: string;
    homeworld: string;
}

export async function processCitizens() {
    try {
        // Load encrypted citizen data from a file
        const encryptedData = await loadFile('super-secret-data.txt');

        // Check if the last item is just whitespace and remove it
        if (encryptedData[encryptedData.length - 1].trim() === '') {
            encryptedData.pop();
        }

        // Decrypt the loaded data using the decryption function
        const decryptedData = await decryptData(encryptedData);

        // Create an object to store unique citizens by name
        const citizens: { [name: string]: Citizen } = {};

        // Remove duplicates by creating a map with names as keys
        const uniqueCitizens = Array.from(new Map(decryptedData.map(c => [c.name, c])).values());

        console.log(`Number of unique citizens: ${uniqueCitizens.length}`);

        // Populate the citizens object with non-duplicate entries
        uniqueCitizens.forEach((citizen) => {
            if (!citizen.name || !citizen.homeworld) {
                // If citizen data is missing critical information, log a warning and skip the citizen
                console.warn(`Citizen data missing:`, citizen);
                return;
            }
            citizens[citizen.name] = citizen;
        });

        // Identify all unique homeworld URLs from the citizens
        const uniqueHomeworldUrls = new Set<string>();
        for (const citizen of Object.values(citizens)) {
            if (citizen.homeworld) uniqueHomeworldUrls.add(citizen.homeworld);
        }

        console.log(`Number of unique homeworlds: ${uniqueHomeworldUrls.size}`);

        // Cache to store the mapping of homeworld URLs to homeworld names
        const homeworldCache = new Map<string, string>();
        
        // Fetch the homeworld names for all unique homeworld URLs to avoid excessive API calls
        for (const homeworldUrl of uniqueHomeworldUrls) {
            let homeworldName = await fetchHomeworldName(homeworldUrl);
            if (!homeworldName) {
                // If the homeworld fetch fails, fall back to using the URL as the name
                console.warn(`Failed to fetch homeworld for URL ${homeworldUrl}, using URL as fallback.`);
                homeworldName = homeworldUrl;
            }
            homeworldCache.set(homeworldUrl, homeworldName);
        }

        // Group citizens by their homeworld names
        const groupedByHomeworld: { [key: string]: string[] } = {};

        // Iterate over all citizens and group them by their homeworld
        for (const citizenName in citizens) {
            const citizen = citizens[citizenName];
            const homeworldUrl = citizen.homeworld;

            // Fetch the homeworld name from the cache, defaulting to 'Unknown' if not found
            const homeworldName = homeworldCache.get(homeworldUrl) || 'Unknown';

            // Add citizen's name to the appropriate homeworld group
            if (!groupedByHomeworld[homeworldName]) {
                groupedByHomeworld[homeworldName] = [];
            }
            groupedByHomeworld[homeworldName].push(citizen.name);
        }

        // Format the grouped data for output and write it to a file
        const result = Object.entries(groupedByHomeworld)
            // Sort homeworlds alphabetically
            .sort(([homeworldA], [homeworldB]) => homeworldA.localeCompare(homeworldB))
            // Format the homeworlds and citizen names into the desired format
            .map(([homeworld, names]) => `${homeworld}\n- ${names.join('\n- ')}`)
            .join('\n\n');

        // Save the formatted results to a file
        await saveFile('citizens-super-secret-info.txt', result);
    } catch (error) {

        console.error('Error processing citizens:', error);
        throw error;
    }
}