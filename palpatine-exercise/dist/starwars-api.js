"use strict";
// import axios from 'axios';
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
exports.fetchHomeworldName = fetchHomeworldName;
// export async function fetchHomeworldName(homeworldUrl: string): Promise<string | null> {
//     if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
//         console.error(`Invalid homeworld URL: ${homeworldUrl}`);
//         return null; 
//     }
//     try {
//         const response = await axios.get(homeworldUrl);
//         return response.data.name;
//     } catch (error) {
//         console.error(`Failed to fetch homeworld for URL ${homeworldUrl}:`, error);
//         return null; 
//     }
// }
// import axios from 'axios';
// export async function fetchHomeworldName(homeworldUrl: string): Promise<string | null> {
//     if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
//         console.error(`Invalid homeworld URL: ${homeworldUrl}`);
//         return null;
//     }
//     try {
//         const response = await axios.get(homeworldUrl);
//         return response.data.name || null;
//     } catch (error) {
//         console.error(`Failed to fetch homeworld for URL ${homeworldUrl}:`, error);
//         return null;  // Return null if the fetch fails
//     }
// }
const axios_1 = __importDefault(require("axios"));
function fetchHomeworldName(homeworldUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
            console.error(`Invalid homeworld URL: ${homeworldUrl}`);
            return homeworldUrl; // Use the URL itself as a fallback if the URL is invalid
        }
        // Replace any outdated `swapi.co` domain with `swapi.dev`
        const updatedUrl = homeworldUrl.replace('https://swapi.co', 'https://swapi.dev');
        try {
            const response = yield axios_1.default.get(updatedUrl);
            // Return the `name` if it exists, otherwise use the URL as a fallback
            return response.data.name || updatedUrl;
        }
        catch (error) {
            // Type guard to check if `error` is of type `Error`
            if (error instanceof Error) {
                console.error(`Failed to fetch homeworld for URL ${updatedUrl}:`, error.message);
            }
            else {
                console.error(`Failed to fetch homeworld for URL ${updatedUrl}: An unknown error occurred.`);
            }
            return updatedUrl; // Return the URL as a fallback in case of an error
        }
    });
}
