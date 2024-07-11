export const ARCHIVE_LIST_NAME = "archive";
export const ARCHIVE_WINDOW_LOOKUP_NAME = "windows_name_lookup";
export const ARCHIVE_INIT_VALUE = {
    archive: [],
    windows_name_lookup: {}
};
export const FILE_CONSTANTS = {
    DASHBOARD_CLASS: {
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
            FILE_NAME: "dashboard.js"
        },
        TITLE_MESSAGES: {
            ALREADY_ARCHIVED: "Already archived",
            CHECKBOX_DISABLE_WINDOW_NAME_EDIT: "Close or Save window name"
        }
    },
    ARCHIVE_CLASS: {
        LOGGING_MESSAGES: {
            FILE_NAME: "Archive.js"
        },
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