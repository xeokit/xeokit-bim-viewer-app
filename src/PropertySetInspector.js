/**
 * @private
 */
class PropertySetInspector {

    constructor(cfg = {}) {
        this._containerElement = cfg.containerElement;
        this.setPropertySet();
    }

    setPropertySet(metaObject, propertySet) {
        const html = [];
        if (!metaObject) {
            html.push(`<p class="title">No object selected</p>`);
        } else {
            html.push(`<p class="title">${metaObject.name}</p>`);
            if (metaObject.type) {
                html.push(`<p class="subtitle">${metaObject.type}</p>`);
            }
            if (!propertySet) {
                html.push(`<p class="subtitle">No properties found.</p>`);
            } else {
                const properties = propertySet.properties || [];
                if (properties.length > 0) {
                    html.push(`<p class="subtitle">Properties:</p>
             <table class="xeokit-table"><tbody>`);
                    for (let i = 0, len = properties.length; i < len; i++) {
                        const property = properties[i];
                        html.push(`<tr><td class="td1">${property.name}:</td><td class="td2">${property.value}</td></tr>`);
                    }
                    html.push(`</tbody`);
                } else {
                    html.push(`<p class="subtitle">No properties found.</p>`);
                }
            }
        }
        const htmlStr = html.join("");
        this._containerElement.innerHTML = htmlStr;
    }

    destroy() {
        this._containerElement.innerHTML = "";
    }
}

export {PropertySetInspector};