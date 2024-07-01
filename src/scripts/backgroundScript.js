// Function to log the active tab in the currently focused window
function logFocusedWindow() {
    chrome.windows.getLastFocused({ populate: true }, function(window) {
        if (chrome.runtime.lastError) {
            console.error('Error getting last focused window:', chrome.runtime.lastError);
        } else if (window) {
            console.log('Focused window:', window);
            const activeTab = window.tabs.find(tab => tab.active);
            if (activeTab) {
                console.log('Active tab in focused window:', activeTab);
            } else {
                console.log('No active tab found in focused window.');
            }
        } else {
            console.log('No focused window found.');
        }
    });
}

// Initial check when the extension is first loaded
logFocusedWindow();

// Listen for changes in window focus
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log('No focused window.');
    } else {
        logFocusedWindow();
    }
});