export function setTheme(themeName) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-oldmoney');
    document.body.classList.add(themeName);
}

export function saveTheme(themeName) {
    localStorage.setItem('app_theme', themeName);
}

export function loadTheme() {
    let theme = localStorage.getItem('app_theme');
    if (!theme) {
        theme = 'theme-light';
        saveTheme(theme);
    }
    setTheme(theme);
}