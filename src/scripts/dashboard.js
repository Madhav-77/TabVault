import { Browser } from './browser.js';
import { FILE_CONSTANTS } from './constants.js';
import { Archive } from './Archive.js';

export class Dashboard {
    constructor(archiveObject) {
        if (Dashboard.instance instanceof Dashboard) {
            return Dashboard.instance
        }
        console.log("dashboard.js loaded")
        this.currentOpenWindows = null;
        this.archiveObject = archiveObject;
        this.newBrowser = new Browser();
        this.archiveList = this.archiveObject.archiveData["archive"];
        this.windowsNameLookup = this.archiveObject.archiveData["windows_name_lookup"];
        this.currentSelectedArchiveList = [];
        this.archiveTabList = [];
        this.isCurrentTabOpenWindows = true;
    }

    async initialize() {
        this.currentOpenWindows = await this.getCurrentOpenWindows();
        this.addEventListeners();
        this.initializeTable(FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS.CLASS_OPEN_TABLE, this.currentOpenWindows);
    }

    addEventListeners() {
        document.querySelectorAll('#window-nav-tabs span[data-bs-toggle="tab"]').forEach(bootstrapTab => { bootstrapTab.addEventListener("click", (element) => { this.tabSwitch(element) }) });
        document.getElementById("clearData").addEventListener("click", () => { this.clearAllArchiveData() });
        document.getElementById("updateArchive").addEventListener("click", () => { this.updateArchive() });
        document.getElementById("getArchiveList").addEventListener("click", () => { console.log(this.getArchivedData()) });
        document.getElementById("closeSelectedWindows").addEventListener("click", () => { this.closeSelectedTabs() });
        document.getElementById("openFromArchive").addEventListener("click", () => { this.openSelectedWindows() });
        document.getElementById("deleteFromArchive").addEventListener("click", () => { this.deleteFromArchive() });
        document.getElementById('openModalButton').addEventListener('click', this.openModal);
        document.querySelectorAll('button[data-dismiss="modal"]').forEach(ele => {ele.addEventListener('click', this.closeModal)});
    }

    openModal() {
        const modal = document.getElementById('myModal');
        const modalToggle = new bootstrap.Modal(modal);
        modalToggle.show();
    }

    closeModal() {
        const modalToggle = bootstrap.Modal.getInstance(document.getElementById('myModal'));
        modalToggle.hide();
    }

    async tabSwitch(element) {
        let currentTabId = element.target.getAttribute("id");
        const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
        if(currentTabId == selectorConstants.OPEN_WINDOWS_TAB) {
            this.currentOpenWindows = await this.getCurrentOpenWindows();
            this.isCurrentTabOpenWindows = true;
            document.querySelector(selectorConstants.CLASS_ARCHIVE_TAB_BUTTONS).classList.add("d-none");
            document.querySelector(selectorConstants.CLASS_OPEN_TAB_BUTTONS).classList.remove("d-none");
            this.initializeTable(selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindows);
        }
        if(currentTabId == selectorConstants.ARCHIVE_WINDOWS_TAB) {
            this.isCurrentTabOpenWindows = false;
            document.querySelector(selectorConstants.CLASS_OPEN_TAB_BUTTONS).classList.add("d-none");
            document.querySelector(selectorConstants.CLASS_ARCHIVE_TAB_BUTTONS).classList.remove("d-none");
            this.initializeTable(selectorConstants.CLASS_ARCHIVE_TABLE, this.archiveList);
        }
    }

    errorLogMessageFormatter(customMessage) {
        return FILE_CONSTANTS.DASHBOARD_CLASS.LOGGING_MESSAGES.FILE_NAME + ' - ' + customMessage + ' ';
    }

    async getCurrentOpenWindows() {
        try {
            return await this.newBrowser.getAllOpenWindows();
        } catch (error) {
            console.error(this.errorLogMessageFormatter('getCurrentOpenWindows'), error);
            throw error;
        }

    }

    storeTabsInList(data, existingData, tab, windowId, tabId) {
        try{
            let windowCurrentObj = this.getWindowDetailsFromList(existingData, windowId);
            let windowObj = this.getWindowDetailsFromList(data, windowId);
            let tabCurrentObj = windowCurrentObj.tabs.find(tab => tab.tabId == tabId);
            let tabObject = {
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
            console.error(this.errorLogMessageFormatter('storeTabsInList'), error);
            throw error;
        }
    }
    
    getWindowDetailsFromList(data, windowId) {
        return data?.find(window => window.windowId == windowId);
    }

    removeTabsFromList(data, windowId, tabId) {
        try{
            let windowFromList = this.getWindowDetailsFromList(data, windowId);
            if (windowFromList) {
                let tabIndex = windowFromList.tabs.findIndex(tab => tab.tabId === tabId);
                if (tabIndex > -1) {
                    windowFromList.tabs.splice(tabIndex, 1);
                }
    
                // To remove window object when all child tabs are unchecked
                if (!windowFromList.tabs.length) {
                    let windowIndex = data?.findIndex(window => window.windowId == windowId);
                    data?.splice(windowIndex, 1);
                }
            }
        } catch (error) {
            console.error(this.errorLogMessageFormatter('removeTabsFromList'), error);
            throw error;
        }
    }

    lookIntoArchiveList(type, windowObject, tabId = "") { 
        try {
            let windowId = windowObject.windowId;
            let windowFromArchive = this.getWindowDetailsFromList(this.archiveList, windowId);
            if(windowFromArchive) {
                if (type == "window") {
                    return windowObject.tabs.every(w1 => windowFromArchive.tabs.some(w2 => w1.tabId == w2.tabId))
                }
                if (type == "tab") {
                    return windowFromArchive?.tabs.some(tab => tab.tabId == tabId)
                }
            }
            return false
        } catch (error) {
            console.error(this.errorLogMessageFormatter('lookIntoArchiveList'), error);
            throw error;
        }
    }

    allTabsChecked(parentTable, windowId, tabId) {
        const checkBoxesSelectors = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS.CHECKBOXES;
        let checkedTabs = document.querySelectorAll(parentTable + checkBoxesSelectors.TAB_CHECKED_ENABLED + '[data-window-id="' + windowId + '"]').length;
        let parentWindowRow = document.querySelector(parentTable + checkBoxesSelectors.WINDOW + '[data-window-id="' + windowId + '"]');
        if (checkedTabs > 0) {
            parentWindowRow.checked = true;
        } else {
            parentWindowRow.checked = false;
        }
        this.allWindowsChecked(parentTable);
    }

    allWindowsChecked(parentTable) {
        const checkBoxesSelectors = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS.CHECKBOXES; 
        let totalWindows = document.querySelectorAll(parentTable + checkBoxesSelectors.WINDOW_ENABLED).length;
        let checkedWindows = document.querySelectorAll(parentTable + checkBoxesSelectors.WINDOW_CHECKED_ENABLED).length;
        let parentSelectAllWindowRow = document.querySelector(parentTable + checkBoxesSelectors.ALL_WINDOW);
        let uncheckedTabsCount = document.querySelectorAll(parentTable + checkBoxesSelectors.TAB_NOT_CHECKED_ENABLED).length; // Making sure that all tabs are selected before checking SelectAllWindow checkbox 
        if (totalWindows == checkedWindows && uncheckedTabsCount == 0) {
            parentSelectAllWindowRow.checked = true;
        } else {
            parentSelectAllWindowRow.checked = false;
        }
    }

    initializeTabCheckBoxes(parentTable) {
        const checkBoxesSelectors = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS.CHECKBOXES; 
        document.querySelectorAll(parentTable + checkBoxesSelectors.TAB_ENABLED).forEach(tab => {
            tab.addEventListener('change', (ele) => {
                const windowId = parseInt(ele.target.getAttribute("data-window-id"))
                const tabId = parseInt(ele.target.getAttribute("data-tab-id"))
                if(this.isCurrentTabOpenWindows) { // check for only open windows tab
                    if (ele.target.checked) {
                        this.storeTabsInList(this.archiveList, this.currentOpenWindows, ele.target, windowId, tabId);
                        this.storeTabsInList(this.currentSelectedArchiveList, this.currentOpenWindows, ele.target, windowId, tabId);
                    } else {
                        this.removeTabsFromList(this.archiveList, windowId, tabId);
                        this.removeTabsFromList(this.currentSelectedArchiveList, windowId, tabId);
                    }
                } else {
                    if (ele.target.checked) {
                        this.storeTabsInList(this.archiveTabList, this.archiveList, ele.target, windowId, tabId);
                    } else {
                        this.removeTabsFromList(this.archiveTabList, windowId, tabId);
                    }
                }
                this.allTabsChecked(parentTable, windowId, tabId);
            });
        })
    }

    initializeWindowCheckBoxes(parentTable) {
        let windowSelectCheckbox = document.querySelectorAll(parentTable + '.select-window-checkbox[type="checkbox"]:not(:disabled)');
        windowSelectCheckbox.forEach(window => {
            window.addEventListener('change', (ele) => {
                const windowId = parseInt(ele.target.getAttribute("data-window-id"));
                const isChecked = ele.target.checked;
                let allTabsCheckboxes = document.querySelectorAll(parentTable + "input.select-tab-checkbox:not(:disabled)[data-window-id='" + windowId + "']");
                allTabsCheckboxes.forEach(tab => {
                    const tabId = parseInt(tab.getAttribute("data-tab-id"));
                    tab.checked = isChecked;
                    if(this.isCurrentTabOpenWindows) { // check for only open windows tab
                        if (isChecked) {
                            this.storeTabsInList(this.archiveList, this.currentOpenWindows, tab, windowId, tabId);
                            this.storeTabsInList(this.currentSelectedArchiveList, this.currentOpenWindows, tab, windowId, tabId);
                        } else {
                            this.removeTabsFromList(this.archiveList, windowId, tabId);
                            this.removeTabsFromList(this.currentSelectedArchiveList, windowId, tabId);
                        }
                    } else {
                        if (isChecked) {
                            this.storeTabsInList(this.archiveTabList, this.archiveList, tab, windowId, tabId);
                        } else {
                            this.removeTabsFromList(this.archiveTabList, windowId, tabId);
                        }
                    }
                });
                this.allWindowsChecked(parentTable);
            });
        });
    }

    initializeSelectAllWindowCheckBoxes(parentTable) {
        let windowSelectAllCheckbox = document.querySelector(parentTable + '.select-all-window-checkbox');
        windowSelectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked
            let allWindowsCheckboxes = document.querySelectorAll(parentTable + '.select-window-checkbox[type="checkbox"]:not(:disabled)');
            allWindowsCheckboxes.forEach(windowCheckbox => {
                if (windowCheckbox.checked != isChecked) {
                    windowCheckbox.click()
                }
            });
        });
    }

    windowNameInputAction(action, currElement) {
        const windowId = currElement.getAttribute("data-window-id");
        let windowRow = '';
        if(currElement.classList.contains("open")) {
            windowRow = document.querySelector(".open-windows-table .window-row[data-window-id='" + windowId + "']");
        } else {
            windowRow = document.querySelector(".archive-windows-table .window-row[data-window-id='" + windowId + "']");
        }
        const handleClickOutsideWindowRow = (event) => {
            if(!windowRow.contains(event.target)) {
                this.showHideWindowNameEditFields(windowRow, false);
                document.removeEventListener('click', handleClickOutsideWindowRow);
            }
        }

        if(action == "edit") {
            this.showHideWindowNameEditFields(windowRow, true);
            document.addEventListener('click', handleClickOutsideWindowRow);
        } else { // incase of 'save' || 'close'
            let windowName = currElement.closest(".save-section").querySelector("input.window-name-input").value;
            if(action == "close" || windowName == "") { // setting input value to initial value if user tried to save the blank field or in case of 'close' 
                const initialValue = windowRow.querySelector(".window-name-input").getAttribute("data-initial-value");
                windowRow.querySelector(".window-name-input").value = initialValue;
            } else {
                this.windowsNameLookup[windowId] = windowName;
                console.log(this.windowsNameLookup)
                if(this.archiveList.find(obj => obj.windowId == windowId)){
                    this.archiveList.find(obj => obj.windowId == windowId).windowName = windowName;
                }
                this.updateArchive();
            }
            this.showHideWindowNameEditFields(windowRow, false);
            document.removeEventListener('click', handleClickOutsideWindowRow);
        }
    }


    showHideWindowNameEditFields(windowRow, isEditable) {
        let selectCheckbox = windowRow.querySelector(".select-window-checkbox");
        let rowExpandTrigger = windowRow.querySelector(".window-expand-row-trigger-col svg");
        let editButton = windowRow.querySelector(".window-name-col .edit-section");
        let saveButton = windowRow.querySelector(".window-name-col .save-section");
        if(isEditable) {
            selectCheckbox.setAttribute("disabled", true);
            rowExpandTrigger.classList.add("d-none");
            editButton.classList.add("d-none");
            saveButton.classList.remove("d-none");
        } else {
            selectCheckbox.removeAttribute("disabled");
            rowExpandTrigger.classList.remove("d-none");
            editButton.classList.remove("d-none");
            saveButton.classList.add("d-none");
        }
    }

    async initializeTable(parentTable, data) {
        // await this.getWindowsNameFromLookup(data);
        this.populateTableData(parentTable, data);
        this.initializeSelectAllWindowCheckBoxes(parentTable);
        this.initializeWindowCheckBoxes(parentTable);
        this.initializeTabCheckBoxes(parentTable);
        this.initializeWindowNameEditing();
    }

    initializeWindowNameEditing() {
        document.querySelectorAll(".edit-window-name-button").forEach(ele => {
            ele.addEventListener("click", (element) => { this.windowNameInputAction("edit", element.target.closest(".edit-window-name-button")) });
        });
        document.querySelectorAll(".save-window-name-button").forEach(ele => {
            ele.addEventListener("click", (element) => { this.windowNameInputAction("save", element.target.closest(".save-window-name-button")) });
        });
        document.querySelectorAll(".close-window-name-edit-button").forEach(ele => {
            ele.addEventListener("click", (element) => { this.windowNameInputAction("close", element.target.closest(".close-window-name-edit-button")) });
        });
    }

    getWindowsNameFromLookup(windowId, windowName) {
        if(this.windowsNameLookup && this.windowsNameLookup.hasOwnProperty(windowId)){
            return this.windowsNameLookup[windowId];
        }
        return windowName;
    }

    populateTableData(parentTable, tableData) {
        const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
        let parent = parentTable == selectorConstants.CLASS_OPEN_TABLE ? "open" : "archive";
        let tableBody = "";
        let windowExistsInArchive = false;
        let tabExistsInArchive = false;
        let allWindowsExistsInArchive = true;
        for (let i = 0; i < tableData.length; i++) {
            if(this.isCurrentTabOpenWindows){ // check for only open windows tab
                windowExistsInArchive = this.lookIntoArchiveList("window", tableData[i])
                if (!windowExistsInArchive) {
                    allWindowsExistsInArchive = false;
                }
            }
            let windowName = this.getWindowsNameFromLookup(tableData[i].windowId, `Window ${i + 1}`)
            console.log(windowName)
            tableBody += `
                    <tr class="window-row" aria-expanded="false" data-window-id=${tableData[i].windowId}>
                        <th class="window-action-col" scope="row">
                            <input class="select-window-checkbox ${windowExistsInArchive ? 'cursor-not-allowed' : ''}" data-type="window" data-window-id=${tableData[i].windowId} ${windowExistsInArchive ? 'disabled title="Already archived"' : ''} type="checkbox">
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
                                <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                            </svg>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${tableData[i].tabs.map((tab, j) => {
                                            if(this.isCurrentTabOpenWindows){ // check for only open windows tab
                                                tabExistsInArchive = this.lookIntoArchiveList("tab", tableData[i], tab.tabId);
                                            }
                                            return `<tr class="tab-row" data-tab-id=${tab.tabId}>
                                                <th class="tab-action-col" scope="row">
                                                    <input class="select-tab-checkbox ${tabExistsInArchive ? 'cursor-not-allowed' : ''}" data-window-id=${tableData[i].windowId} data-window-name="${windowName}" data-type="tab" data-tab-id=${tab.tabId} ${tabExistsInArchive ? 'disabled title="Already archived"' : ''} type="checkbox">
                                                </th>
                                                <td class="tab-index-col">${j + 1}</td>
                                                <td class="tab-title-col">
                                                    ${tab.title}
                                                    ${tab.active ? '<span class="focused-tab-text">(Active tab)</span>' : ''}
                                                </td>
                                                <td class="tab-url-col d-none">${tab.url}</td>
                                            </tr>
                                        `}).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>`;
        }
        // Enables/Disables Select all windows checkbox based on windows/tabs selection
        if (allWindowsExistsInArchive && this.isCurrentTabOpenWindows) { // check for only open windows tab
            let windowSelectAllCheckbox = document.querySelector(parentTable + selectorConstants.CHECKBOXES.ALL_WINDOW);
            windowSelectAllCheckbox.checked = false
            windowSelectAllCheckbox.classList.add("cursor-not-allowed")
            windowSelectAllCheckbox.setAttribute("disabled", true)
            windowSelectAllCheckbox.setAttribute("title", "Already archived")
        }
        // console.log(tableBody)
        document.querySelector(parentTable + "tbody").innerHTML = tableBody;
        this.accordianBehaviorForTable();
    }

    async clearAllArchiveData() {
        try {
            await this.archiveObject.clearAllData();
            navigateTo('home', this.archiveObject);
        } catch (error) {
            console.error(this.errorLogMessageFormatter('clearAllArchiveData'), error);
            throw error;
        }
    }

    async updateArchive() {
        try {
            const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
            this.cleanWindowsLookup();
            let archiveFormattedData = {
                archive: this.archiveList,
                windows_name_lookup: this.windowsNameLookup
            }
            await this.archiveObject.storeDataInStorage(archiveFormattedData);
            if (this.isCurrentTabOpenWindows) {
                this.initializeTable(selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindows);
            } else {
                this.initializeTable(selectorConstants.CLASS_ARCHIVE_TABLE, this.archiveList);
            }
            // call close selected tabs option
        } catch (error) {
            console.error(this.errorLogMessageFormatter('updateArchive'), error);
            throw error;
        }
    }

    cleanWindowsLookup() {
        try {
            const currentOpenWindowsList = this.currentOpenWindows.map(obj => obj.windowId);
            const archiveWindowsList = this.archiveList.map(obj => obj.windowId);
            const allWindows = currentOpenWindowsList.concat(archiveWindowsList);
            const allLookUpKeys = Object.keys(this.windowsNameLookup).map(key => parseInt(key));;
            allLookUpKeys.forEach(window => {
                if(!allWindows.includes(window)) {
                    delete this.windowsNameLookup[window]
                }
            })
        } catch (error) {
            console.error(this.errorLogMessageFormatter('cleanWindowsLookup'), error);
        }
    }

    getArchivedData() {
        // console.log(this.archiveTabList)
        // console.log(this.archiveList)
        // console.log(this.currentSelectedArchiveList;)
        return this.archiveObject.archiveData;
    }

    async closeSelectedTabs() {
        try {
            const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
            let tabIds = this.currentSelectedArchiveList.flatMap(window => window.tabs.map(tab => parseInt(tab.tabId)));
            if(tabIds) {
                this.newBrowser.closeSelectedTabs(tabIds)
                // If all tabs are selected and closed
                // Setting timeout for Chrome window to get closed
                setTimeout(async () => {
                    this.currentOpenWindows = await this.getCurrentOpenWindows();
                    this.resetAllWindowCheckbox(selectorConstants.CLASS_OPEN_TABLE);
                    this.initializeTable(selectorConstants.CLASS_OPEN_TABLE, this.currentOpenWindows);
                }, 100);
            }
        } catch (error) {
            console.error(this.errorLogMessageFormatter('closeSelectedTabs'), error);
            throw error;
        }
    }

    async openSelectedWindows() {
        // console.log(this.archiveTabList)
        // return
        try {
            for (let i = 0; i < this.archiveTabList.length; i++) {
                const newWindowId = this.archiveTabList[i].newWindowId;
                const isWindowOpen = await this.checkIfWindowOpen(newWindowId);
                const tabUrls = this.archiveTabList[i].tabs.map(tab => tab.url);
                let newWindow = {};
                if(newWindowId && isWindowOpen) {
                    tabUrls.forEach(async url => {
                        await this.newBrowser.openTabsInExistingWindow(newWindowId, url);
                    })
                } else {
                    newWindow = await this.newBrowser.createNewWindow(tabUrls);
                    this.archiveTabList[i].newWindowId = parseInt(newWindow.id);
                    this.updateNewWindowIdInArchiveList(this.archiveTabList[i]);
                }
            }
            this.deleteFromArchive();
        } catch (error) {
            console.error(this.errorLogMessageFormatter('openSelectedWindows'), error);
        }
    }

    async checkIfWindowOpen(windowId) {
        this.currentOpenWindows = await this.getCurrentOpenWindows()
        return this.currentOpenWindows.some(obj => obj.windowId == windowId);
    }

    updateNewWindowIdInArchiveList(window) {
        this.archiveList.find(obj => obj.windowId == window.windowId).newWindowId = window.newWindowId;
    }

    // handles select all window checkbox state, as only <tbody> data will get refreshed
    resetAllWindowCheckbox(parentTable) {
        const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
        document.querySelector(parentTable + selectorConstants.CHECKBOXES.ALL_WINDOW).checked = false;
    }

    deleteFromArchive() {
        try {
            const selectorConstants = FILE_CONSTANTS.DASHBOARD_CLASS.SELECTORS;
            this.archiveTabList.forEach(window => {
                window.tabs.forEach(tab => {
                    this.removeTabsFromList(this.archiveList, window.windowId, tab.tabId)
                })
            });
            this.archiveTabList = []; // reset archiveTabList after action taken on all selected items from Archive tab
            this.resetAllWindowCheckbox(selectorConstants.CLASS_ARCHIVE_TABLE);
            this.updateArchive();
        } catch (error) {
            console.error(this.errorLogMessageFormatter('deleteFromArchive'), error);
            throw error;
        }
    }

    closeSelectedWindows(windowId) {
        chrome.windows.remove(windowId);
    }

    // Bootstrap accordian
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
                toggleCollapse.call(this, event);
            });
        });

        // // Optionally, add click listeners to rows
        // const clickableRows = document.querySelectorAll('.cursor-pointer');
        // clickableRows.forEach(row => {
        //     row.addEventListener('click', function(event) {
        //         if (!event.target.classList.contains('toggle-btn')) {
        //             toggleCollapse.call(this, event);
        //         }
        //     });
        // });
    }
}

{
    window_name_lookup: {
        windowId: "windowName"
    }
}

{
    archives: [{
            "window-id": "",
            "window-name": "",
            "window-tabs-count": "",
            "window-tabs": [{
                "tab-id": "",
                "tab-title": "",
                "tab-url": ""
            }]
        },
        {
            "window-id": "",
            "window-name": "",
            "window-tabs-count": "",
            "window-tabs": [{
                "tab-id": "",
                "tab-title": "",
                "tab-url": ""
            }]
        }
    ]
}