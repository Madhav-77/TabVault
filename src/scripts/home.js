import { FILE_CONSTANTS, ARCHIVE_INIT_VALUE } from './constants.js';
import { errorLogMessageFormatter } from './sharedUtility.js';

export class Home {
    constructor(archive) {
        if (Home.instance instanceof Home) {
            return Home.instance
        }
        this.archive = archive;
        this.loggingMessages = FILE_CONSTANTS.HOME_CLASS.LOGGING_MESSAGES;
    }

    initialize() {
        document.getElementById("create-new-archive").addEventListener('click', () => { this.createNewArchive(); });
    }

    /**
     * Creates new archive
     * Stores in chrome storage
     * Redirects to Dashboard
     */
    async createNewArchive() {
        try {
            await this.archive.storeDataInStorage(ARCHIVE_INIT_VALUE);
            navigateTo('dashboard', this.archive);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'createNewArchive'), error);
            throw error;
        }
    }
}