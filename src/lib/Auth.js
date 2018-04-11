let accessToken = null;

export function init() {
    const queryParams = (new URL(location)).searchParams;

    if (queryParams.has('access_token')) {
        localStorage.setItem('access_token', queryParams.get('access_token'));
        window.history.replaceState({}, document.title, location.pathname);
    }

    accessToken = localStorage.getItem('access_token');
}

export function isLoggedIn() {
    return accessToken !== null;
}

export function getAccessToken() {
    return accessToken;
}
