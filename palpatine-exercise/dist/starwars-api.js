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
exports.fetchHomeworldName = fetchHomeworldName;
const axios_1 = __importDefault(require("axios"));
function fetchHomeworldName(homeworldUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check for valid URL format
        if (!homeworldUrl || !/^https?:\/\//.test(homeworldUrl)) {
            console.error(`Invalid homeworld URL: ${homeworldUrl}`);
            return homeworldUrl; // Return the original URL if invalid
        }
        // Update the URL to point to the active API endpoint
        const updatedUrl = homeworldUrl.replace('https://swapi.co', 'https://swapi.dev');
        try {
            // Fetch the homeworld data from the updated URL
            const response = yield axios_1.default.get(updatedUrl);
            return response.data.name || updatedUrl;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to fetch homeworld for URL ${updatedUrl}:`, error.message);
            }
            else {
                console.error(`Failed to fetch homeworld for URL ${updatedUrl}: An unknown error occurred.`);
            }
            return updatedUrl;
        }
    });
}
