import { Browser } from './Browser.js';
import { FILE_CONSTANTS, ARCHIVE_LIST_NAME, ARCHIVE_WINDOW_LOOKUP_NAME } from './constants.js';
import { errorLogMessageFormatter, showLoader, hideLoader } from './sharedUtility.js';
import { SystemMemory } from './SystemMemory.js';

export class Dashboard {
    constructor(archive) {
        if (Dashboard.instance instanceof Dashboard) {
            return Dashboard.instance
        }
        this.browser = new Browser();
        this.systemMemory = new SystemMemory();

        this.tabsList = { open: true, archive: false };
        this.archive = archive;
        this.currentOpenWindowsList = null; // current open windows list
        this.currentSelectionOpenTab = []; // maintains a separate list for current selections in Open Tab
        this.currentSelectionArchiveTab = []; // maintains a separate list for current selections in Archive Tab
        this.archiveList = this.archive.archiveData[ARCHIVE_LIST_NAME];
        this.windowsNameLookup = this.archive.archiveData[ARCHIVE_WINDOW_LOOKUP_NAME];
        
        // constants
        this.selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
        this.checkboxSelectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS.CHECKBOXES;
        this.titleMessages = FILE_CONSTANTS.DASHBOARD_CLASS.TITLE_MESSAGES;
        this.popupMessages = FILE_CONSTANTS.DASHBOARD_CLASS.POPUP_MESSAGES;
        this.loggingMessages = FILE_CONSTANTS.DASHBOARD_CLASS.LOGGING_MESSAGES;

        this.memoryStatsIntervalId = "";
        this.windowBehindExtension = "";
        this.deleteArchiveTrigger = "";
    }

    async initialize() {
        this.getMemoryStatsAndDisplay();
        showLoader(".spinner-div");
        this.currentOpenWindowsList = await this.getCurrentOpenWindows();
        this.addEventListeners();
        this.initializeTable(this.selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindowsList);
        this.setWindowCount();
    }

    /**
     * Adds event listeners to all required elements
     */
    addEventListeners() {
        try {
            document.querySelectorAll('#window-nav-tabs span[data-bs-toggle="tab"]').forEach(bootstrapTab => { bootstrapTab.addEventListener("click", (ele) => { this.tabSwitch(ele) }) });
            document.getElementById("archiveAndClose").addEventListener("click", () => { this.archiveAndClose() });
            document.getElementById("archiveAndClose").setAttribute('title', this.titleMessages.ARCHIVE_AND_CLOSE);
            document.getElementById("closeSelectedWindows").addEventListener("click", () => { this.closeSelectedTabs() });
            document.getElementById("closeSelectedWindows").setAttribute('title', this.titleMessages.CLOSE_WINDOWS);
            document.getElementById("openFromArchive").addEventListener("click", () => { this.openSelectedWindows() });
            document.getElementById("openFromArchive").setAttribute('title', this.titleMessages.OPEN_WINDOWS);
            document.getElementById("deleteFromArchive").addEventListener("click", () => { this.deleteFromArchive() });
            document.getElementById("deleteFromArchive").setAttribute('title', this.titleMessages.DELETE_FROM_ARCHIVE);
            this.deleteArchiveTrigger = document.querySelector(".open-windows-table .deleteAllArchive");
            this.deleteArchiveTrigger.addEventListener("click", () => { this.clearAllArchiveData(); });
            this.deleteArchiveTrigger.setAttribute("title", this.titleMessages.DELETE_ALL_ARCHIVE);
            if(this.archiveList.length) {
                this.deleteArchiveTrigger.classList.remove("d-none");
            } else {
                this.deleteArchiveTrigger.classList.add("d-none");
            }
            // document.getElementById("getArchiveList").addEventListener("click", () => { console.log(this.getArchivedData()) });
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'addEventListeners'), error);
            throw error;
        }
    }

    /**
     * Handles tab switch event
     * Show/Hide buttons
     * Gets required data
     * @param {Object} ele - Pass current element object
     */
    async tabSwitch(ele) {
        try {
            const currentTabId = ele.target.getAttribute("id");
            document.querySelectorAll(".select-all-window-checkbox").forEach(ele => ele.checked = false);
            this.setWindowCount();
            if (currentTabId == this.selectorConstants.OPEN_WINDOWS_TAB) {
                this.currentOpenWindowsList = await this.getCurrentOpenWindows();
                this.tabsList.open = true;
                this.tabsList.archive = false;
                document.querySelector(this.selectorConstants.CLASS_ARCHIVE_TAB_BUTTONS).classList.add("d-none");
                document.querySelector(this.selectorConstants.CLASS_OPEN_TAB_BUTTONS).classList.remove("d-none");
                this.initializeTable(this.selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindowsList);
            }
            if (currentTabId == this.selectorConstants.ARCHIVE_WINDOWS_TAB) {
                this.archiveList = this.archive.archiveData[ARCHIVE_LIST_NAME]
                this.tabsList.open = false;
                this.tabsList.archive = true;
                document.querySelector(this.selectorConstants.CLASS_OPEN_TAB_BUTTONS).classList.add("d-none");
                document.querySelector(this.selectorConstants.CLASS_ARCHIVE_TAB_BUTTONS).classList.remove("d-none");
                this.initializeTable(this.selectorConstants.CLASS_ARCHIVE_TABLE, this.archiveList);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'tabSwitch'), error);
            throw error;
        }
    }

    setWindowCount() {
        document.querySelector(".openWindowsCount").innerHTML = "(" + this.currentOpenWindowsList.length + ")";
        document.querySelector(".archiveWindowsCount").innerHTML = "(" + this.archiveList.length + ")";
    }

    async getCurrentOpenWindows() {
        try {
            this.windowBehindExtension = await this.browser.getCurrentOpenWindow();
            return this.browser.getAllOpenWindows();
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getCurrentOpenWindows'), error);
            throw error;
        }
    }

    /**
     * Copies data from Existing Object to Target object
     * Creates new Window object
     * Pushes tabs to existing Window
     * @param {Array} data - any archive list that needs to be updated 
     * @param {Array} existingData - Data to check if window alread exists
     * @param {Object} tab - selected tab object
     * @param {String} windowId
     * @param {String} tabId
     */
    copyTabsInNewList(data, existingData, tab, windowId, tabId) {
        try {
            const windowCurrentObj = this.getWindowDetailsFromList(existingData, windowId);
            const windowObj = this.getWindowDetailsFromList(data, windowId);
            const tabCurrentObj = windowCurrentObj.tabs.find(tab => tab.tabId == tabId);
            const tabObject = {
                tabId: parseInt(tabId),
                title: tabCurrentObj.title,
                url: tabCurrentObj.url
            }

            // Push if window exists in list
            if (windowObj) {
                windowObj.tabs.push(tabObject);
            } else {
                const windowName = tab.getAttribute("data-window-name");
                data.push({
                    windowId: parseInt(windowId),
                    newWindowId: windowCurrentObj.newWindowId || "",
                    windowName: windowName,
                    tabs: [tabObject]
                });
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'copyTabsInNewList'), error);
            throw error;
        }
    }

    /**
     * Removes copied data from Target Object
     * @param {Array} data - any archive list that needs to be updated 
     * @param {String} windowId
     * @param {String} tabId
     */
    removeTabsFromList(data, windowId, tabId) {
        try {
            const windowObj = this.getWindowDetailsFromList(data, windowId);
            if (windowObj) {
                let tabIndex = windowObj.tabs.findIndex(tab => tab.tabId === tabId);
                if (tabIndex > -1) {
                    windowObj.tabs.splice(tabIndex, 1);
                }

                // To remove window object when all child tabs are unchecked
                if (!windowObj.tabs.length) {
                    const windowIndex = data?.findIndex(window => window.windowId == windowId);
                    data?.splice(windowIndex, 1);
                }
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'removeTabsFromList'), error);
            throw error;
        }
    }

    getWindowDetailsFromList(data, windowId) {
        try {
            return data?.find(window => window.windowId == windowId);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getWindowDetailsFromList'), error);
            throw error;
        }
    }

    /**
     * Checks if data is present in archive
     * @param {Array} data - archived window list 
     * @param {String} type - 'window' || 'tab'
     * @param {Object} currWindowObj - current window object
     * @param {String} tabId Optional, only required when type = 'tab'
     * @returns {Boolean}
     */
    checkIfObjectExistInList(data, type, currWindowObj, tabId = "") {
        try {
            const windowId = currWindowObj.windowId;
            const archiveWindowObj = this.getWindowDetailsFromList(data, windowId);
            if (archiveWindowObj) {
                if (type == "window") { 
                    return currWindowObj.tabs.every(w1 => archiveWindowObj.tabs.some(w2 => w1.tabId == w2.tabId)); // returns true if all tabs from current window is archived
                }
                if (type == "tab") {
                    return archiveWindowObj?.tabs.some(tab => tab.tabId == tabId); // returns true if tabId is found in archive
                }
            }
            return false;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'checkIfObjectExistInList'), error);
            throw error;
        }
    }

    /**
     * To select the parent window row
     * if any child tab row is selected
     * @param {String} parentTable - parent table query selector
     * @param {String} windowId 
     */
    windowCheckboxOnTabSelection(parentTable, windowId) {
        try {
            const checkedTabs = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.TAB_CHECKED_ENABLED + '[data-window-id="' + windowId + '"]').length;
            const parentWindowRow = document.querySelector(parentTable + this.checkboxSelectorConstants.WINDOW + '[data-window-id="' + windowId + '"]');
            if (checkedTabs > 0) {
                parentWindowRow.checked = true;
            } else {
                parentWindowRow.checked = false;
            }
            this.allWindowCheckboxOnWindowSelection(parentTable);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'windowCheckboxOnTabSelection'), error);
            throw error;
        }
    }

    /**
     * To select the top most parent all window row
     * if all child window rows and all tabs are selected
     * @param {String} parentTable - parent table query selector
     */
    allWindowCheckboxOnWindowSelection(parentTable) {
        try {
            const totalWindows = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.WINDOW_ENABLED).length;
            const checkedWindows = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.WINDOW_CHECKED_ENABLED).length;
            const parentSelectAllWindowRow = document.querySelector(parentTable + this.checkboxSelectorConstants.ALL_WINDOW);
            const uncheckedTabsCount = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.TAB_NOT_CHECKED_ENABLED).length; // Making sure that all tabs are selected before checking SelectAllWindow checkbox 
            if (totalWindows == checkedWindows && uncheckedTabsCount == 0) {
                parentSelectAllWindowRow.checked = true;
            } else {
                parentSelectAllWindowRow.checked = false;
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'allWindowCheckboxOnWindowSelection'), error);
            throw error;
        }
    }

    /**
     * Adds change event listeners to Tab Checkboxes
     * @param {String} parentTable - parent table query selector
     */
    initializeTabCheckBoxes(parentTable) {
        try {
            document.querySelectorAll(parentTable + this.checkboxSelectorConstants.TAB_ENABLED).forEach(tab => {
                tab.addEventListener('change', (ele) => {
                    const windowId = parseInt(ele.target.getAttribute("data-window-id"))
                    const tabId = parseInt(ele.target.getAttribute("data-tab-id"))
                    if (this.tabsList.open) { // check for only open windows tab
                        if (ele.target.checked) {
                            // this.copyTabsInNewList(this.archiveList, this.currentOpenWindowsList, ele.target, windowId, tabId);
                            this.copyTabsInNewList(this.currentSelectionOpenTab, this.currentOpenWindowsList, ele.target, windowId, tabId);
                        } else {
                            // this.removeTabsFromList(this.archiveList, windowId, tabId);
                            this.removeTabsFromList(this.currentSelectionOpenTab, windowId, tabId);
                        }
                    } else {
                        if (ele.target.checked) {
                            this.copyTabsInNewList(this.currentSelectionArchiveTab, this.archiveList, ele.target, windowId, tabId);
                        } else {
                            this.removeTabsFromList(this.currentSelectionArchiveTab, windowId, tabId);
                        }
                    }
                    this.windowCheckboxOnTabSelection(parentTable, windowId, tabId);
                });
            });
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'initializeTabCheckBoxes'), error);
            throw error;
        }
    }

    /**
     * Adds change event listeners to Window Checkboxes
     * @param {String} parentTable - parent table query selector
     */
    initializeWindowCheckBoxes(parentTable) {
        try {
            const windowSelectCheckbox = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.WINDOW_ENABLED);
            windowSelectCheckbox.forEach(window => {
                window.addEventListener('change', (ele) => {
                    const windowId = parseInt(ele.target.getAttribute(this.selectorConstants.DATA_WINDOW_ID));
                    const isChecked = ele.target.checked;
                    const allTabsCheckboxes = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.TAB_ENABLED + "[data-window-id='" + windowId + "']");
                    allTabsCheckboxes.forEach(tab => {
                        const tabId = parseInt(tab.getAttribute(this.selectorConstants.DATA_TAB_ID));
                        tab.checked = isChecked;
                        if (this.tabsList.open) { // check for only open windows tab
                            if (isChecked) {
                                // this.copyTabsInNewList(this.archiveList, this.currentOpenWindowsList, tab, windowId, tabId);
                                this.copyTabsInNewList(this.currentSelectionOpenTab, this.currentOpenWindowsList, tab, windowId, tabId);
                            } else {
                                // this.removeTabsFromList(this.archiveList, windowId, tabId);
                                this.removeTabsFromList(this.currentSelectionOpenTab, windowId, tabId);
                            }
                        } else {
                            if (isChecked) {
                                this.copyTabsInNewList(this.currentSelectionArchiveTab, this.archiveList, tab, windowId, tabId);
                            } else {
                                this.removeTabsFromList(this.currentSelectionArchiveTab, windowId, tabId);
                            }
                        }
                    });
                    this.allWindowCheckboxOnWindowSelection(parentTable);
                });
            });
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'initializeWindowCheckBoxes'), error);
            throw error;
        }
    }

    /**
     * Adds change event listener to Select All Window Checkbox
     * @param {String} parentTable - parent table query selector
     */
    initializeSelectAllWindowCheckBoxes(parentTable) {
        try {
            const windowSelectAllCheckbox = document.querySelector(parentTable + this.checkboxSelectorConstants.ALL_WINDOW);
            windowSelectAllCheckbox.addEventListener('change', (ele) => {
                const isChecked = ele.target.checked;
                const allWindowsCheckboxes = document.querySelectorAll(parentTable + this.checkboxSelectorConstants.WINDOW_ENABLED);
                allWindowsCheckboxes.forEach(windowCheckbox => {
                    if (windowCheckbox.checked != isChecked) {
                        windowCheckbox.click();
                    }
                });
            });
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'initializeSelectAllWindowCheckBoxes'), error);
            throw error;
        }
    }

    /**
     * enables editing, stores, discards based on action variable
     * @param {String} action - 'edit' | 'save' | 'close'
     */
    windowNameInputAction(action, currElement) {
        try {
            const windowId = currElement.getAttribute(this.selectorConstants.DATA_WINDOW_ID);
            let windowRow = '';
            if (currElement.classList.contains("open")) {
                windowRow = document.querySelector(".open-windows-table .window-row[data-window-id='" + windowId + "']");
            } else {
                windowRow = document.querySelector(".archive-windows-table .window-row[data-window-id='" + windowId + "']");
            }
            const handleClickOutsideWindowRow = (event) => { // discards row editing/input field if clicked outside of table row 
                if (!windowRow.contains(event.target)) {
                    const initialValue = windowRow.querySelector(".window-name-input").getAttribute("data-initial-value");
                    this.showHideWindowNameEditFields(windowRow, false);
                    windowRow.querySelector(".window-name-input").value = initialValue;
                    document.removeEventListener('click', handleClickOutsideWindowRow);
                }
            }
    
            if (action == "edit") {
                this.showHideWindowNameEditFields(windowRow, true);
                document.addEventListener('click', handleClickOutsideWindowRow);
            } else { // incase of 'save' || 'close'
                let windowName = currElement.closest(".save-section").querySelector("input.window-name-input").value;
                if (action == "close" || windowName == "") { // setting input value to initial value if user tried to save the blank field or in case of 'close' 
                    const initialValue = windowRow.querySelector(".window-name-input").getAttribute("data-initial-value");
                    windowRow.querySelector(".window-name-input").value = initialValue;
                } else {
                    this.windowsNameLookup[windowId] = windowName;
                    if (this.archiveList.find(obj => obj.windowId == windowId)) {
                        this.archiveList.find(obj => obj.windowId == windowId).windowName = windowName;
                    }
                    this.updateArchive(this.archiveList);
                    if(this.tabsList.open) {
                        this.initializeTable(this.selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindowsList);
                    } else {
                        this.initializeTable(this.selectorConstants.CLASS_ARCHIVE_TABLE, this.archiveList);
                    }
                }
                this.showHideWindowNameEditFields(windowRow, false);
                document.removeEventListener('click', handleClickOutsideWindowRow);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'windowNameInputAction'), error);
            throw error;
        }
    }

    /**
     * toggles between edit and save layout for window name editing
     * @param {Object} windowRow
     * @param {Boolean} isEditable
     */
    showHideWindowNameEditFields(windowRow, isEditable) {
        try {
            const allSelectCheckbox = document.querySelectorAll("input[type='checkbox']");
            const rowExpandTrigger = windowRow.querySelector(".window-expand-row-trigger-col svg");
            const editButton = windowRow.querySelector(".window-name-col .edit-section");
            const saveButton = windowRow.querySelector(".window-name-col .save-section");
            if (isEditable) {
                // to reset row selection while editing window name
                allSelectCheckbox.forEach(ele => {
                    if(ele.checked){
                        ele.click();
                    }
                    ele.setAttribute("disabled", true);
                    ele.setAttribute("title", this.titleMessages.CHECKBOX_DISABLE_WINDOW_NAME_EDIT);
                });
                rowExpandTrigger.classList.add("d-none");
                editButton.classList.add("d-none");
                saveButton.classList.remove("d-none");
            } else {
                allSelectCheckbox.forEach(ele => { 
                    ele.removeAttribute("disabled"); 
                    ele.removeAttribute("title");
                });
                rowExpandTrigger.classList.remove("d-none");
                editButton.classList.remove("d-none");
                saveButton.classList.add("d-none");
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'showHideWindowNameEditFields'), error);
            throw error;
        }
    }

    /**
     * Calls required init functions for a tab archive/open
     * @param {String} parentTable - parent table query selector
     * @param {Array} data - List of Archived/Current windows
     */
    async initializeTable(parentTable, data) {
        this.populateTableData(parentTable, data);
        this.initializeSelectAllWindowCheckBoxes(parentTable);
        this.initializeWindowCheckBoxes(parentTable);
        this.initializeTabCheckBoxes(parentTable);
        this.initializeSVGEventListeners();
    }

    /**
     * Sets event listeners for window name editing action buttons
     */
    initializeSVGEventListeners() {
        try {
            document.querySelectorAll(".edit-window-name-button").forEach(ele => {
                ele.addEventListener("click", (element) => { this.windowNameInputAction("edit", element.target.closest(".edit-window-name-button")) });
            });
            document.querySelectorAll(".save-window-name-button").forEach(ele => {
                ele.addEventListener("click", (element) => { this.windowNameInputAction("save", element.target.closest(".save-window-name-button")) });
            });
            document.querySelectorAll(".close-window-name-edit-button").forEach(ele => {
                ele.addEventListener("click", (element) => { this.windowNameInputAction("close", element.target.closest(".close-window-name-edit-button")) });
            });
            document.querySelectorAll(this.selectorConstants.CLASS_OPEN_TABLE + ".tab-redirect-col").forEach(ele => {
                ele.querySelector("span").addEventListener("click", (element) => { this.maximizeSpecificWindowTab(ele.getAttribute("data-window-id"), ele.getAttribute("data-tab-id")) });
            });
            if(this.archiveList.length) {
                this.deleteArchiveTrigger.classList.remove("d-none");
            } else {
                this.deleteArchiveTrigger.classList.add("d-none");
            }
            hideLoader(".spinner-div");
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'initializeSVGEventListeners'), error);
            throw error;
        }
    }

    /**
     * Gets windows name from lookup,
     * If not found, returns windowName
     * @param {String} windowId
     * @param {String} windowName
     * @returns {String}
     */
    getWindowsNameFromLookup(windowId) {
        try {
            if (this.windowsNameLookup && this.windowsNameLookup.hasOwnProperty(windowId)) {
                return this.windowsNameLookup[windowId];
            }
            return false;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getWindowsNameFromLookup'), error);
            throw error;
        }
    }

    /**
     * Generates HTML table with provided data for Archive/Open tabs
     * @param {String} parentTable - parent table query selector
     * @param {Array} tableData - archiveList/currentOpenWindowsList
     */
    populateTableData(parentTable, tableData) {
        try {
            const parent = parentTable == this.selectorConstants.CLASS_OPEN_TABLE ? "open" : "archive";
            let tableBody = "";
            let allWindowsExistsInArchive = true;
            let windowNameCount = 1;
            if(this.tabsList.archive & !tableData.length) {
                document.querySelector(parentTable + "tbody").classList.add("d-flex");
                tableBody += `
                    <tr class="archiveTabNoDataRow">
                        <td colspan="5">
                            ${FILE_CONSTANTS.DASHBOARD_CLASS.NO_DATA_AVAILABLE}
                        </td>
                    </tr>`
            } else {
                document.querySelector(parentTable + "tbody").classList.remove("d-flex");
                for (let i = 0; i < tableData.length; i++) {
                    let windowExistsInArchive = false;
                    if (this.tabsList.open) { // check for only open windows tab
                        windowExistsInArchive = this.checkIfObjectExistInList(this.archiveList, "window", tableData[i])
                        if (!windowExistsInArchive) {
                            allWindowsExistsInArchive = false;
                        }
                    }
                    let windowName = this.getWindowsNameFromLookup(tableData[i].windowId, `Window ${windowNameCount}`);
                    if(!windowName) {
                        windowName = `Window ${windowNameCount}`;
                        windowNameCount += 1;
                    }
    
                    tableBody += `
                        <tr class="window-row ${tableData[i].focused || tableData[i].windowId == this.windowBehindExtension.id ? 'focused' : ''}" aria-expanded="false" data-window-id=${tableData[i].windowId}>
                            <th class="window-action-col" scope="row">
                                <input class="select-window-checkbox ${windowExistsInArchive ? 'cursor-not-allowed' : ''}" data-type="window" data-window-id=${tableData[i].windowId} ${windowExistsInArchive ? 'disabled title="' + this.titleMessages.ALREADY_ARCHIVED + '"' : ''} type="checkbox">
                            </th>
                            <td class="window-index-col">${i + 1}</td>
                            <td class="window-name-col">
                                
                                ${windowExistsInArchive ? `<span>${windowName} ${tableData[i].focused ? '<span class="focused-window-text">(Active window)</span>' : ''}</span>` : `
                                    <span class="edit-section">
                                        <span>${windowName} ${tableData[i].focused ? '<span class="focused-window-text">(Active window)</span>' : ''}</span>
                                        <span class="edit-window-name-button float-right cursor-pointer ${parent}" data-window-id=${tableData[i].windowId}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path></svg>
                                        </span>
                                    </span>
                                    <span class="save-section d-none">
                                        <input class="form-control window-name-input form-control-sm float-left" value="${windowName}" data-initial-value="${windowName}" type="text">
                                        <span class="save-window-name-button float-right cursor-pointer ${parent}" data-window-id=${tableData[i].windowId}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>
                                        </span>
                                        <span class="close-window-name-edit-button float-right cursor-pointer ${parent}" data-window-id=${tableData[i].windowId}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>
                                        </span>
                                    </span>
                                `}
                            </td>
                            <td class="window-tab-count-col text-center">${tableData[i].tabs.length}</td>
                            <td class="window-expand-row-trigger-col text-center toggle-btn cursor-pointer" data-target="#${parent}-tab-details-${tableData[i].windowId}">
                                <span class="down-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                                    </svg>
                                </span>
                                <span class="up-arrow d-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M3.22 10.53a.749.749 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.06 0l4.25 4.25a.749.749 0 1 1-1.06 1.06L8 6.811 4.28 10.53a.749.749 0 0 1-1.06 0Z"></path>
                                    </svg>
                                </span>
                            </td>
                        </tr>
                        <tr id="${parent}-tab-details-${tableData[i].windowId}" class="collapse">
                            <td colspan="5">
                                <div class="p-2">
                                    <table class="table table-hover m-0 open-tabs-table">
                                        <thead class="fonts-color-bg">
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                ${ this.tabsList.open ? `<th scope="col"></th>` : `` }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${tableData[i].tabs.map((tab, j) => {
                                                let tabExistsInArchive = false;
                                                if(this.tabsList.open){ // check for only open windows tab
                                                    tabExistsInArchive = this.checkIfObjectExistInList(this.archiveList, "tab", tableData[i], tab.tabId);
                                                }
                                                return `<tr class="tab-row ${tab.active ? 'active' : ''}" data-tab-id=${tab.tabId}>
                                                    <th class="tab-action-col" scope="row">
                                                        <input class="select-tab-checkbox ${tabExistsInArchive ? 'cursor-not-allowed' : ''}" data-window-id=${tableData[i].windowId} data-window-name="${windowName}" data-type="tab" data-tab-id=${tab.tabId} ${tabExistsInArchive ? 'disabled title=' + this.titleMessages.ALREADY_ARCHIVED + '"' : ''} type="checkbox">
                                                    </th>
                                                    <td class="tab-index-col">${j + 1}</td>
                                                    <td class="tab-title-col">
                                                        ${tab.title}
                                                        ${tab.active ? '<span class="focused-tab-text">(Active tab)</span>' : ''}
                                                    </td>
                                                    ${ this.tabsList.open ? 
                                                     `<td class="tab-redirect-col" data-window-id=${tableData[i].windowId} data-tab-id=${tab.tabId}>
                                                        <span class="cursor-pointer" title="${this.titleMessages.GO_TO_TAB}">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
                                                                <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path>
                                                            </svg>
                                                        </span>
                                                    </td>` : `` }
                                                </tr>
                                            `}).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>`;
                }
                // Enables/Disables Select all windows checkbox based on windows/tabs selection
                if (allWindowsExistsInArchive && this.tabsList.open) { // check for only open windows tab
                    this.disableAllWindowCheckbox(parentTable);
                }
            }
            document.querySelector(parentTable + "tbody").innerHTML = tableBody;
            this.accordianBehaviorForTable();   
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'populateTableData'), error);
            throw error;
        }
    }

    /**
     * Takes user to specific tab which is opened but minimized
     * @param {String} windowId
     * @param {String} tabId
     */
    maximizeSpecificWindowTab(windowId, tabId) {
        this.browser.openSelectedWindowTab(windowId, tabId);
    }

    /**
     * Disables all window checkbox if all open windows & tabs are present in archive
     * @param {String} parentTable - parent table query selector
     */
    disableAllWindowCheckbox(parentTable) {
        try {
            const windowSelectAllCheckbox = document.querySelector(parentTable + this.selectorConstants.CHECKBOXES.ALL_WINDOW);
            windowSelectAllCheckbox.checked = false
            windowSelectAllCheckbox.classList.add("cursor-not-allowed")
            windowSelectAllCheckbox.setAttribute("disabled", true)
            windowSelectAllCheckbox.setAttribute("title", this.titleMessages.ALREADY_ARCHIVED)
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'disableAllWindowCheckbox'), error);
            throw error;
        }
    }

    /**
     * Clears all archive data and redirects to Home Page
     */
    async clearAllArchiveData() {
        try {
            const userConfirmed = confirm(this.popupMessages.DELETE_ALL_ARCHIVE);
            if(userConfirmed) {
                await this.archive.clearAllData();
                this.clearMyInterval();
                navigateTo('home', this.archive);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'clearAllArchiveData'), error);
            throw error;
        }
    }

    /**
     * updates archive data object
     * calls chrome storage store API to store new archive data object 
     * refreshes the tables archive/open
     * @param {Array} data - data to update in archive
     */
    async updateArchive(data) {
        try {
            showLoader(".spinner-div");
            this.cleanWindowsLookup();
            const archiveFormattedData = {
                archive: data,
                windows_name_lookup: this.windowsNameLookup
            }
            const result = await this.archive.storeDataInStorage(archiveFormattedData);
            if(result.success) {
                this.archiveList = this.archive.archiveData[ARCHIVE_LIST_NAME];
                this.archiveLookupName = this.archive.archiveData[ARCHIVE_WINDOW_LOOKUP_NAME];
                hideLoader(".spinner-div");
            } else {
                alert(result.message);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'updateArchive'), error);
            throw error;
        }
    }

    /**
     * Merges archive list and current selection list
     * @param {Array} archiveList
     * @param {Array} currentSelection
     * @returns {Array} updatedData - merged list
     */
    mergeArchiveListWithSelection(archiveList, currentSelection) {
        try {
            let updatedData = [];
            archiveList.forEach(a_window => {
                let windowFromCurrSelection = currentSelection.find(c_window => c_window.windowId == a_window.windowId);
                let tabsList = []
                if(windowFromCurrSelection){
                    windowFromCurrSelection.tabs.forEach(tab => {
                        tabsList.push(tab);
                    });
                }
                a_window.tabs.forEach(tab => {
                    tabsList.push(tab);
                });
                updatedData.push({
                        windowId: parseInt(a_window.windowId),
                        newWindowId: a_window.newWindowId || "",
                        windowName: windowFromCurrSelection?.windowName || a_window.windowName,
                        tabs: tabsList
                    })
            })
            updatedData.push(...currentSelection.filter(c_window => !archiveList.map(a_window => a_window.windowId).includes(c_window.windowId)))
            return updatedData;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'mergeArchiveListWithSelection'), error);
            throw error;
        }
    }

    /**
     * formats data for archiving and closing windows
     */
    async archiveAndClose() {
        try {
            if(this.currentSelectionOpenTab.length) {
                const userConfirmed = confirm(this.popupMessages.ARCHIVE_CLOSE_WINDOWS);
                if(userConfirmed) {
                    const archiveData = this.mergeArchiveListWithSelection(this.archiveList, this.currentSelectionOpenTab);
                    await this.updateArchive(archiveData);
                    await this.closeSelectedTabs(true);
                    this.currentSelectionOpenTab = [];
                    // If all tabs are selected and closed
                    // Setting timeout for Chrome window to get closed
                    setTimeout(async () => {
                        this.currentOpenWindowsList = await this.getCurrentOpenWindows();
                        this.resetAllWindowCheckbox(this.selectorConstants.CLASS_OPEN_TABLE);
                        this.initializeTable(this.selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindowsList);
                        this.setWindowCount();
                    }, 200);
                }
            } else {
                alert(this.popupMessages.NO_SELECTION)
            }
        } catch(error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, "archiveAndClose"), error)
            throw error;
        }
    }

    /**
     * deletes all closed windows from windows name lookup
     */
    cleanWindowsLookup() {
        try {
            const currentOpenWindowsList = this.currentOpenWindowsList.map(obj => obj.windowId);
            const archiveWindowsList = this.archiveList.map(obj => obj.windowId);
            const allWindows = currentOpenWindowsList.concat(archiveWindowsList);
            const allLookUpKeys = Object.keys(this.windowsNameLookup).map(key => parseInt(key));;
            allLookUpKeys.forEach(window => {
                if(!allWindows.includes(window)) {
                    delete this.windowsNameLookup[window]
                }
            })
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'cleanWindowsLookup'), error);
            throw error;
        }
    }

    /**
     * returns archive data from chrome storage
     * @returns {Object}
     */
    getArchivedData() {
        try {
            return this.archive.archiveData;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'getArchivedData'), error);
            throw error;
        }        
    }

    /**
     * Closes selected tabs
     * @param {Boolean} isFromArchiveAndClose - flag to check if call is from archiveAndClose methods
     */
    async closeSelectedTabs(isFromArchiveAndClose = false) {
        try {
            if(this.currentSelectionOpenTab.length) {
                const userConfirmed = !isFromArchiveAndClose ? confirm(this.popupMessages.CLOSE_WINDOWS) : true; // no need to get confirmation if call is from archiveAndClose method
                if(userConfirmed) {
                    const tabIds = this.currentSelectionOpenTab.flatMap(window => window.tabs.map(tab => parseInt(tab.tabId)));
                    if(tabIds) {
                        this.browser.closeSelectedTabs(tabIds)
                        // If all tabs are selected and closed
                        // Setting timeout for Chrome window to get closed
                        if(!isFromArchiveAndClose) {
                            setTimeout(async () => {
                                this.currentOpenWindowsList = await this.getCurrentOpenWindows();
                                this.resetAllWindowCheckbox(this.selectorConstants.CLASS_OPEN_TABLE);
                                this.initializeTable(this.selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindowsList);
                            }, 100);
                        }
                    }
                }
            } else {
                alert(this.popupMessages.NO_SELECTION)
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'closeSelectedTabs'), error);
            throw error;
        }
    }

    /**
     * open selected windows
     */
    async openSelectedWindows() {
        try {
            for (let i = 0; i < this.currentSelectionArchiveTab.length; i++) {
                const newWindowId = this.currentSelectionArchiveTab[i].newWindowId;
                const isWindowOpen = this.checkIfWindowOpen(newWindowId);
                const tabUrls = this.currentSelectionArchiveTab[i].tabs.map(tab => tab.url);
                if(newWindowId && isWindowOpen) {
                    tabUrls.forEach(async url => {
                        await this.browser.openTabsInExistingWindow(newWindowId, url);
                    })
                } else {
                    const newWindow = await this.browser.createNewWindow(tabUrls);
                    this.currentSelectionArchiveTab[i].newWindowId = parseInt(newWindow.id);
                    this.updateNewWindowIdInArchiveList(this.currentSelectionArchiveTab[i]);
                }
            }
            this.deleteFromArchive(true);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'openSelectedWindows'), error);
            throw error;
        }
    }

    /**
     * Checks if a window is open
     * @param {String} windowId
     * @returns {Boolean}
     */
    async checkIfWindowOpen(windowId) {
        try {
            this.currentOpenWindowsList = await this.getCurrentOpenWindows()
            return this.currentOpenWindowsList.some(obj => obj.windowId == windowId);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'checkIfWindowOpen'), error);
            throw error;
        }
    }

    /**
     * Sets new window id in archive list to maintain the window name between current open windows and archived windows
     * @param {Object} window
     */
    updateNewWindowIdInArchiveList(window) {
        try {
            this.archiveList.find(obj => obj.windowId == window.windowId).newWindowId = window.newWindowId;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'updateNewWindowIdInArchiveList'), error);
            throw error;
        }
    }

    /**
     * handles select all window checkbox state, as only <tbody> data will get refreshed
     * @param {String} parentTable - parent table query selector
     */
    resetAllWindowCheckbox(parentTable) {
        try {
            document.querySelector(parentTable + this.selectorConstants.CHECKBOXES.ALL_WINDOW).checked = false;
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'resetAllWindowCheckbox'), error);
            throw error;
        }
    }

    /**
     * Deletes data from archive
     */
    deleteFromArchive(isCallFromOpenSelected = false) {
        try {
            if(this.currentSelectionArchiveTab.length){
                const userConfirmed = !isCallFromOpenSelected ? confirm(this.popupMessages.DELETE_ARCHIVE) : true;
                if(userConfirmed) {
                    this.currentSelectionArchiveTab.forEach(window => {
                        window.tabs.forEach(tab => {
                            this.removeTabsFromList(this.archiveList, window.windowId, tab.tabId)
                        })
                    });
                    this.currentSelectionArchiveTab = []; // reset archiveTabList after action taken on all selected items from Archive tab
                    this.resetAllWindowCheckbox(this.selectorConstants.CLASS_ARCHIVE_TABLE);
                    this.updateArchive(this.archiveList);
                    this.initializeTable(this.selectorConstants.CLASS_ARCHIVE_TABLE, this.archiveList);
                }
            } else {
                alert(this.popupMessages.NO_SELECTION);
            }
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'deleteFromArchive'), error);
            throw error;
        }
    }

    /**
     * Closes selected windows
     */
    closeSelectedWindows(windowId) {
        try {
            chrome.windows.remove(windowId);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'closeSelectedWindows'), error);
            throw error;
        }
    }

    /**
     * Gets System RAM details (Available memory, Total memory, Used memory)
     * Displays the data
     * Keeps on running 5 times/sec
     */
    async getMemoryStatsAndDisplay() {
        try {
            this.memoryStatsIntervalId = setInterval(async () => {
                const memoryStats = await this.systemMemory.getSystemMemoryInfo();
                document.getElementById("usedMemory").innerText = memoryStats.usedMemory;
                document.getElementById("availableMemory").innerText = memoryStats.availableMemory;
                document.getElementById("totalMemory").innerText = memoryStats.totalMemory;
            }, 200);
        } catch (error) {
            // console.error(errorLogMessageFormatter(this.loggingMessages.FILE_NAME, 'this.getMemoryStatsAndDisplay'), error);
            throw error;
        }
    }

    /**
     * Clears set interval by getMemoryStatsAndDisplay()
     */
    clearMyInterval() {
        if(this.memoryStatsIntervalId){
            clearInterval(this.memoryStatsIntervalId);
        }
    }

    /**
     * Initializes bootstrap accordian
     */
    accordianBehaviorForTable() {
        // Function to handle toggle behavior and accordion effect
        function toggleCollapse(event) {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);
            // Get all collapsible elements
            const allCollapsibles = document.querySelectorAll('.collapse');
            // Close all other collapsible elements
            allCollapsibles.forEach(function(element) {
                if (element !== targetElement) {
                    element.classList.remove('show');
                    element.previousElementSibling.querySelector('.window-expand-row-trigger-col .up-arrow').classList.add('d-none');
                    element.previousElementSibling.querySelector('.window-expand-row-trigger-col .down-arrow').classList.remove('d-none');
                }
            });
            // Toggle the target element
            targetElement.classList.toggle('show');
        }

        // Add event listeners to buttons
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const parentDiv = event.target.closest(".toggle-btn");
                if(parentDiv.querySelector("span.down-arrow").classList.contains("d-none")){
                    parentDiv.querySelector("span.up-arrow").classList.add("d-none")
                    parentDiv.querySelector("span.down-arrow").classList.remove("d-none")
                } else {
                    parentDiv.querySelector("span.down-arrow").classList.add("d-none")
                    parentDiv.querySelector("span.up-arrow").classList.remove("d-none")
                }
                toggleCollapse.call(this, event);
            });
        });
    }
}