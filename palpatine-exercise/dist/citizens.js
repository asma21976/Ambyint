"use strict";
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
const decryptor_1 = require("./decryptor");
const starwars_api_1 = require("./starwars-api");
const file_helper_1 = require("./utils/file-helper");
function processCitizens() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Load encrypted citizen data from a file
            const encryptedData = yield (0, file_helper_1.loadFile)('super-secret-data.txt');
            // Check if the last item is just whitespace and remove it
            if (encryptedData[encryptedData.length - 1].trim() === '') {
                encryptedData.pop();
            }
            // Decrypt the loaded data using the decryption function
            const decryptedData = yield (0, decryptor_1.decryptData)(encryptedData);
            // Create an object to store unique citizens by name
            const citizens = {};
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
            const uniqueHomeworldUrls = new Set();
            for (const citizen of Object.values(citizens)) {
                if (citizen.homeworld)
                    uniqueHomeworldUrls.add(citizen.homeworld);
            }
            console.log(`Number of unique homeworlds: ${uniqueHomeworldUrls.size}`);
            // Cache to store the mapping of homeworld URLs to homeworld names
            const homeworldCache = new Map();
            // Fetch the homeworld names for all unique homeworld URLs to avoid excessive API calls
            for (const homeworldUrl of uniqueHomeworldUrls) {
                let homeworldName = yield (0, starwars_api_1.fetchHomeworldName)(homeworldUrl);
                if (!homeworldName) {
                    // If the homeworld fetch fails, fall back to using the URL as the name
                    console.warn(`Failed to fetch homeworld for URL ${homeworldUrl}, using URL as fallback.`);
                    homeworldName = homeworldUrl;
                }
                homeworldCache.set(homeworldUrl, homeworldName);
            }
            // Group citizens by their homeworld names
            const groupedByHomeworld = {};
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
            yield (0, file_helper_1.saveFile)('citizens-super-secret-info.txt', result);
        }
        catch (error) {
            console.error('Error processing citizens:', error);
            throw error;
        }
    });
}
