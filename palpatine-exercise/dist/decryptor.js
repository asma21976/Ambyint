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
function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
function decryptData(encryptedData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const CHUNK_SIZE = 1000;
        let decryptedData = [];
        const chunks = chunkArray(encryptedData, CHUNK_SIZE);
        for (const chunk of chunks) {
            try {
                const requestBody = chunk;
                const response = yield axios_1.default.post('https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt', requestBody, {
                    headers: {
                        'x-api-key': process.env.API_KEY,
                    },
                });
                console.log('Decrypted Response Data:', response.data);
                // Use map to transform the array and create a new one with valid, parsed citizens
                const parsedCitizens = response.data.map((citizen, index) => {
                    console.log(`Citizen ${index}:`, citizen);
                    let parsedCitizen;
                    if (typeof citizen === 'string') {
                        try {
                            // Parse the string citizen into a JavaScript object
                            parsedCitizen = JSON.parse(citizen);
                            console.log(`Parsed Citizen ${index}:`, parsedCitizen);
                        }
                        catch (error) {
                            console.error(`Error parsing citizen data at index ${index}:`, error);
                            return null; // Skip this citizen if parsing fails
                        }
                    }
                    else {
                        parsedCitizen = citizen; // If it's already an object, use it
                        console.log(`Citizen ${index} is already an object:`, parsedCitizen);
                    }
                    // Check if 'name' and 'homeworld' are valid
                    const isNameValid = parsedCitizen.name && parsedCitizen.name.trim().length > 0;
                    const isHomeworldValid = parsedCitizen.homeworld && parsedCitizen.homeworld.trim().length > 0;
                    if (!isNameValid || !isHomeworldValid) {
                        console.warn(`Citizen ${index} has missing data:`, parsedCitizen);
                        return null; // If data is invalid, return null (this will be filtered out)
                    }
                    else {
                        console.log(`Citizen ${index} has valid data:`, parsedCitizen);
                        return parsedCitizen; // Return the valid parsed citizen
                    }
                }).filter(Boolean); // Filter out any null values (invalid citizens)
                // Concatenate valid parsed citizens into decryptedData array
                decryptedData = decryptedData.concat(parsedCitizens);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error('Error processing chunk:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                }
                else {
                    console.error('Unknown error:', error);
                }
                throw error;
            }
            break;
        }
        return decryptedData;
    });
}
