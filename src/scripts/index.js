import { ARCHIVE_LIST_NAME, ARCHIVE_WINDOW_LOOKUP_NAME, FILE_CONSTANTS } from './constants.js';
import { Archive } from './Archive.js';

document.addEventListener('DOMContentLoaded', async() => {
    checkForArchive(); // checks if data exists in archive for initial redirection

    window.navigateTo = function(page, archive) {
        loadPage(page, archive);
    };

    async function loadPage(page, archive) {
        try {
            const htmlPath = `${page}.html`;
            const jsPath = `../scripts/${page}.js`;
            const response = await fetch(htmlPath);
            const html = await response.text();
            document.getElementsByClassName("html-dynamic-page-viewer")[0].innerHTML = html;

            // Remove the previously added script if it exists
            const oldScript = document.getElementById('pageScript');
            if (oldScript) {
                document.head.removeChild(oldScript);
            }

            loadScript(jsPath, () => { initializePage(page, archive); }); // Load the new script
        } catch (error) {
            // console.error(this.errorLogMessageFormatter('loadPage'), error);
            throw error;
        }
    }

    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.type = "module";
        script.id = 'pageScript';
        script.onload = callback;
        document.head.appendChild(script);
    }

    async function initializePage(page, archive) {
        switch (page) {
            case 'home':
                const { Home } = await import ('./home.js');
                new Home(archive).initialize();
                break;
            case 'dashboard':
                const { Dashboard } = await import ('./dashboard.js');
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
            // console.error(this.errorLogMessageFormatter('checkForArchive'), error);
            throw error;
        });
    }

    function errorLogMessageFormatter(customMessage) {
        return FILE_CONSTANTS.INDEX_SCRIPT.LOGGING_MESSAGES.FILE_NAME + ' - ' + customMessage + ' ';
    }
});