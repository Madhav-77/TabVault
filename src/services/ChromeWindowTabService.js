import { FILE_CONSTANTS } from "../scripts/constants.js";

export class ChromeWindowTabService {
    constructor() {}

    static errorMessages = FILE_CONSTANTS.CHROME_WINDOW_TAB_SERVICE.LOGGING_MESSAGES.ERROR;

    /**
     * Gets all current open windows
     * @returns {Promise<Array>} List of open windows
     */
    static getAllOpenWindows() {
        return new Promise((resolve, reject) => {
            chrome.windows.getAll({ populate: true }, (windows) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.GET_ALL_WINDOWS_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(windows);
                }
            });
        });
    }

    /**
     * Closes tabs by Tab ids
     * @param {Array} tabIds 
     * @returns {Promise}
     */
    static closeTabsByTabId(tabIds) {
        return new Promise((resolve, reject) => {
            chrome.tabs.remove(tabIds, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.CLOSE_TABS_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Creates new windows with URLs
     * @param {Object} options 
     * @returns {Promise<Object>} recently open window
     */
    static createNewWindowWithURLs(options) {
        return new Promise((resolve, reject) => {
            chrome.windows.create(options, (window) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.CREATE_WINDOW_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(window);
                }
            });
        });
    }

    /**
     * Open tabs in specified windows by window id
     * @param {Object} options 
     * @returns {Promise<Object>} recently open tab
     */
    static openTabsInOpenedWindowByID(options) {
        return new Promise((resolve, reject) => {
            chrome.tabs.create(options, (tab) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.OPEN_TABS_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(tab);
                }
            });
        });
    }

    /**
     * Gets details of current open window 
     * @returns {Promise<Object>} current open window data
     */
    static getCurrentOpenWindow() {
        return new Promise((resolve, reject) => {
            chrome.windows.getCurrent((window) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.GET_CURRENT_WINDOW_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(window);
                }
            });
        });
    }

    /**
     * Updates currently open chrome window object
     * @param {Number} windowId 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    static updateOpenWindow(windowId, data) {
        return new Promise((resolve, reject) => {
            chrome.windows.update(windowId, data, (window) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.UPDATE_OPEN_WINDOW_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(window);
                }
            });
        });
    }

    /**
     * Updates currently open chrome tab object
     * @param {Number} tabId 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    static updateOpenTab(tabId, data) {
        return new Promise((resolve, reject) => {
            chrome.tabs.update(tabId, data, (tab) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`${ChromeWindowTabService.errorMessages.UPDATE_OPEN_TAB_ERROR} ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(tab);
                }
            });
        });
    }
}