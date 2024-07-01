// import { SharedUtility } from './SharedUtility.js';
import { ARCHIVE_INIT_VALUE } from './constants.js';
// import { Archive } from './Archive.js';

export class Home {
    constructor(archive) {
        if (Home.instance instanceof Home) {
            return Home.instance
        }
        this.newArchive = archive;
        console.log("home.js loaded", archive)
            // this.initialize();
    }

    initialize() {
        document.getElementById("create-new-archive").addEventListener('click', () => {
            this.createNewArchive();
        });
    }

    async createNewArchive() {
        await this.newArchive.createNewArchive(ARCHIVE_INIT_VALUE);
        navigateTo('dashboard', this.newArchive);
    }
}

// Bootstrap components
// Bootstrap tabs
function initializeBootstrapTabs() {
    // Initialize Bootstrap tabs
    var tabTriggers = document.querySelectorAll('#window-nav-tabs a[data-bs-toggle="tab"]');
    tabTriggers.forEach(function(tabTrigger) {
        tabTrigger.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default action
            var tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        });
    });
}
// Bootstrap accordian
function accordianBehaviorForTable() {
    // Function to handle toggle behavior and accordion effect
    function toggleCollapse(event) {
        const targetId = this.getAttribute('data-target');
        console.log(targetId)
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

    // Optionally, add click listeners to rows
    const clickableRows = document.querySelectorAll('.cursor-pointer');
    clickableRows.forEach(row => {
        row.addEventListener('click', function(event) {
            if (!event.target.classList.contains('toggle-btn')) {
                toggleCollapse.call(this, event);
            }
        });
    });
}

// Windows/Tabs
// return all currently open windows/tabs
// async function getAllOpenWindowsAndTabs() {
//     const windows = await chrome.windows.getAll({ populate: true });
//     const allWindows = windows.map(window => {
//         return {
//             windowId: window.id,
//             focused: window.focused,
//             tabs: window.tabs.map(tab => {
//                 return {
//                     tabId: tab.id,
//                     title: tab.title,
//                     url: tab.url,
//                     active: tab.active
//                 };
//             })
//         };
//     });
//     return allWindows;
// }

// displays all open windows/tabs
// function populateOpenWindowsData(allWindowsList) {
//     debugger
//     let tableBody = "";
//     for (let i = 0; i < allWindowsList.length; i++) {
//         tableBody += '<tr class="cursor-pointer" data-target="#tab-details-' + allWindowsList[i].windowId + '" aria-expanded="false">';
//         tableBody += '<th scope="row">' + (i + 1) + '</th>';
//         tableBody += '<td>Window ' + (i + 1) + '</td>';
//         tableBody += '<td>' + allWindowsList[i].tabs.length + '</td>';
//         tableBody += '<td>Archive</td></tr>';
//         tableBody += '<tr id="tab-details-' + allWindowsList[i].windowId + '" class="collapse">';
//         tableBody += '<td colspan="4">';
//         tableBody += '<div class="p-2">';
//         tableBody += '<table class="table table-hover m-0"><thead class="fonts-color-bg"><tr>';
//         tableBody += '<th scope="col">#</th>';
//         tableBody += '<th scope="col">Title</th>';
//         tableBody += '<th scope="col">Action</th>';
//         tableBody += '</tr></thead><tbody>';
//         for (let j = 0; j < allWindowsList[i].tabs.length; j++) {
//             tableBody += '<tr><th scope="row">' + (j + 1) + '</th>';
//             tableBody += '<td>' + allWindowsList[i].tabs[j].title + '</th>';
//             tableBody += '<td>Archive</td></tr>';
//         }
//         tableBody += '</tbody></table></div></td></tr>';
//     }
//     document.getElementById("open-windows-table-body").innerHTML = tableBody;
//     accordianBehaviorForTable();
// }



// Archives related 
// Creates new archive
// function createNewArchive() {
//     setValueChromeLocalStorage(ARCHIVE_STORAGE_NAME, [])
//     window.location.href = "dashboard.html";
// }

function showLoader(parentClass) {
    document.querySelectorAll(parentClass + ' .spinner-grow')[0].style.display = 'block';
    document.querySelectorAll(parentClass + ' .spinner-invert-class')[0].style.display = 'none';
}

function hideLoader(parentClass) {
    document.querySelectorAll(parentClass + ' .spinner-invert-class')[0].style.display = 'block';
    document.querySelectorAll(parentClass + ' .spinner-grow')[0].style.display = 'none';
}

// async function initialPageRedirection() {
//     try {
//         const archiveList = await getValueChromeLocalStorage(ARCHIVE_STORAGE_NAME);

//         hideLoader(".archive-button-div");
//         console.log(archiveList);
//         // Redirect based on fetched data
//         if (archiveList.length) {
//             window.location.href = 'dashboard.html';
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         hideLoader();
//         window.location.href = 'error.html';
//     }
//     // let getArchivePromise = new Promise(function(resolve) {
//     // console.log(await isArchivePresent(ARCHIVE_STORAGE_NAME))
//     // });
//     // console.log("getArchivePromise", await getArchivePromise)
//     // document.getElementById("getData").innerHTML = await getArchivePromise;
//     // if ( != {}) {
//     //     redirectToDashboard()
//     // } else {
//     //     redirectToIndex()
//     // }
// }

function redirectToIndex() {
    window.location.href = "index.html";
}

function redirectToDashboard() {
    window.location.href = "dashboard.html";
}

// document.addEventListener('DOMContentLoaded', () => {
//     // showLoader(".archive-button-div");

//     // document.getElementById("close-current-window").addEventListener("click", removeWindow);
//     // getAllOpenWindowsAndTabs().then(windows => {
//     //     populateOpenWindowsData(windows)
//     // });
//     // initializeBootstrapTabs();

//     let newArchive = new Archive(ARCHIVE_STORAGE_NAME);

//     newArchive.doesArchiveExist().then(data => {
//         if (data) {
//             // history.pushState(null, '', `dashboard.html`);
//             console.log("Archive exists");

//         } else {
//             console.log("Archive doesn't exist");
//         }
//     }).catch(error => {
//         console.error('Error: ', error);
//     });

//     // document.getElementById('createnewarchive').addEventListener('click', function() {
//     //     console.log("create-new-archive")
//     //     newArchive.createNewArchive();
//     // });
//     document.getElementById('saveData').addEventListener('click', function() {
//         newArchive.storeDataInStorage({
//             [ARCHIVE_STORAGE_NAME]: [{ "testing1": "1", "testing2": "1" }],
//             [ARCHIVE_STORAGE_NAME + "2"]: [{ "testing1": "2", "testing2": "2" }],
//             [ARCHIVE_STORAGE_NAME + "3"]: [{ "testing1": "3", "testing2": "3" }]
//         }).then(data => {
//             console.log('Stored multiple keys:', data);
//         }).catch(error => {
//             console.error('Error:', error);
//         });
//     });
//     // document.getElementById('getData').addEventListener('click', function() {
//     //     console.log(newArchive.archiveList)
//     // });
//     document.getElementById('getDataStore').addEventListener('click', function() {
//         newArchive.fetchDataFromStorage()
//     });
//     // document.getElementById('removeKey').addEventListener('click', function() {
//     //     newArchive.removeKeyFromArchive(ARCHIVE_STORAGE_NAME)
//     // });
//     document.getElementById('clearAll').addEventListener('click', function() {
//         newArchive.clearAllArchives()
//     });

//     // getButton.addEventListener('click', getArchiveFile());
// });

// Total Memory stats  
// document.addEventListener('DOMContentLoaded', () => {
//     // const container = document.getElementById('memory-container');

//     chrome.system.memory.getInfo((info) => {
//         const usedMemory = info.capacity - info.availableCapacity;
//         const usedMemoryMB = (usedMemory / (1024 * 1024)).toFixed(2);
//         const totalMemoryMB = (info.capacity / (1024 * 1024)).toFixed(2);

//         //   const memoryDiv = document.createElement('div');
//         //   memoryDiv.className = 'memory-info';
//         //   memoryDiv.innerHTML = `<strong>Total Memory:</strong> ${totalMemoryMB} MB<br>
//         //                          <strong>Used Memory:</strong> ${usedMemoryMB} MB`;

//         //   container.appendChild(memoryDiv);
//         console.log("usedMemory", usedMemory)
//         console.log("usedMemoryMB", usedMemoryMB)
//         console.log("totalMemoryMB", totalMemoryMB)
//     });
// });

// CPU Stats
// document.addEventListener('DOMContentLoaded', () => {

//     chrome.system.cpu.getInfo((info) => {
//         console.log(info); // For debugging, prints the CPU info to the console

//         //   const numOfProcessors = info.numOfProcessors;
//         //   const archName = info.archName;
//         //   const modelName = info.modelName;

//         //   const cpuInfoDiv = document.createElement('div');
//         //   cpuInfoDiv.className = 'cpu-info';
//         //   cpuInfoDiv.innerHTML = `<strong>Number of Processors:</strong> ${numOfProcessors}<br>
//         //                           <strong>Architecture:</strong> ${archName}<br>
//         //                           <strong>Model:</strong> ${modelName}`;

//         //   const usageDiv = document.createElement('div');
//         //   usageDiv.className = 'cpu-info';
//         //   usageDiv.innerHTML = `<strong>Usage:</strong>`;
//         //   info.processors.forEach((processor, index) => {
//         //     const usage = processor.usage;
//         //     const total = usage.total;
//         //     const user = usage.user;
//         //     const kernel = usage.kernel;
//         //     const idle = usage.idle;

//         //     const processorDiv = document.createElement('div');
//         //     processorDiv.className = 'cpu-info';
//         //     processorDiv.innerHTML = `<br>Processor ${index + 1}:<br>
//         //                               <strong>Total:</strong> ${total}<br>
//         //                               <strong>User:</strong> ${user}<br>
//         //                               <strong>Kernel:</strong> ${kernel}<br>
//         //                               <strong>Idle:</strong> ${idle}`;

//         //     usageDiv.appendChild(processorDiv);
//         //   });

//         //   container.appendChild(cpuInfoDiv);
//         //   container.appendChild(usageDiv);
//     });
// });

// Code to Close windows
// Installing window closer extension
// chrome.runtime.onInstalled.addListener(() => {
//     console.log('Window Closer Extension installed.');
// });
// 
// Function to remove a window by its ID
// function removeWindow(windowId) {
//     chrome.windows.remove(1982748384);
// }