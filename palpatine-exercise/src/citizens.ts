import { decryptData } from './decryptor';
import { fetchHomeworldName } from './starwars-api';
import { loadFile, saveFile } from './utils/file-helper';

interface Citizen {
    name: string;
    homeworld: string;
}

export async function processCitizens() {
    try {
        console.log('Loading encrypted data...');
        const encryptedData = await loadFile('super-secret-data.txt');
        console.log('Encrypted data loaded:', encryptedData.length, 'entries');

        console.log('Decrypting data...');
        const decryptedData = await decryptData(encryptedData);
        console.log('Data decrypted:', decryptedData.length, 'entries');

        const citizens: { [name: string]: Citizen } = {};

        console.log('Removing duplicates...');
        const uniqueCitizens = Array.from(new Map(decryptedData.map(c => [c.name, c])).values());
        console.log('Duplicates removed:', uniqueCitizens.length, 'unique entries');

        // Populate the citizens object
        uniqueCitizens.forEach((citizen) => {
            if (!citizen.name || !citizen.homeworld) {
                console.warn(`Citizen data missing:`, citizen);
                return;
            }
            citizens[citizen.name] = citizen;
        });

        const uniqueHomeworldUrls = new Set<string>();
        for (const citizen of Object.values(citizens)) {
            if (citizen.homeworld) uniqueHomeworldUrls.add(citizen.homeworld);
        }

        console.log('Unique homeworld URLs identified:', uniqueHomeworldUrls.size);

        const homeworldCache = new Map<string, string>();
        console.log('Fetching homeworld names...');
        
        // Fetch names for each unique homeworld URL
        for (const homeworldUrl of uniqueHomeworldUrls) {
            let homeworldName = await fetchHomeworldName(homeworldUrl);
            if (!homeworldName) {
                console.warn(`Failed to fetch homeworld for URL ${homeworldUrl}, using URL as fallback.`);
                homeworldName = homeworldUrl; // fallback key
            }
            homeworldCache.set(homeworldUrl, homeworldName);
        }

        console.log('Homeworld names fetched and cached.');

        const groupedByHomeworld: { [key: string]: string[] } = {};

        for (const citizenName in citizens) {
            const citizen = citizens[citizenName];
            const homeworldUrl = citizen.homeworld;

            const homeworldName = homeworldCache.get(homeworldUrl) || 'Unknown';

            if (!groupedByHomeworld[homeworldName]) {
                groupedByHomeworld[homeworldName] = [];
            }
            groupedByHomeworld[homeworldName].push(citizen.name);
        }

        console.log('Citizens grouped by homeworld.');

        console.log('Writing results to file...');
        const result = Object.entries(groupedByHomeworld)
            .sort(([homeworldA], [homeworldB]) => homeworldA.localeCompare(homeworldB))
            .map(([homeworld, names]) => `${homeworld}\n- ${names.join('\n- ')}`)
            .join('\n\n');

        await saveFile('citizens-super-secret-info.txt', result);
        console.log('Results written to citizens-super-secret-info.txt');
    } catch (error) {
        console.error('Error processing citizens:', error);
    }
}
