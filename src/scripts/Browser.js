import { FILE_CONSTANTS } from "./constants.js";

export class Browser {
    constructor() {}

    /**
     * Fetches all open chrome windows.
     * @returns {Array} - List of chrome windows []
     */
    async getAllOpenWindows() {
        try {
            const windows = await chrome.windows.getAll({ populate: true });
            const allWindows = windows.map(window => {
                return {
                    windowId: window.id,
                    focused: window.focused,
                    tabs: window.tabs.map(tab => {
                        return {
                            tabId: tab.id,
                            title: tab.title,
                            url: tab.url,
                            active: tab.active
                        };
                    })
                };
            });
            return allWindows;
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('getAllOpenWindows'), error);
            throw error;
        }
    }

    /**
     * Closes chrome tabs
     * @param {Array} tabIds - Tab ids needs to be passed
     */
    async closeSelectedTabs(tabIds) {
        try {
            await chrome.tabs.remove(tabIds);
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('closeSelectedTabs'), error);
            throw error;
        }
    }

    /**
     * Creates new windows with single/multiple tabs
     * @param {Array} urls - Tab URLs needs to be passed
     * @returns {Promise} - Resolves with data about last opened chrome window instance.
     */
    async createNewWindow(urls) {
        try {
            const options = {
                url: urls,
                left: 100,
                top: 100,
                width: 800,
                height: 600,
                focused: true,
                type: 'normal'
            };
            return new Promise((resolve, reject) => {
                chrome.windows.create(options, function(window) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(window);
                    }
                });
            });
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('createNewWindow'), error);
            throw error;
        }
    }

    /**
     * Opens single/multiple tab in already opened window
     * @param {String} windowId - Target Window Id
     * @param {Array} urls - Tab URLs
     * @returns {Promise} - Resolves with data about last opened chrome tab instance.
     */
    async openTabsInExistingWindow(windowId, urls) {
        try {
            const options = {
                windowId: parseInt(windowId),
                url: urls
            };
            return new Promise((resolve, reject) => {
                chrome.tabs.create(options, function(tab) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(tab);
                    }
                });
            });
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('openTabsInExistingWindow'), error);
            throw error;
        }
    }
    
    errorLogMessageFormatter(customMessage) {
        return FILE_CONSTANTS.BROWSER_CLASS.LOGGING_MESSAGES.FILE_NAME + ' - ' + customMessage + ' ';
    }
}