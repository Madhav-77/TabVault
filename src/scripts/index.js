import { ARCHIVE_LIST_NAME, ARCHIVE_WINDOW_LOOKUP_NAME, FILE_CONSTANTS } from './constants.js';
import { Archive } from './Archive.js';
import { errorLogMessageFormatter } from './sharedUtility.js';

document.addEventListener('DOMContentLoaded', async() => {
    checkForArchive(); // checks if data exists in archive for initial redirection
    const loggingMessages = FILE_CONSTANTS.INDEX_SCRIPT.LOGGING_MESSAGES;

    window.navigateTo = function(page, archive) {
        loadPage(page, archive);
    };

    async function loadPage(page, archive) {
        try {
            const htmlPath = `${page}.html`;
            const jsPath = `../scripts/${page}.js`;
            const cssPath = `../../assets/styles/${page}.css`;
            const response = await fetch(htmlPath);
            const html = await response.text();
            document.getElementsByClassName("html-dynamic-page-viewer")[0].innerHTML = html;

            // Remove the previously added script if it exists
            const oldScript = document.getElementById('pageScript');
            if (oldScript) {
                document.head.removeChild(oldScript);
            }

            // Remove the previously added style if it exists
            const oldStyle = document.getElementById('pageStyle');
            if (oldStyle) {
                document.head.removeChild(oldStyle);
            }

            loadScript(jsPath, cssPath, () => { initializePage(page, archive); }); // Load the new script
        } catch (error) {
            // console.error(errorLogMessageFormatter(loggingMessages.FILE_NAME, 'loadPage'), error);
            throw error;
        }
    }

    function loadScript(jsUrl, cssUrl, callback) {
        const script = document.createElement('script');
        const style = document.createElement('link');
        script.src = jsUrl;
        script.type = "module";
        script.id = 'pageScript';
        
        style.href = cssUrl;
        style.rel = 'stylesheet';
        style.id = 'pageStyle';
        
        script.onload = callback;
        document.head.appendChild(script);
        document.head.appendChild(style);
    }

    async function initializePage(page, archive) {
        switch (page) {
            case 'home':
                const { Home } = await import ('./Home.js');
                new Home(archive).initialize();
                break;
            case 'dashboard':
                const { Dashboard } = await import ('./Dashboard.js');
                new Dashboard(archive).initialize();
                break;
        }
    }

    function checkForArchive() {
        let newArchive = new Archive(ARCHIVE_LIST_NAME, ARCHIVE_WINDOW_LOOKUP_NAME);
        newArchive.doesArchiveDataExist().then(async data => {
            if (data) {
                await navigateTo('dashboard', newArchive);
            } else {
                await navigateTo('home', newArchive);
            }
        }).catch(error => {
            // console.error(errorLogMessageFormatter(loggingMessages.FILE_NAME, 'checkForArchive'), error);
            throw error;
        });
    }
});