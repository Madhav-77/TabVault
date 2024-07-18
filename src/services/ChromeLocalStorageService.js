import { FILE_CONSTANTS } from "../scripts/constants.js";

export class ChromeLocalStorageService {
    constructor() {}

    static errorMessages = FILE_CONSTANTS.CHROME_STORAGE_SERVICE.LOGGING_MESSAGES.ERROR;
    static successMessages = FILE_CONSTANTS.CHROME_STORAGE_SERVICE.LOGGING_MESSAGES.SUCCESS;

    /**
     * Get value from chrome local storage
     * returns a key from storage if key is passed,
     * if not, returns all data
     * @param {string} [key=""] 
     * @returns {Array} result
     */
    static getValueChromeLocalStorage(key = "") {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key ? [key] : null, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeLocalStorageService.errorMessages.GET_VALUE_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Stores data in chrome local storage
     * @param {Object} data 
     * @returns {Promise<Object>} - Resolves with the last stored data.
     */
    static setValueChromeLocalStorage(data) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeLocalStorageService.errorMessages.SET_VALUE_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    // console.log(`${ChromeLocalStorageService.successMessages.SET_VALUE_SUCCESS}`);
                    resolve(data); // Resolve the promise with the saved data
                }
            });
        });
    }

    /**
     * Removes single key from chrome local storage
     * @param {String} key 
     * @returns {Promise<Object>} - Resolves with the data after removing key.
     */
    static removeKeyChromeLocalStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove([key], (data) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeLocalStorageService.errorMessages.REMOVE_KEY_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    // console.log(`${ChromeLocalStorageService.successMessages.REMOVE_KEY_SUCCESS}`);
                    resolve(data);
                }
            });
        });
    }

    /**
     * Clears all stored data from Chrome local storage
     * @returns {Promise}
     */
    static clearChromeLocalStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.clear(() => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeLocalStorageService.errorMessages.CLEAR_STORAGE_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    // console.log(`${ChromeLocalStorageService.successMessages.CLEAR_STORAGE_SUCCESS}`);
                    resolve();
                }
            });
        });
    }
}