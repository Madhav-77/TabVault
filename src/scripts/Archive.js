import { ChromeLocalStorageService } from '../services/ChromeLocalStorageService.js';
import { ARCHIVE_STORAGE_NAME } from './constants.js';

export class Archive {
    constructor(archiveName) {
        if (Archive.instance instanceof Archive) {
            return Archive.instance
        }
        this.archiveList = null;
        this._archiveName = archiveName;
    }

    /**
     * Check if the archive exists.
     * @returns {boolean}
     */
    async doesArchiveExist() {
        try {
            await this.fetchDataFromStorage(this._archiveName);
            console.log(this.archiveList)
            return this.archiveList && this.archiveList.hasOwnProperty(ARCHIVE_STORAGE_NAME);
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
    //     return this.archiveList;
    // }

    // /**
    //  * Fetches the archive list from storage and sets it to archiveList property.
    //  */
    // async setArchiveList() {
    //     try {
    //         this.archiveList = await this.fetchDataFromStorage(this._archiveName);
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
            this.archiveList = data;
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
            this.archiveList = await ChromeLocalStorageService.setValueChromeLocalStorage(archiveData);
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
            this.archiveList = await ChromeLocalStorageService.setValueChromeLocalStorage(initialValue);
            console.log("New archive created: ", this.archiveList);
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
            this.archiveList = await ChromeLocalStorageService.removeKeyChromeLocalStorage(key);
        } catch (error) {
            console.error(`Error removing key from archive: `, error);
            throw error;
        }
    }

    /**
     * Clears all archives from Chrome local storage.
     */
    async clearAllArchives() {
        try {
            ChromeLocalStorageService.clearChromeLocalStorage();
            this.archiveList = null;
            console.log('All archives cleared successfully');
        } catch (error) {
            console.error('Error clearing all archives: ', error);
            throw error;
        }
    }
}