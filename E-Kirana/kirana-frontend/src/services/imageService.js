import apiClient from './api';

const apiBase = apiClient?.defaults?.baseURL || '';

// Returns a URL safe for use in img src. If the URL is external, return the proxy URL.
export function resolveImageUrl(url) {
    if (!url) return '';

    // Accept objects returned from backend like { url: '...', path: '...', filename: '...' }
    if (typeof url !== 'string') {
        if (url && typeof url === 'object') {
            if (typeof url.url === 'string' && url.url.trim()) url = url.url;
            else if (typeof url.path === 'string' && url.path.trim()) url = url.path;
            else if (typeof url.filename === 'string' && url.filename.trim()) url = url.filename;
            else {
                try {
                    // last resort: stringify
                    url = String(url);
                } catch (e) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    // keep data/blob urls as-is
    if (/^(data|blob):/i.test(url)) return url;

    // absolute http(s)
    if (/^https?:\/\//i.test(url)) {
        try {
            const u = new URL(url);
            const base = apiBase ? new URL(apiBase).host : null;
            if (base && u.host === base) {
                return url; // same host
            }
        } catch (e) {
            // ignore
        }
        // Return external URLs directly. Proxying to /image-proxy requires a backend route
        // which may not exist in this project and causes 500s. If you later add a proxy
        // endpoint, revert to proxying here to avoid CORS on some hosts.
        return url;
    }

    // starts with slash -> could be a frontend (vite) asset or backend-served static path
    if (url.startsWith('/')) {
        // common frontend asset folders (vite) - leave as-is so browser resolves from current origin
        if (url.startsWith('/assets') || url.startsWith('/public') || url.startsWith('/static') || url.includes('ekiranaicon')) {
            return url;
        }
        // otherwise treat as backend-served path
        return apiBase ? `${apiBase}${url}` : url;
    }

    // handle Vite-processed asset paths that may come without a leading slash (e.g. 'assets/..')
    if (url.startsWith('assets/') || url.startsWith('public/') || url.startsWith('static/') || url.includes('ekiranaicon')) {
        return url.startsWith('/') ? url : `/${url}`;
    }

    // relative path
    return apiBase ? `${apiBase}/${url}` : url;
}

export default { resolveImageUrl };
