document.addEventListener('DOMContentLoaded', () => {
    // Keybinding
    const setkeybind = document.getElementById('setkeybind');
    const output = document.getElementById('output');
    let keybind = localStorage.getItem('keybind') || '~'; // Default keybinding
    output.textContent = `Current key: ${keybind}`;

    setkeybind.addEventListener('click', () => {
        output.textContent = 'Listening...';
        document.removeEventListener('keydown', keydownHandler);
        document.addEventListener('keydown', keydownHandler);
    });

    function keydownHandler(event) {
        if (event.key.length === 1) { // Ignore special keys
            keybind = event.key;
            localStorage.setItem('keybind', keybind);
            output.textContent = `Selected Key: ${keybind}`;
            document.removeEventListener('keydown', keydownHandler);
        } else {
            output.textContent = 'Invalid key. Try again.';
        }
    }

    // Panic Site Selection
    const tabselect = document.getElementById('tabselect');
    const confirmtab = document.getElementById('confirmtab');
    const savedIndex = localStorage.getItem('tabselectIndex');
    const savedSite = localStorage.getItem('sitefortab') || 'https://canvas.instructure.com/login/canvas';

    if (savedIndex !== null) tabselect.selectedIndex = savedIndex;

    confirmtab.addEventListener('click', () => {
        const selectedValue = tabselect.value;
        localStorage.setItem('sitefortab', selectedValue);
        localStorage.setItem('tabselectIndex', tabselect.selectedIndex);
        alert(`Panic site set to ${selectedValue}`);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === keybind) {
            window.location.href = savedSite;
        }
    });

    // Gatekeeping Mode
    const gatekeepButton = document.getElementById('gatekeep-button');
    const gatekeepStatus = document.getElementById('gatekeep-status');
    const logo = document.querySelector('.logo');
    const title = document.getElementById('title');
    let gatekeepMode = localStorage.getItem('gatekeepMode') === 'true';

    function updateGatekeepUI() {
        if (gatekeepMode) {
            logo.style.display = 'none';
            title.style.display = 'none';
            gatekeepStatus.textContent = 'Gatekeep Mode is ON';
        } else {
            logo.style.display = 'block';
            title.style.display = 'block';
            gatekeepStatus.textContent = 'Gatekeep Mode is OFF';
        }
    }

    gatekeepButton.addEventListener('click', () => {
        gatekeepMode = !gatekeepMode;
        localStorage.setItem('gatekeepMode', gatekeepMode);
        updateGatekeepUI();
    });

    updateGatekeepUI();

    // Tab Cloaking
    const faviconDropdown = document.getElementById('faviconDropdown');
    const presets = {
        'Google Search': { title: 'calculator - Google Search', favicon: 'https://www.google.com/favicon.ico' },
      'Google Doc': { title: 'Untitled document - Google Docs', favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico' },
      'Google Slides': { title: 'Untitled Presentation - Google Slides', favicon: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico' },
      'Powerpoint': { title: 'Presentation.pptx - Microsoft PowerPoint Online', favicon: 'https://res-1.cdn.office.net/officeonline/pods/s/h25FD28BFF140E152_resources/1033/FavIcon_Ppt.ico' },
      'Word Document': { title: 'Document.docx - Microsoft Word Online', favicon: 'https://res-1.cdn.office.net/officeonline/wv/s/h4FBD8CC4075E1795_resources/1033/FavIcon_Word.ico' },
      'Google': { title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
      'Google Classroom': { title: 'Home', favicon: 'https://ssl.gstatic.com//classroom//favicon.png' },
      'Gmail': { title: 'Gmail', favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
      'Google Drive': { title: 'Home - Google Drive', favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
      'Bing': { title: 'Bing', favicon: 'https://www.bing.com/favicon.ico' },
      'Outlook': { title: 'Outlook', favicon: 'https://outlook.live.com/owa/favicon.ico' },
      'OneDrive': { title: 'My files - OneDrive', favicon: 'https://onedrive.live.com/favicon.ico' },
      'Wikipedia': { title: 'Wikipedia', favicon: 'https://en.wikipedia.org/favicon.ico' },
      'Edpuzzle': { title: 'Edpuzzle', favicon: 'https://edpuzzle.imgix.net/favicons/favicon-32.png' },
      'IXL': { title: 'IXL | Math, Language Arts, Science, Social Studies, and Spanish', favicon: 'https://www.ixl.com/favicon.ico' },
      'Canvas': { title: 'Log In to Canvas', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
      'Khan Academy': { title: 'Khan Academy | Free Online Courses, Lessons & Practice', favicon: 'https://cdn.kastatic.org/images/favicon.ico' },
      'YouTube': { title: 'YouTube', favicon: 'https://www.youtube.com/s/desktop/eb72fb02/img/favicon.ico' },
    };

    Object.keys(presets).forEach((preset) => {
        const option = document.createElement('option');
        option.value = preset;
        option.textContent = preset;
        faviconDropdown.appendChild(option);
    });

    faviconDropdown.addEventListener('change', (event) => {
        const selected = presets[event.target.value];
        if (selected) {
            document.title = selected.title;
            let link = document.querySelector('link[rel="shortcut icon"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'shortcut icon';
                document.head.appendChild(link);
            }
            link.href = selected.favicon;
            localStorage.setItem('pageTitle', selected.title);
            localStorage.setItem('faviconUrl', selected.favicon);
        }
    });

    const savedFavicon = localStorage.getItem('faviconUrl');
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedFavicon && savedTitle) {
        let link = document.querySelector('link[rel="shortcut icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
        }
        link.href = savedFavicon;
        document.title = savedTitle;
    }
});

export default {
    async fetch(request, env, ctx) {
      return new Response('Hello World!');
    },
  };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJfnXe0F8cbyGRjUjzFR0cQ2XtrQA3D0Y",
  authDomain: "unblocked-games-2463f.firebaseapp.com",
  projectId: "unblocked-games-2463f",
  storageBucket: "unblocked-games-2463f.firebasestorage.app",
  messagingSenderId: "307639206620",
  appId: "1:307639206620:web:d6bfa938357b1d4fe86a19",
  measurementId: "G-R02L8MPBB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);