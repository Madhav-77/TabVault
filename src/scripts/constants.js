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
            OPEN_WINDOWS_TAB: "open-windows-tab",
            CLASS_OPEN_TAB_BUTTONS: ".open-tab-buttons",
            CLASS_OPEN_TABLE: ".open-windows-table ", // open windows tab div, space at end should not be removed
            ARCHIVE_WINDOWS_TAB: "archive-windows-tab",
            CLASS_ARCHIVE_TAB_BUTTONS: ".archive-tab-buttons",
            CLASS_ARCHIVE_TABLE: ".archive-windows-table ", // archive windows tab div, space at end should not be removed
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
            CHECKBOX_DISABLE_WINDOW_NAME_EDIT: "Close or Save window name"
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
    }
}