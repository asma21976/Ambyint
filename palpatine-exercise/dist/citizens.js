"use strict";
// import { decryptData } from './decryptor';
// import { fetchHomeworldName } from './starwars-api';
// import { loadFile, saveFile } from './utils/file-helper';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCitizens = processCitizens;
// interface Citizen {
//     name: string;
//     homeworld: string;
// }
// export async function processCitizens() {
//     try {
//         console.log('Loading encrypted data...');
//         const encryptedData = await loadFile('super-secret-data.txt');
//         console.log('Encrypted data loaded:', encryptedData.length, 'entries');
//         console.log('Decrypting data...');
//         const decryptedData = await decryptData(encryptedData);
//         console.log('Data decrypted:', decryptedData.length, 'entries');
//         const citizens: { [name: string]: Citizen } = {};
//         console.log('Removing duplicates...');
//         const uniqueCitizens = Array.from(new Map(decryptedData.map(c => [c.name, c])).values());
//         console.log('Duplicates removed:', uniqueCitizens.length, 'unique entries');
//         // Populate the citizens object
//         uniqueCitizens.forEach((citizen) => {
//             if (!citizen.name || !citizen.homeworld) {
//                 console.warn(`Citizen data missing:`, citizen);
//                 return;
//             }
//             citizens[citizen.name] = citizen;
//         });
//         const homeworldCache = new Map<string, string>();
//         const groupedByHomeworld: { [key: string]: string[] } = {};
//         console.log('Fetching homeworld names...');
//         for (const citizenName in citizens) {
//             const citizen = citizens[citizenName];
//             const homeworldUrl = citizen.homeworld;
//             if (!homeworldUrl) {
//                 console.error(`Missing homeworld URL for citizen: ${citizen.name}`);
//                 continue;  // Skip if there's no homeworld URL
//             }
//             console.log(`Fetching homeworld for citizen ${citizen.name}: ${homeworldUrl}`);
//             let homeworldName = homeworldCache.get(homeworldUrl);
//             if (!homeworldName) {
//                 // Fetch homeworld name (assuming async fetchHomeworldName)
//                 homeworldName = await fetchHomeworldName(homeworldUrl) || 'Unknown';
//                 homeworldCache.set(homeworldUrl, homeworldName);
//             }
//             // Log fetched homeworld for debugging
//             console.log(`Homeworld for ${citizen.name}: ${homeworldName}`);
//             if (!groupedByHomeworld[homeworldName]) {
//                 groupedByHomeworld[homeworldName] = [];
//             }
//             groupedByHomeworld[homeworldName].push(citizen.name);
//         }
//         console.log('Homeworld names fetched and grouped.');
//         console.log('Writing results to file...');
//         // Ensure the homeworlds are sorted in the desired order
//         const result = Object.entries(groupedByHomeworld)
//             .sort(([homeworldA], [homeworldB]) => homeworldA.localeCompare(homeworldB))  // Sort alphabetically by homeworld name
//             .map(([homeworld, names]) => {
//                 // Format the names for the output
//                 return `${homeworld}\n- ${names.join('\n- ')}`;
//             })
//             .join('\n\n');
//         await saveFile('citizens-super-secret-info.txt', result);
//         console.log('Results written to citizens-super-secret-info.txt');
//     } catch (error) {
//         console.error('Error processing citizens:', error);
//     }
// }
// import { decryptData } from './decryptor';
// import { fetchHomeworldName } from './starwars-api';
// import { loadFile, saveFile } from './utils/file-helper';
// interface Citizen {
//     name: string;
//     homeworld: string;
// }
// export async function processCitizens() {
//     try {
//         console.log('Loading encrypted data...');
//         const encryptedData = await loadFile('super-secret-data.txt');
//         console.log('Encrypted data loaded:', encryptedData.length, 'entries');
//         console.log('Decrypting data...');
//         const decryptedData = await decryptData(encryptedData);
//         console.log('Data decrypted:', decryptedData.length, 'entries');
//         const citizens: { [name: string]: Citizen } = {};
//         console.log('Removing duplicates...');
//         const uniqueCitizens = Array.from(new Map(decryptedData.map(c => [c.name, c])).values());
//         console.log('Duplicates removed:', uniqueCitizens.length, 'unique entries');
//         // Populate the citizens object
//         uniqueCitizens.forEach((citizen) => {
//             if (!citizen.name || !citizen.homeworld) {
//                 console.warn(`Citizen data missing:`, citizen);
//                 return;
//             }
//             citizens[citizen.name] = citizen;
//         });
//         const homeworldCache = new Map<string, string>();
//         const groupedByHomeworld: { [key: string]: string[] } = {};
//         console.log('Fetching homeworld names...');
//         for (const citizenName in citizens) {
//             const citizen = citizens[citizenName];
//             const homeworldUrl = citizen.homeworld;
//             // Check if the homeworldUrl is empty or invalid
//             if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
//                 console.error(`Invalid or missing homeworld URL for citizen: ${citizen.name}, URL: ${homeworldUrl}`);
//                 continue;  // Skip if there's no valid homeworld URL
//             }
//             console.log(`Fetching homeworld for citizen ${citizen.name}: ${homeworldUrl}`);
//             let homeworldName = homeworldCache.get(homeworldUrl);
//             if (!homeworldName) {
//                 // Fetch homeworld name
//                 homeworldName = await fetchHomeworldName(homeworldUrl);
//                 if (!homeworldName) {
//                     // If homeworldName is empty or null, fallback to 'Unknown'
//                     console.warn(`Failed to fetch homeworld for ${citizen.name}, defaulting to 'Unknown'`);
//                     homeworldName = 'Unknown';
//                 }
//                 homeworldCache.set(homeworldUrl, homeworldName);
//             }
//             // Log fetched homeworld for debugging
//             console.log(`Homeworld for ${citizen.name}: ${homeworldName}`);
//             if (!groupedByHomeworld[homeworldName]) {
//                 groupedByHomeworld[homeworldName] = [];
//             }
//             groupedByHomeworld[homeworldName].push(citizen.name);
//         }
//         console.log('Homeworld names fetched and grouped.');
//         console.log('Writing results to file...');
//         // Ensure the homeworlds are sorted in the desired order
//         const result = Object.entries(groupedByHomeworld)
//             .sort(([homeworldA], [homeworldB]) => homeworldA.localeCompare(homeworldB))  // Sort alphabetically by homeworld name
//             .map(([homeworld, names]) => {
//                 // Format the names for the output
//                 return `${homeworld}\n- ${names.join('\n- ')}`;
//             })
//             .join('\n\n');
//         await saveFile('citizens-super-secret-info.txt', result);
//         console.log('Results written to citizens-super-secret-info.txt');
//     } catch (error) {
//         console.error('Error processing citizens:', error);
//     }
// }
const decryptor_1 = require("./decryptor");
const starwars_api_1 = require("./starwars-api");
const file_helper_1 = require("./utils/file-helper");
function processCitizens() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Loading encrypted data...');
            const encryptedData = yield (0, file_helper_1.loadFile)('super-secret-data.txt');
            console.log('Encrypted data loaded:', encryptedData.length, 'entries');
            console.log('Decrypting data...');
            const decryptedData = yield (0, decryptor_1.decryptData)(encryptedData);
            console.log('Data decrypted:', decryptedData.length, 'entries');
            const citizens = {};
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
            const uniqueHomeworldUrls = new Set();
            for (const citizen of Object.values(citizens)) {
                if (citizen.homeworld)
                    uniqueHomeworldUrls.add(citizen.homeworld);
            }
            console.log('Unique homeworld URLs identified:', uniqueHomeworldUrls.size);
            const homeworldCache = new Map();
            console.log('Fetching homeworld names...');
            // Fetch names for each unique homeworld URL
            for (const homeworldUrl of uniqueHomeworldUrls) {
                let homeworldName = yield (0, starwars_api_1.fetchHomeworldName)(homeworldUrl);
                if (!homeworldName) {
                    console.warn(`Failed to fetch homeworld for URL ${homeworldUrl}, using URL as fallback.`);
                    homeworldName = homeworldUrl; // Use URL as fallback key
                }
                homeworldCache.set(homeworldUrl, homeworldName);
            }
            console.log('Homeworld names fetched and cached.');
            const groupedByHomeworld = {};
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
            yield (0, file_helper_1.saveFile)('citizens-super-secret-info.txt', result);
            console.log('Results written to citizens-super-secret-info.txt');
        }
        catch (error) {
            console.error('Error processing citizens:', error);
        }
    });
}
