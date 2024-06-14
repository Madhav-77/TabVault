// Returns all open windows and tabs
async function getAllOpenWindowsAndTabs() {
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
}

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

function populateOpenWindowsData(allWindowsList) {
    let tableBody = "";
    for (let i = 0; i < allWindowsList.length; i++) {
        tableBody += '<tr class="cursor-pointer" data-target="#tab-details-' + allWindowsList[i].windowId + '" aria-expanded="false">';
        tableBody += '<th scope="row">' + (i + 1) + '</th>';
        tableBody += '<td>Window ' + (i + 1) + '</td>';
        tableBody += '<td>' + allWindowsList[i].tabs.length + '</td>';
        tableBody += '<td>Archive</td></tr>';
        tableBody += '<tr id="tab-details-' + allWindowsList[i].windowId + '" class="collapse">';
        tableBody += '<td colspan="4">';
        tableBody += '<div class="p-2">';
        tableBody += '<table class="table table-hover m-0"><thead class="fonts-color-bg"><tr>';
        tableBody += '<th scope="col">#</th>';
        tableBody += '<th scope="col">Title</th>';
        tableBody += '<th scope="col">Action</th>';
        tableBody += '</tr></thead><tbody>';
        for (let j = 0; j < allWindowsList[i].tabs.length; j++) {
            tableBody += '<tr><th scope="row">' + (j + 1) + '</th>';
            tableBody += '<td>' + allWindowsList[i].tabs[j].title + '</th>';
            tableBody += '<td>Archive</td></tr>';
        }
        tableBody += '</tbody></table></div></td></tr>';
    }
    document.getElementById("open-windows-table-body").innerHTML = tableBody;
    accordianBehaviorForTable();
}

document.addEventListener('DOMContentLoaded', () => {
    // document.getElementById("close-current-window").addEventListener("click", removeWindow);
    getAllOpenWindowsAndTabs().then(windows => {
        console.log(windows)
        populateOpenWindowsData(windows)
    });
    initializeBootstrapTabs();
});

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