import { ChromeLocalStorageService } from '../services/ChromeLocalStorageService.js';
import { ARCHIVE_STORAGE_NAME, ARCHIVE_LOOKUP_NAME } from './constants.js';

export class Archive {
    constructor(archiveName) {
        if (Archive.instance instanceof Archive) {
            return Archive.instance
        }
        this.archiveData = null;
        this._archiveName = archiveName;
    }

    /**
     * Check if the archive exists.
     * @returns {boolean}
     */
    async doesArchiveExist() {
        try {
            await this.fetchDataFromStorage();
            console.log("fetchDataFromStorage",this.archiveData)
            return this.archiveData && this.archiveData.hasOwnProperty(ARCHIVE_STORAGE_NAME) && this.archiveData.hasOwnProperty(ARCHIVE_LOOKUP_NAME);
        } catch (error) {
            console.error('Error checking if archive exists:', error);
            return false;
        }
    }

    // /**
    //  * Get the current archive list.
    //  * @returns {Array|null}
    //  */
    // getArchiveList() {
    //     return this.archiveData;
    // }

    // /**
    //  * Fetches the archive list from storage and sets it to archiveData property.
    //  */
    // async setArchiveList() {
    //     try {
    //         this.archiveData = await this.fetchDataFromStorage(this._archiveName);
    //     } catch (error) {
    //         console.error('Error setting archive list: ', error);
    //         throw error;
    //     }
    // }

    appendDataToArchiveList(data) {
        // TO-DO: Logic to write, lock user from any activity, reload table data
        this.storeDataInStorage(archiveData)
    }

    removeDataFromArchiveList(data) {
        // TO-DO: Logic to write, lock user from any activity, reload table data
        this.storeDataInStorage(archiveData)
    }

    /**
     * Fetches data from storage by key.
     * @param {string} key - The key to fetch data.
     * @returns {Promise<Array>} - Resolves with the fetched data.
     */
    async fetchDataFromStorage(key) {
        try {
            const data = await ChromeLocalStorageService.getValueChromeLocalStorage(key);
            this.archiveData = data;
            console.log('Fetched archive data:', data);
            return data || []; // Return an empty array if data is falsy
        } catch (error) {
            console.error('Error getting archive from storage: ', error);
            throw error;
        }
    }

    /**
     * Stores archive data in Chrome local storage.
     * @param {Array} archiveData - The data to store.
     */
    async storeDataInStorage(archiveData) {
        try {
            this.archiveData = await ChromeLocalStorageService.setValueChromeLocalStorage(archiveData);
            console.log('Archive data stored successfully:', archiveData);
        } catch (error) {
            console.error('Error getting archive from storage: ', error);
            throw error;
        }
    }

    /**
     * Creates a new empty archive and redirects to dashboard.
     * @returns {Promise<void>}
     */
    async createNewArchive(initialValue) {
        try {
            this.archiveData = await ChromeLocalStorageService.setValueChromeLocalStorage(initialValue);
            console.log("New archive created: ", this.archiveData);
            // window.location.href = "dashboard.html";
        } catch (error) {
            console.error('Error creating new archive: ', error);
            throw error;
        }
    }

    /**
     * Removes a specific key from the archive list.
     */
    async removeKeyFromArchive(key) {
        try {
            this.archiveData = await ChromeLocalStorageService.removeKeyChromeLocalStorage(key);
        } catch (error) {
            console.error(`Error removing key from archive: `, error);
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
            console.log('All data cleared successfully');
        } catch (error) {
            console.error('Error clearing all archives: ', error);
            throw error;
        }
    }
}