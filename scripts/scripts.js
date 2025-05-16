document.addEventListener('DOMContentLoaded', () => {
    // --- UI Element Selectors ---
    const setkeybindBtn = document.getElementById('setkeybind');
    const outputDisplay = document.getElementById('output');
    const tabSelectDropdown = document.getElementById('tabselect');
    const confirmTabBtn = document.getElementById('confirmtab');
    const gatekeepBtn = document.getElementById('gatekeep-button');
    const gatekeepStatusDisplay = document.getElementById('gatekeep-status');
    const faviconDropdown = document.getElementById('faviconDropdown');
    const logoElement = document.querySelector('.logo');  // Ensure this exists in your HTML
    const titleElement = document.getElementById('title');      // Ensure this exists in your HTML
    const gameFrame = document.getElementById('gameframe'); // Get the gameframe


    // --- State Variables ---
    let keybind = localStorage.getItem('keybind') || '~';
    let panicSite = localStorage.getItem('sitefortab') || 'https://canvas.instructure.com/login/canvas';
    let gatekeepMode = localStorage.getItem('gatekeepMode') === 'true';

    // --- Event Handlers ---

    /**
     * Handles the keydown event for setting the panic key.
     */
    function handleKeydown(event) {
        if (event.key.length === 1) {
            keybind = event.key;
            localStorage.setItem('keybind', keybind);
            outputDisplay.textContent = `Selected Key: ${keybind}`;
            document.removeEventListener('keydown', handleKeydown);
        } else {
            outputDisplay.textContent = 'Invalid key. Try again.';
        }
    }

    /**
     * Handles the click event for the "Set Key" button.
     */
    function handleSetKeybindClick() {
        outputDisplay.textContent = 'Listening...';
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Handles the click event for the "Confirm" button to set the panic site.
     */
    function handleConfirmTabClick() {
        const selectedValue = tabSelectDropdown.value;
        panicSite = selectedValue;
        localStorage.setItem('sitefortab', selectedValue);
        localStorage.setItem('tabselectIndex', tabSelectDropdown.selectedIndex);
        alert(`Panic site set to ${selectedValue}`);
    }

    /**
     * Handles the click event for the "Gatekeep" button.
     */
    function handleGatekeepClick() {
        gatekeepMode = !gatekeepMode;
        localStorage.setItem('gatekeepMode', gatekeepMode);
        updateGatekeepUI();
    }

     /**
     * Handles the change event for the favicon dropdown.
     */
    function handleFaviconChange(event) {
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
    }

    /**
     * Updates the Gatekeep UI based on the current gatekeepMode.
     */
    function updateGatekeepUI() {
        if (gatekeepMode) {
            logoElement.style.display = 'none';
            titleElement.style.display = 'none';
            gatekeepStatusDisplay.textContent = 'Gatekeep Mode is ON';
        } else {
            logoElement.style.display = 'block';
            titleElement.style.display = 'block';
            gatekeepStatusDisplay.textContent = 'Gatekeep Mode is OFF';
        }
    }

    /**
     * Loads saved settings from localStorage.
     */
    function loadSavedSettings() {
        const savedIndex = localStorage.getItem('tabselectIndex');
        const savedFavicon = localStorage.getItem('faviconUrl');
        const savedTitle = localStorage.getItem('pageTitle');


        if (savedIndex !== null) {
            tabSelectDropdown.selectedIndex = savedIndex;
        }

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
    }

    // --- Initialization ---

    // Set initial UI state
    outputDisplay.textContent = `Current key: ${keybind}`;
    updateGatekeepUI();
    loadSavedSettings();
    registerServiceWorker(); // Register the service worker

    // Attach event listeners
    setkeybindBtn.addEventListener('click', handleSetKeybindClick);
    confirmTabBtn.addEventListener('click', handleConfirmTabClick);
    gatekeepBtn.addEventListener('click', handleGatekeepClick);
    faviconDropdown.addEventListener('change', handleFaviconChange);


    // --- Global Event Listeners ---

    // Panic key redirection
    document.addEventListener('keydown', (event) => {
        if (event.key === keybind) {
            window.location.href = panicSite;
        }
    });

    // --- Tab Cloaking Data ---
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
});