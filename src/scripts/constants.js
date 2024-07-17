export const ARCHIVE_LIST_NAME = "archive";
export const ARCHIVE_WINDOW_LOOKUP_NAME = "windows_name_lookup";
export const ARCHIVE_INIT_VALUE = {
    archive: [],
    windows_name_lookup: {}
};
export const FILE_CONSTANTS = {
    DASHBOARD_CLASS: {
        TABS: ["open", "archive"],
        SELECTORS: {
            CLASS_OPEN_TABLE: ".open-windows-table ", // open windows tab div, space at end should not be removed
            CLASS_ARCHIVE_TABLE: ".archive-windows-table ", // archive windows tab div, space at end should not be removed
            OPEN_WINDOWS_TAB: "open-windows-tab",
            CLASS_OPEN_TAB_BUTTONS: ".open-tab-buttons",
            ARCHIVE_WINDOWS_TAB: "archive-windows-tab",
            CLASS_ARCHIVE_TAB_BUTTONS: ".archive-tab-buttons",
            DATA_WINDOW_ID: "data-window-id",
            DATA_TAB_ID: "data-tab-id",

            CHECKBOXES: {
                ALL_WINDOW: "input.select-all-window-checkbox[type='checkbox']", // all window checkbox query selector
                WINDOW: "input.select-window-checkbox[type='checkbox']", // window checkbox query selector
                TAB: "input.select-tab-checkbox[type='checkbox']", // tab checkbox query selector

                WINDOW_ENABLED: "input.select-window-checkbox[type='checkbox']:not(:disabled)", // windowNotDisabled
                WINDOW_CHECKED_ENABLED: "input.select-window-checkbox[type='checkbox']:checked:not(:disabled)", // windowCheckedNotDisabled
                TAB_ENABLED: "input.select-tab-checkbox[type='checkbox']:not(:disabled)", // tabNotDisabled
                TAB_CHECKED_ENABLED: "input.select-tab-checkbox:checked:not(:disabled)", // tabCheckedNotDisabled
                TAB_NOT_CHECKED_ENABLED: "input.select-tab-checkbox:not(:checked):not(:disabled)", // tabUncheckedEnabled
            }
        },
        LOGGING_MESSAGES: {
            FILE_NAME: "Dashboard.js"
        },
        TITLE_MESSAGES: {
            ALREADY_ARCHIVED: "Already archived",
            CHECKBOX_DISABLE_WINDOW_NAME_EDIT: "Close or Save window name",
            GO_TO_TAB: "Go to this tab",
            ARCHIVE_AND_CLOSE: "Store selected windows in archive and close",
            CLOSE_WINDOWS: "Close selected windows without storing",
            OPEN_WINDOWS: "Open selected windows",
            DELETE_FROM_ARCHIVE: "Delete selected windows from archive",
            DELETE_ALL_ARCHIVE: "Delete all data from archive permanently"
        },
        POPUP_MESSAGES: {
            NO_SELECTION: "Please select at least 1 window/tab.",
            CLOSE_WINDOWS: "Are you sure you want to close selected windows/tabs without storing in archive?",
            ARCHIVE_CLOSE_WINDOWS: "This will store selected windows/tabs in archive and close it. Press Ok to continue.",
            DELETE_ARCHIVE: "Are you sure you want to Delete selected windows/tabs from archive? This action cannot be reversed.",
            DELETE_ALL_ARCHIVE: "This will clear all the stored data, and action cannot be reversed. Press Ok to continue.",
        }
    },
    ARCHIVE_CLASS: {
        LOGGING_MESSAGES: {
            FILE_NAME: "Archive.js"
        },
        FAILURE_MESSAGE: {
            SOMETHING_WENT_WRONG: "Something went wrong. Close and open the extension again or you can delete the archive."
        }
    },
    HOME_CLASS: {
        LOGGING_MESSAGES: {
            FILE_NAME: "Home.js"
        },
        TITLE_MESSAGES: {
            CREATE_NEW_ARCHIVE: "Sets up an empty archive to store windows later"
        }
    },
    BROWSER_CLASS: {
        LOGGING_MESSAGES: {
            FILE_NAME: "Browser.js"
        },
    },
    INDEX_SCRIPT: {
        LOGGING_MESSAGES: {
            FILE_NAME: "Index.js"
        }
    },
    CHROME_STORAGE_SERVICE: {
        LOGGING_MESSAGES: {
            ERROR: {
                GET_VALUE_ERROR: "getValueChromeLocalStorage - Error getting data:",
                SET_VALUE_ERROR: "setValueChromeLocalStorage - Error storing data:",
                REMOVE_KEY_ERROR: "removeKeyChromeLocalStorage - Error removing key:",
                CLEAR_STORAGE_ERROR: "clearChromeLocalStorage - Error clearing storage:"
            },
            SUCCESS: {
                SET_VALUE_SUCCESS: "Data stored successfully!",
                REMOVE_KEY_SUCCESS: "Key removed successfully!",
                CLEAR_STORAGE_SUCCESS: "All keys cleared successfully"
            }
        }
    },
    CHROME_WINDOW_TAB_SERVICE: {
        LOGGING_MESSAGES: {
            ERROR: {
                GET_ALL_WINDOWS_ERROR: "getAllOpenWindows - Error getting all windows data:",
                CLOSE_TABS_ERROR: "closeTabsByTabId - Error closing tabs:",
                CREATE_WINDOW_ERROR: "createNewWindowWithURLs - Error creating windows:",
                OPEN_TABS_ERROR: "openTabsInOpenedWindowByID - Error opening tabs:",
                GET_CURRENT_WINDOW_ERROR: "getCurrentOpenWindow - Error opening tabs:",
                UPDATE_OPEN_WINDOW_ERROR: "updateOpenWindow - Error updating window:",
                UPDATE_OPEN_TAB_ERROR: "updateOpenTab - Error updating tab:"
            }
        }
    },
    CHROME_MEMORY_SERVICE: {
        LOGGING_MESSAGES: {
            ERROR: {
                GET_SYSTEM_MEMORY_ERROR: "getSystemMemoryInfo - Error getting system memory data:"
            }
        }
    },
    SYSTEM_MEMORY_CLASS: {
        LOGGING_MESSAGES: {
            FILE_NAME: "SystemMemory.js"
        }
    }
}