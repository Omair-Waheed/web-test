
/* =========================================================
   1867 ROYAL CANADIAN ARMY CADET CORPS
   Main JavaScript

   Sections:
   1. Mobile Navigation
   2. Mobile Dropdowns
   3. Navigation Keyboard Accessibility
   4. Theme Management
   5. Copyright Year
========================================================= */


/* =========================================================
   1. MOBILE NAVIGATION
========================================================= */

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {

    // Open or close the main navigation
    navToggle.addEventListener('click', () => {

        const isExpanded =
            navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute(
            'aria-expanded',
            String(!isExpanded)
        );

        navToggle.setAttribute(
            'aria-label',
            isExpanded ? 'Open navigation' : 'Close navigation'
        );

        mainNav.classList.toggle('active', !isExpanded);

    });


    // Close navigation when clicking outside it
    document.addEventListener('click', (event) => {

        if (
            !mainNav.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeNavigation();
        }

    });


    // Shared function to close navigation
    function closeNavigation() {

        mainNav.classList.remove('active');

        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');

        // Also close any expanded dropdowns
        mainNav.querySelectorAll('.has-dropdown.open')
            .forEach(item => {

                item.classList.remove('open');

                const trigger = item.querySelector(':scope > a');

                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                }

            });

    }

}


/* =========================================================
   2. MOBILE DROPDOWNS
========================================================= */

const dropdownItems = document.querySelectorAll('.has-dropdown');

dropdownItems.forEach(item => {

    const trigger = item.querySelector(':scope > a');
    const dropdown = item.querySelector(':scope > .dropdown');

    if (!trigger || !dropdown) {
        return;
    }

    // Identify the submenu for accessibility
    const dropdownId =
        'dropdown-' + Math.random().toString(36).slice(2, 10);

    dropdown.id = dropdownId;

    trigger.setAttribute('aria-controls', dropdownId);
    trigger.setAttribute('aria-expanded', 'false');

    // Toggle dropdown on mobile
    trigger.addEventListener('click', (event) => {

        // Desktop navigation retains normal link behaviour
        if (window.innerWidth > 1000) {
            return;
        }

        // First click expands the submenu
        if (!item.classList.contains('open')) {

            event.preventDefault();

            // Close other dropdowns
            dropdownItems.forEach(otherItem => {

                if (otherItem !== item) {

                    otherItem.classList.remove('open');

                    const otherTrigger =
                        otherItem.querySelector(':scope > a');

                    if (otherTrigger) {
                        otherTrigger.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    }

                }

            });

            item.classList.add('open');

            trigger.setAttribute('aria-expanded', 'true');

        } else {

            // Second click follows the parent page link

            item.classList.remove('open');

            trigger.setAttribute('aria-expanded', 'false');

        }

    });

});


/* =========================================================
   3. NAVIGATION KEYBOARD ACCESSIBILITY
========================================================= */

// Escape closes the mobile navigation
document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape' && navToggle && mainNav) {

        const isOpen =
            navToggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {

            mainNav.classList.remove('active');

            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation');

            navToggle.focus();

        }

        // Close any open dropdowns
        dropdownItems.forEach(item => {

            item.classList.remove('open');

            const trigger = item.querySelector(':scope > a');

            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }

        });

    }

});


/* =========================================================
   4. THEME MANAGEMENT
========================================================= */

const themeToggle = document.getElementById('theme-toggle');

const htmlElement = document.documentElement;

const systemTheme = window.matchMedia(
    '(prefers-color-scheme: dark)'
);

// Available themes:
// light = Always light
// dark = Always dark
// system = Follow device preference

const validThemes = ['light', 'dark', 'system'];


// Read saved theme preference
function getSavedTheme() {

    try {

        const savedTheme = localStorage.getItem('site-theme');

        if (validThemes.includes(savedTheme)) {
            return savedTheme;
        }

    } catch (error) {

        // localStorage may be unavailable
    }

    return 'system';

}


// Apply selected theme
function applyTheme(theme) {

    if (!validThemes.includes(theme)) {
        theme = 'system';
    }

    if (theme === 'system') {

        // Remove override so CSS follows system preference
        htmlElement.removeAttribute('data-theme');

    } else {

        htmlElement.setAttribute('data-theme', theme);

    }

    updateThemeButton(theme);

}


// Update theme button appearance and accessibility
function updateThemeButton(theme) {

    if (!themeToggle) {
        return;
    }

    const icon = themeToggle.querySelector('.theme-icon');

    const effectiveTheme =
        theme === 'system'
            ? (systemTheme.matches ? 'dark' : 'light')
            : theme;

    if (icon) {

        icon.textContent =
            effectiveTheme === 'dark' ? '☀' : '☾';

    }

    themeToggle.setAttribute(
        'aria-label',
        `Current theme: ${theme}. Activate to change theme.`
    );

    themeToggle.setAttribute(
        'title',
        `Current theme: ${theme}`
    );

}


// Save theme preference
function saveTheme(theme) {

    try {

        localStorage.setItem('site-theme', theme);

    } catch (error) {

        // Continue without saved preference
    }

}


// Initialize theme
let currentTheme = getSavedTheme();

applyTheme(currentTheme);


// Cycle through available themes when button is clicked
if (themeToggle) {

    themeToggle.addEventListener('click', () => {

        const currentIndex = validThemes.indexOf(currentTheme);

        const nextIndex =
            (currentIndex + 1) % validThemes.length;

        currentTheme = validThemes[nextIndex];

        saveTheme(currentTheme);

        applyTheme(currentTheme);

    });

}


// Update appearance when system preference changes
systemTheme.addEventListener('change', () => {

    if (currentTheme === 'system') {
        applyTheme('system');
    }

});


/* =========================================================
   5. COPYRIGHT YEAR
========================================================= */

const copyrightYear = document.getElementById('copyright-year');

if (copyrightYear) {

    copyrightYear.textContent = new Date().getFullYear();

}
