import { ChromeLocalStorageService } from '../services/ChromeLocalStorageService.js';
import { FILE_CONSTANTS } from './constants.js';
import { errorLogMessageFormatter } from './sharedUtility.js';

export class Archive {
    constructor(archiveName, archiveLookupName) {
        if (Archive.instance instanceof Archive) {
            return Archive.instance
        }
        this.archiveData = null;
        this._archiveName = archiveName;
        this._archiveLookupName = archiveLookupName;
        this.loggingMessages = FILE_CONSTANTS.ARCHIVE_CLASS.LOGGING_MESSAGES;
        this.failureMessages = FILE_CONSTANTS.ARCHIVE_CLASS.FAILURE_MESSAGE;
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
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'doesArchiveListExist'), error);
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
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'fetchDataFromStorage'), error);
            throw error;
        }
    }

    /**
     * Stores archive data in Chrome local storage.
     * @param {Array} data - The data to store.
     */
    async storeDataInStorage(data) {
        try {
            if(await ChromeLocalStorageService.setValueChromeLocalStorage(data)) {
                await this.fetchDataFromStorage();
                return { success: true, message: "" };
            } else {
                return { success: false, message: this.failureMessages.SOMETHING_WENT_WRONG };
            }
            // console.log('Archive data stored successfully:', archiveData);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'storeDataInStorage'), error);
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
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'clearAllData'), error);
            throw error;
        }
    }
}