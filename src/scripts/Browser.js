import { FILE_CONSTANTS } from "./constants.js";
import { errorLogMessageFormatter } from "./sharedUtility.js";
import { ChromeWindowTabService } from "../services/ChromeWindowTabService.js";

export class Browser {
    constructor() {
        this.loggingMessages = FILE_CONSTANTS.BROWSER_CLASS.LOGGING_MESSAGES;
    }

    /**
     * Fetches all open chrome windows.
     * @returns {Array} - List of chrome windows []
     */
    async getAllOpenWindows() {
        try {
            const windows = await ChromeWindowTabService.getAllOpenWindows();
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
            console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getAllOpenWindows'), error);
            throw error;
        }
    }

    /**
     * Closes chrome tabs
     * @param {Array} tabIds - Tab ids needs to be passed
     */
    async closeSelectedTabs(tabIds) {
        try {
            await ChromeWindowTabService.closeTabsByTabId(tabIds);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'closeSelectedTabs'), error);
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
            return await ChromeWindowTabService.createNewWindowWithURLs(options);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'createNewWindow'), error);
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
            return ChromeWindowTabService.openTabsInOpenedWindowByID(options)
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'openTabsInExistingWindow'), error);
            throw error;
        }
    }

    async getCurrentOpenWindow() {
        try {
            return await ChromeWindowTabService.getCurrentOpenWindow();
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getCurrentOpenWindow'), error);
            throw error;
        }
    }

    async openSelectedWindowTab(windowId, tabId) {
        try {
            const updatedWindowState = { state: 'maximized' }
            const updatedTabState = { active: true }
            if(await ChromeWindowTabService.updateOpenWindow(parseInt(windowId), updatedWindowState)) {
                await ChromeWindowTabService.updateOpenTab(parseInt(tabId), updatedTabState);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'updateOpenWindowState'), error);
            throw error;
        }
    }
}