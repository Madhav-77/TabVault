export class ChromeLocalStorageService {
    constructor() {}

    // Get Key
    static getValueChromeLocalStorage(key = "") {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key ? [key] : null, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Error getting data: ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Set data
    static setValueChromeLocalStorage(data, callback) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Error storing data: ${chrome.runtime.lastError.message}`));
                } else {
                    console.log('Data stored successfully');
                    resolve(data); // Resolve the promise with the saved data
                }
            });
        });
    }

    // Remove specific key
    static removeKeyChromeLocalStorage(key, callback) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove([key], (data) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Error removing key: ${chrome.runtime.lastError.message}`));
                } else {
                    console.log(`Key ${key} removed successfully`);
                    resolve(data);
                }
            });
        });
    }

    // Clear all 
    static clearChromeLocalStorage(callback) {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error(`Error clearing storage: ${chrome.runtime.lastError.message}`);
                if (callback) callback(false);
            } else {
                console.log('All keys cleared successfully');
                if (callback) callback(true); //redirectToIndex()
            }
        });
    }
}