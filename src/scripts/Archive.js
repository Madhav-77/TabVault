import { ChromeLocalStorageService } from '../services/ChromeLocalStorageService.js';
import { FILE_CONSTANTS } from './constants.js';

export class Archive {
    constructor(archiveName, archiveLookupName) {
        if (Archive.instance instanceof Archive) {
            return Archive.instance
        }
        this.archiveData = null;
        this._archiveName = archiveName;
        this._archiveLookupName = archiveLookupName;
    }

    /**
     * Check if the archive data exists.
     * @returns {boolean}
     */
    async doesArchiveDataExist() {
        try {
            const archiveData = await this.fetchDataFromStorage();
            // console.log("fetchDataFromStorage", archiveData)
            return archiveData && archiveData.hasOwnProperty(this._archiveName) && archiveData.hasOwnProperty(this._archiveLookupName);
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('doesArchiveListExist'), error);
            throw error;
        }
    }

    /**
     * Fetches data from storage by key.
     * @param {string} key - The key to fetch data. If no key, returns all data.
     * @returns {Promise<Array>} - Resolves with the fetched data.
     */
    async fetchDataFromStorage(key) {
        try {
            this.archiveData = await ChromeLocalStorageService.getValueChromeLocalStorage(key);
            // console.log('Fetched archive data:', this.archiveData);
            return this.archiveData || []; // Return an empty array if data is falsy
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('fetchDataFromStorage'), error);
            throw error;
        }
    }

    /**
     * Stores archive data in Chrome local storage.
     * @param {Array} data - The data to store.
     */
    async storeDataInStorage(data) {
        try {
            await ChromeLocalStorageService.setValueChromeLocalStorage(data);
            this.fetchDataFromStorage();
            // console.log('Archive data stored successfully:', archiveData);
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('storeDataInStorage'), error);
            throw error;
        }
    }

    /**
     * Clears all data from Chrome local storage.
     */
    async clearAllData() {
        try {
            ChromeLocalStorageService.clearChromeLocalStorage();
            this.archiveData = null;
            // console.log('All data cleared successfully');
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('clearAllData'), error);
            throw error;
        }
    }

    errorLogMessageFormatter(customMessage) {
        return FILE_CONSTANTS.ARCHIVE_CLASS.LOGGING_MESSAGES.FILE_NAME + ' - ' + customMessage + ' ';
    }
}