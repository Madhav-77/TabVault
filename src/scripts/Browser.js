export class Browser {
    constructor() {}

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
            console.log("Browser.js - getAllOpenWindows: ", error);
            throw error;
        }
    }

    async closeSelectedTabs(tabIds) {
        try {
            await chrome.tabs.remove(tabIds);
        } catch (error) {
            console.log("Browser.js - closeSelectedTabs: ", error);
            throw error;
        }
    }

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
            await chrome.windows.create(options, function(window) {
                return window;
            });
        } catch (error) {
            console.log("Browser.js - createNewWindow: ", error);
        }
    }
}