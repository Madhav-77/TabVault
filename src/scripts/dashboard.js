import { Browser } from './browser.js'
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
        this.archiveList = this.archiveObject.archiveList["archive"];
        this.currentSelectedArchiveList = [];
        this.archiveTabList = [];
        this.isCurrentTabOpenWindows = true;
        // this.dashboardConstants = {
        //     // allWindowClass
        //     SELECT_ALL_WINDOW_CLASS: ,
        //     // windowFilterWindowId
        //     WINDOW_FILTER_WINDOWID: ,
        //     // windowNotDisabled
        //     WINDOW_FILTER_ENABLED: ,
        //     // windowCheckedNotDisabled
        //     WINDOW_FILTER_CHECKED_ENABLED: ,
        //     // windowClass
        //     WINDOW_CLASS: ,
        //     // tabCheckedNotDisabledFilterWindowId
        //     TAB_FILTER_CHECKED_ENABLED_WINDOWID: ,
        //     // tabNotDisabled
        //     TAB_FILTER_ENABLED: ,
        //     // tabClass
        //     TAB_CLASS:
        // }
    }

    async initialize() {
        this.currentOpenWindows = await this.getCurrentOpenWindows();
        this.addEventListeners();
        this.initializeTable(".open-windows-table ", this.currentOpenWindows);
    }

    addEventListeners() {
        document.querySelectorAll('#window-nav-tabs span[data-bs-toggle="tab"]').forEach(bootstrapTab => { bootstrapTab.addEventListener("click", (element) => { this.tabSwitch(element) }) });
        document.getElementById("clearData").addEventListener("click", () => { this.clearAllArchiveData() });
        document.getElementById("updateArchive").addEventListener("click", () => { this.updateArchive() });
        document.getElementById("getArchiveList").addEventListener("click", () => { console.log(this.getArchivedWindows()) });
        document.getElementById("closeSelectedWindows").addEventListener("click", () => { this.closeSelectedTabs() });
        document.getElementById("openFromArchive").addEventListener("click", () => { this.openSelectedWindows() });
        document.getElementById("deleteFromArchive").addEventListener("click", () => { this.deleteFromArchive() });
    }

    tabSwitch(element) {
        let currentTabId = element.target.getAttribute("id");
        console.log(currentTabId)
        if(currentTabId == "open-windows-tab") {
            this.isCurrentTabOpenWindows = true;
            document.querySelector(".archive-tab-buttons").classList.add("d-none");
            document.querySelector(".open-tab-buttons").classList.remove("d-none");
            this.initializeTable(".open-windows-table ", this.currentOpenWindows);
        }
        if(currentTabId == "archive-windows-tab") {
            this.isCurrentTabOpenWindows = false;
            document.querySelector(".open-tab-buttons").classList.add("d-none");
            document.querySelector(".archive-tab-buttons").classList.remove("d-none");
            this.initializeTable(".archive-windows-table ", this.archiveList);
        }
    }

    async getCurrentOpenWindows() {
        try {
            return await this.newBrowser.getAllOpenWindows();
        } catch (error) {
            console.error('Error getting current open browsers: ', error);
            throw error;
        }

    }

    storeTabsInList(data, tab, windowId, tabId) {
        try{
            let windowCurrentObj = this.getWindowDetailsFromList(this.currentOpenWindows, windowId);
            let windowObj = this.getWindowDetailsFromList(data, windowId);
            let tabCurrentObj = windowCurrentObj.tabs.find(tab => tab.tabId == tabId);
            let tabObject = {
                tabId: tabId,
                title: tabCurrentObj.title,
                url: tabCurrentObj.url
            }

            // Push if window exists in list
            if (windowObj) {
                windowObj.tabs.push(tabObject);
            } else {
                const windowName = tab.getAttribute("data-window-name")
                console.log(tab)
                data.push({
                    windowId: windowId,
                    windowName: windowName,
                    tabs: [tabObject]
                });
            }
        } catch (error) {
            console.log("dashboard.js - storeTabsInList: ", error)
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
            console.log("Couldn't remove tab from archive list: ", error);
            throw error;
        }
    }

    lookIntoArchive(type, windowObject, tabId = "") {
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
            console.log("LookIntoArchive function error: ", error);
            throw error;
        }
    }

    allTabsChecked(parentTable, windowId, tabId) {
        let checkedTabs = document.querySelectorAll(parentTable + 'input.select-tab-checkbox[data-window-id="' + windowId + '"]:checked:not(:disabled)').length;
        let parentWindowRow = document.querySelector(parentTable + 'input.select-window-checkbox[data-window-id="' + windowId + '"]');
        if (checkedTabs > 0) {
            parentWindowRow.checked = true;
        } else {
            parentWindowRow.checked = false;
        }
        this.allWindowsChecked(parentTable);
    }

    allWindowsChecked(parentTable) {
        let totalWindows = document.querySelectorAll(parentTable + "input.select-window-checkbox[type='checkbox']:not(:disabled)").length;
        let checkedWindows = document.querySelectorAll(parentTable + "input.select-window-checkbox[type='checkbox']:checked:not(:disabled)").length;
        let parentSelectAllWindowRow = document.querySelector(parentTable + 'input.select-all-window-checkbox');
        let uncheckedTabsCount = document.querySelectorAll(parentTable + 'input.select-tab-checkbox:not(:checked):not(:disabled)').length; // Making sure that all tabs are selected before checking SelectAllWindow checkbox 
        console.log(uncheckedTabsCount)
        console.log(totalWindows)
        console.log(checkedWindows)
        if (totalWindows == checkedWindows && uncheckedTabsCount == 0) {
            parentSelectAllWindowRow.checked = true;
        } else {
            parentSelectAllWindowRow.checked = false;
        }
    }

    initializeTabCheckBoxes(parentTable) {
        let windowId = "";
        let tabId = "";
        document.querySelectorAll(parentTable + '.select-tab-checkbox[type="checkbox"]:not(:disabled)').forEach(tab => {
            tab.addEventListener('change', (ele) => {
                windowId = ele.target.getAttribute("data-window-id")
                tabId = ele.target.getAttribute("data-tab-id")
                if(this.isCurrentTabOpenWindows) { // check for only open windows tab
                    if (ele.target.checked) {
                        this.storeTabsInList(this.archiveList, ele.target, windowId, tabId);
                        this.storeTabsInList(this.currentSelectedArchiveList, ele.target, windowId, tabId);
                    } else {
                        this.removeTabsFromList(this.archiveList, windowId, tabId);
                        this.removeTabsFromList(this.currentSelectedArchiveList, windowId, tabId);
                    }
                } else {
                    if (ele.target.checked) {
                        this.storeTabsInList(this.archiveTabList, ele.target, windowId, tabId);
                    } else {
                        this.removeTabsFromList(this.archiveTabList, windowId, tabId);
                    }
                }
                this.allTabsChecked(parentTable, windowId, tabId);
            });
        })
    }

    initializeWindowCheckBoxes(parentTable) {
        let windowId = "";
        let tabId = "";
        let windowSelectCheckbox = document.querySelectorAll(parentTable + '.select-window-checkbox[type="checkbox"]:not(:disabled)');
        windowSelectCheckbox.forEach(window => {
            window.addEventListener('change', (ele) => {
                windowId = ele.target.getAttribute("data-window-id");
                const isChecked = ele.target.checked;
                let allTabsCheckboxes = document.querySelectorAll(parentTable + "input.select-tab-checkbox[data-window-id='" + windowId + "']:not(:disabled)");
                allTabsCheckboxes.forEach(tab => {
                    tabId = tab.getAttribute("data-tab-id");
                    tab.checked = isChecked;
                    if(this.isCurrentTabOpenWindows) { // check for only open windows tab
                        if (isChecked) {
                            this.storeTabsInList(this.archiveList, tab, windowId, tabId);
                            this.storeTabsInList(this.currentSelectedArchiveList, tab, windowId, tabId);
                        } else {
                            this.removeTabsFromList(this.archiveList, windowId, tabId);
                            this.removeTabsFromList(this.currentSelectedArchiveList, windowId, tabId);
                        }
                    } else {
                        if (isChecked) {
                            this.storeTabsInList(this.archiveTabList, tab, windowId, tabId);
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

    initializeTable(parentTable, data) {
        this.populateTableData(parentTable, data);
        this.initializeSelectAllWindowCheckBoxes(parentTable);
        this.initializeWindowCheckBoxes(parentTable);
        this.initializeTabCheckBoxes(parentTable);
    }

    populateArchiveWindowsTable() {
        this.populateTableData("archive-windows-table-body", this.archiveList)
    }

    populateTableData(parentTable, tableData) {
        let parent = parentTable == ".open-windows-table " ? "open" : "archive";
        let tableBody = "";
        let windowExistsInArchive = false;
        let tabExistsInArchive = false;
        let allWindowsExistsInArchive = true;
        for (let i = 0; i < tableData.length; i++) {
            if(this.isCurrentTabOpenWindows){ // check for only open windows tab
                windowExistsInArchive = this.lookIntoArchive("window", tableData[i])
                if (!windowExistsInArchive) {
                    allWindowsExistsInArchive = false;
                }
            }
            tableBody += `
                    <tr class="" aria-expanded="false" data-window-id=${tableData[i].windowId} data-all-tabs-checked="false">
                        <th class="window-action-col" scope="row">
                            <input class="select-window-checkbox ${windowExistsInArchive ? 'cursor-not-allowed' : ''}" data-type="window" data-window-id=${tableData[i].windowId} ${windowExistsInArchive ? 'disabled title="Already archived"' : ''} type="checkbox">
                        </th>
                        <td class="window-index-col">${i + 1}</td>
                        <td class="window-name-col">Window ${i + 1} ${tableData[i].focused ? '<span class="focused-window-text">(Active window)</span>' : ''}</td>
                        <td class="window-tab-count-col text-center">${tableData[i].tabs.length}</td>
                        <td class="window-expand-row-trigger-col text-center toggle-btn cursor-pointer" data-target="#${parent}-tab-details-${tableData[i].windowId}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
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
                                                tabExistsInArchive = this.lookIntoArchive("tab", tableData[i], tab.tabId);
                                            }
                                            return `<tr data-tab-id=${tab.tabId}>
                                                <th class="tab-action-col" scope="row">
                                                    <input class="select-tab-checkbox ${tabExistsInArchive ? 'cursor-not-allowed' : ''}" data-window-id=${tableData[i].windowId} data-window-name="Window ${i + 1}" data-type="tab" data-tab-id=${tab.tabId} ${tabExistsInArchive ? 'disabled title="Already archived"' : ''} type="checkbox">
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
            let windowSelectAllCheckbox = document.querySelector(parentTable + '.select-all-window-checkbox');
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
            await this.archiveObject.clearAllArchives();
            navigateTo('home', this.archiveObject);
        } catch (error) {
            console.error('Error getting current open browsers: ', error);
            throw error;
        }
    }

    async updateArchive() {
        try {
            let archiveFormattedData = {
                archive: this.archiveList
            }
            await this.archiveObject.storeDataInStorage(archiveFormattedData);
            if (this.isCurrentTabOpenWindows) {
                this.initializeTable(".open-windows-table ", this.currentOpenWindows);
            } else {
                this.initializeTable(".archive-windows-table ", this.archiveList);
            }
        } catch (error) {
            console.error('Error updating archive list to chrome storage: ', error);
            throw error;
        }
    }

    getArchivedWindows() {
        // console.log(this.archiveTabList)
        // console.log(this.archiveList)
        // console.log(this.currentSelectedArchiveList;)
        return this.archiveObject.archiveList;
    }

    async closeSelectedTabs() {
        try {
            let tabIds = this.currentSelectedArchiveList.flatMap(window => window.tabs.map(tab => parseInt(tab.tabId)));
            if(tabIds) {
                this.newBrowser.closeSelectedTabs(tabIds)
                // If all tabs are selected and closed
                // Setting timeout for Chrome window to get closed
                setTimeout(async () => {
                    this.currentOpenWindows = await this.getCurrentOpenWindows();
                    console.log(this.currentOpenWindows)
                    this.initializeTable(".open-windows-table ", this.currentOpenWindows);
                }, 100);
            }
        } catch (error) {
            console.error('dashboard.js - closeSelectedTabs: ', error);
            throw error;
        }
    }

    async openSelectedWindows() {
        try {
            let tabUrls = [];
            this.archiveTabList.forEach(async window => {
                tabUrls = window.tabs.map(tab => tab.url);
                await this.newBrowser.createNewWindow(tabUrls);
            })
            this.deleteFromArchive();
        } catch (error) {
            console.error('dashboard.js - openSelectedWindows: ', error);
        }
    }

    deleteFromArchive() {
        try {
            this.archiveTabList.forEach(window => {
                window.tabs.forEach(tab => {
                    this.removeTabsFromList(this.archiveList, window.windowId, tab.tabId)
                })
            });
            this.updateArchive();
        } catch (error) {
            console.log("dashboard.js - deleteFromArchive", error);
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