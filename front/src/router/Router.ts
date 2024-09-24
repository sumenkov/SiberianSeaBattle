
interface Route {
    path: string;
    html: string | (() => string);
    js?: () => Promise<any>
}

type ApplyRouteMiddleware = (to: string) => void;

class Router {

    public routes: Route[] = [];
    public container: HTMLElement | null = null;
    public applyRouteMiddlewares: ApplyRouteMiddleware[] = [];

    init(containerSelector: string) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`DOM Element ${containerSelector} not fount on page`);
        }

    }

    registerMiddleware(fn: ApplyRouteMiddleware) {
        this.applyRouteMiddlewares = this.applyRouteMiddlewares.concat(fn);
    }

    registerRoute(
        path: string,
        html: string | (() => string),
        js?: () => Promise<any>
    ) {
        this.routes = this.routes.concat({
            path,
            html,
            js
        });
    }

    followURL(link: string) {

        const isFull =
            link.indexOf('http://') === 0 ||
            link.indexOf('https://') === 0;

        if (!isFull) {

            if (link.charAt(0) === '/') {
                link = link.substring(1);
            }

            link = 'http://' + window.location.host + '/' + link;
        }

        try {
            const url = new URL(link);
            const query = url.searchParams.toString();
            const postfix = query ? `?${query}` : '';
            window.history.pushState({}, '', url.pathname + postfix);
            this.applyRoute();
        } catch { }

    }

    overrideLinkClick(e: MouseEvent) {

        const target = e.target as HTMLElement;

        if (target.tagName === 'A') {

            e.preventDefault();
            const href = (e.target as HTMLElement).getAttribute('href');

            if (href) {
                this.followURL(href);
            }

        }
    }

    protected renderHtml(html: string | (() => string)) {

        if (!this.container) {
            throw new Error('Cannot render - no container provided');
        }

        if (typeof html === 'function') {
            this.container.innerHTML = html();
            return;
        }

        this.container.innerHTML = html;

    }

    routerifyLink(link: HTMLLinkElement) {
        link.addEventListener('click', this.overrideLinkClick);
    }

    applyRoute() {

        const match = this.routes.find((r) => r.path === window.location.pathname);

        if (match) {

            for (const mw of this.applyRouteMiddlewares) {
                mw(match.path);
            }

            this.renderHtml(match.html);

            if (match.js) {
                match.js().then((module) => {
                    if (typeof module?.default === 'function') {
                        module.default();
                    }
                });
            }
        }

    }

    get path() {
        if (window.location.pathname === '') {
            return '/';
        }
        return window.location.pathname.replace(/\/$/, '');
    }
}

export default Router;

