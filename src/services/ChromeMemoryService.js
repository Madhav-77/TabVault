import { FILE_CONSTANTS } from "../scripts/constants.js";

export class ChromeMemoryService {
    constructor() {}

    static errorMessages = FILE_CONSTANTS.CHROME_MEMORY_SERVICE.LOGGING_MESSAGES.ERROR;

    /**
     * Gets users RAM stats
     * @returns {Promise<Object>} RAM data (available memory, total memory)
     */
    static getSystemMemoryInfo() {
        return new Promise((resolve, reject) => {
            chrome.system.memory.getInfo((data) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeMemoryService.errorMessages.GET_SYSTEM_MEMORY_ERROR} ${chrome.runtime.lastError.message}`))
                } else {
                    resolve(data);
                }
            });
        });
    }
}