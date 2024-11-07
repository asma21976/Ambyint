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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = decryptData;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Helper function to break the encrypted data into smaller chunks for efficient processing
function chunkArray(arr, size) {
    const result = [];
    // Loop through the array and create chunks of the specified size
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
// Function to decrypt the encrypted citizen data
function decryptData(encryptedData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const CHUNK_SIZE = 1000; // Defines the size of each chunk to send in the request
        let decryptedData = []; // Array to store the final decrypted data
        // Split the encrypted data into smaller chunks to avoid potential issues with large payloads
        const chunks = chunkArray(encryptedData, CHUNK_SIZE);
        for (const chunk of chunks) {
            try {
                const requestBody = chunk; // The chunk of encrypted data to send in the API request
                // Send the chunk to the decryption API
                const response = yield axios_1.default.post('https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt', requestBody, // The request body containing the chunk of encrypted data
                {
                    headers: {
                        'x-api-key': process.env.API_KEY,
                    },
                });
                // Parse the decrypted data and validate each citizen's data
                const parsedCitizens = response.data.map((citizen, index) => {
                    let parsedCitizen;
                    // Check if the citizen is a string that needs to be parsed as JSON
                    if (typeof citizen === 'string') {
                        try {
                            parsedCitizen = JSON.parse(citizen); // Try parsing the citizen data
                        }
                        catch (error) {
                            return null; // Return null if parsing fails
                        }
                    }
                    else {
                        // If the citizen is already an object, use it as is
                        parsedCitizen = citizen;
                    }
                    // Validate that the citizen has both a valid name and homeworld
                    const isNameValid = parsedCitizen.name && parsedCitizen.name.trim().length > 0;
                    const isHomeworldValid = parsedCitizen.homeworld && parsedCitizen.homeworld.trim().length > 0;
                    if (!isNameValid || !isHomeworldValid) {
                        return null;
                    }
                    else {
                        return parsedCitizen;
                    }
                }).filter(Boolean); // Filter out any invalid or null citizens
                // Concatenate the successfully parsed and validated citizens into the final result
                decryptedData = decryptedData.concat(parsedCitizens);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error('Error processing chunk:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message); // Log the error details
                }
                else {
                    console.error('Unknown error:', error);
                }
                throw error;
            }
        }
        return decryptedData;
    });
}
