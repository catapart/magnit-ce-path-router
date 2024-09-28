import { PathRouterElement, PathRouterEvent } from "./path-router";

export const COMPONENT_TAG_NAME = 'route-button';
export class RouteButtonComponent extends HTMLButtonElement
{
    constructor()
    {
        super();
    }
    connectedCallback()
    {
        const target = this.#getTargetRouter();
        if(target != null)
        {
            target.addEventListener(PathRouterEvent.PathChange, this.#setIsCurrent.bind(this));
            this.addEventListener('click', this.onClick.bind(this, target));
        }
        else
        {
            console.warn('No path router found. Clicking this button will have no navigation effect');
        }
    }

    onClick(target: PathRouterElement)
    {
        let path = this.getAttribute('path') ?? this.getAttribute('data-path') ?? "";
        path = this.#preparePath();
        target.navigate(path);
    }

    #getTargetRouter()
    {
        const forTargetAttribute = this.getAttribute('for');
        const targetAttribute = this.getAttribute('target');
        const selector = (forTargetAttribute != null) 
        ? `#${forTargetAttribute}`
        : (targetAttribute != null)
        ? targetAttribute
        : 'path-router';

        const target: PathRouterElement|null = (this.getRootNode() as Document|ShadowRoot).querySelector(selector) as PathRouterElement;
        return target;
    }

    #setIsCurrent()
    {
        const linkPath = this.getAttribute('path');
        if(linkPath == null) { return; }

        const target = this.#getTargetRouter();
        if(target == null) { return; }

        const targetRouter = target;        
        if(targetRouter.pathIsActive(linkPath))
        {
            this.setAttribute('aria-current', "page");
        }
        else
        {
            this.removeAttribute('aria-current');
        }
    }

    #preparePath()
    {
        let path = this.getAttribute('path') ?? this.getAttribute('data-path') ?? "";
        path = this.onPreparePath(path);
        return path;
    }
    /**
     * An override-able string transformation function for preparing the static path attribute value.
     * @param staticPath the path that is set in the route-link's html
     * @returns a new path that has been transformed to the exact path expected for navigation
     * @description Useful for replacing variables.
     */
    onPreparePath(staticPath: string) { return staticPath; }
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, RouteButtonComponent, { extends: 'button' });
}