import { ARCHIVE_STORAGE_NAME, ARCHIVE_INIT_VALUE } from './constants.js';
import { Archive } from './Archive.js';

// async function loadPageClass(page, data) {
//     try {
//         let pageClass;
//         switch (page) {
//             case 'dashboard':
//                 const { Dashboard } = await
//                 import ('./dashboard.js');
//                 pageClass = new Dashboard();
//                 break;
//             case 'home':
//                 const { Home } = await
//                 import ('./home.js');
//                 pageClass = new Home(data);
//                 break;
//             default:
//                 console.error('Page class could not load: ', page);
//                 return;
//         }
//         return pageClass;
//     } catch (error) {
//         console.error('Error loading page class: ', error, page);
//     }
// }

// async function fetchHtml(url) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Could not fetch ${url}: ${response.statusText}`);
//     }
//     return await response.text();
// }

// async function htmlAndJSLoading(archive, doesArchiveExist) {
//     let htmlViewer = document.getElementsByClassName("html-dynamic-page-viewer")[0];
//     let pageToLoad = "";
//     if (doesArchiveExist) {
//         pageToLoad = 'dashboard';
//         console.log("Archive exists");
//     } else {
//         pageToLoad = 'home';
//         console.log("Archive doesn't exist");
//     }
//     htmlViewer.innerHTML = await fetchHtml(pageToLoad + ".html");
//     return await loadPageClass(pageToLoad, archive);
// }

// function dynamicLoadingPage(archive, sharedUtility) {
//     archive.doesArchiveExist().then(async data => {
//         return await sharedUtility.htmlAndJSLoading(data);
//     }).catch(error => {
//         console.error('Error: ', error);
//         return;
//     });
// }

// document.addEventListener('DOMContentLoaded', async() => {
// loadPageClass('index');
// showLoader(".archive-button-div");

// document.getElementById("close-current-window").addEventListener("click", removeWindow);
// getAllOpenWindowsAndTabs().then(windows => {
//     populateOpenWindowsData(windows)
// });
// initializeBootstrapTabs();

// let newArchive = new Archive(ARCHIVE_STORAGE_NAME);
// let sharedUtility = new SharedUtility()

// let pageClass = dynamicLoadingPage(newArchive, sharedUtility);

// let newInstance = new pageClass(newArchive, sharedUtility);

// // let homeClass = await htmlAndJSLoading(newArchive, false);

// console.log(await sharedUtility.htmlAndJSLoading())
// let home = await sharedUtility.htmlAndJSLoading();

// let newHome = new home;
// console.log(newHome)

// console.log(homeClass.checkForArchive(homeClass.newArchive));

// if(homeClass.checkForArchive(homeClass.newArchive)

// // document.getElementById('createnewarchive').addEventListener('click', function() {
// //     console.log("create-new-archive")
// //     newArchive.createNewArchive();
// // });
// document.getElementById('saveData').addEventListener('click', function() {
//     newArchive.storeDataInStorage({
//         [ARCHIVE_STORAGE_NAME]: [{ "testing1": "1", "testing2": "1" }],
//         [ARCHIVE_STORAGE_NAME + "2"]: [{ "testing1": "2", "testing2": "2" }],
//         [ARCHIVE_STORAGE_NAME + "3"]: [{ "testing1": "3", "testing2": "3" }]
//     }).then(data => {
//         console.log('Stored multiple keys:', data);
//     }).catch(error => {
//         console.error('Error:', error);
//     });
// });
// // document.getElementById('getData').addEventListener('click', function() {
// //     console.log(newArchive.archiveList)
// // });
// document.getElementById('getDataStore').addEventListener('click', function() {
//     newArchive.fetchDataFromStorage()
// });
// // document.getElementById('removeKey').addEventListener('click', function() {
// //     newArchive.removeKeyFromArchive(ARCHIVE_STORAGE_NAME)
// // });
// document.getElementById('clearAll').addEventListener('click', function() {
//     newArchive.clearAllArchives()
// });

// getButton.addEventListener('click', getArchiveFile());
// });


document.addEventListener('DOMContentLoaded', async() => {
    // await loadPage('home');
    checkForArchive();

    window.navigateTo = function(page, archive) {
        loadPage(page, archive);
    };

    async function loadPage(page, archive) {
        const htmlPath = `${page}.html`;
        const jsPath = `../scripts/${page}.js`;

        try {
            const response = await fetch(htmlPath);
            const html = await response.text();
            document.getElementsByClassName("html-dynamic-page-viewer")[0].innerHTML = html
                // document.getElementById('app').innerHTML = html;

            // Remove the old script if it exists
            const oldScript = document.getElementById('pageScript');
            if (oldScript) {
                document.head.removeChild(oldScript);
            }

            // Load the new script
            loadScript(jsPath, () => { initializePage(page, archive); });
        } catch (error) {
            console.error('Error loading page:', error);
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
                const { Home } = await
                import ('./home.js');
                new Home(archive).initialize();
                break;
            case 'dashboard':
                const { Dashboard } = await
                import ('./dashboard.js');
                new Dashboard(archive).initialize();
                break;
        }
    }

    function checkForArchive() {
        let newArchive = new Archive(ARCHIVE_STORAGE_NAME);
        newArchive.doesArchiveExist().then(async data => {
            console.log(data)
            if (data) {
                await navigateTo('dashboard', newArchive)
            } else {
                await navigateTo('home', newArchive)
            }
        }).catch(error => {
            console.error('Error: ', error);
            return;
        });
    }
});