if (typeof jQuery === "function") {
    define('jquery', [], function () {
        return jQuery;
    });
}
// IE CustomEvent Polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
    if (typeof window.CustomEvent === "function")
        return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
    return;
})();
// bundled into dist/uv.js
// - things in src/lib that are generic to all extensions
// - bundled data providers
// - UVComponent
requirejs([
    './lib/base64.min.js',
    './lib/browserdetect.js',
    './lib/detectmobilebrowser.js',
    './lib/jquery.xdomainrequest.js',
    './lib/modernizr.js',
    './lib/ex.es3.min.js',
    './lib/BaseComponent.js',
    './lib/KeyCodes.js',
    './lib/HTTPStatusCode.js',
    './lib/jquery-plugins.js',
    './lib/ba-tiny-pubsub.js',
    './lib/manifesto.js',
    './lib/manifold.js',
    './lib/Utils.js',
    './lib/xss.min.js',
    'URLDataProvider',
    'UVComponent'
], function (base64, browserdetect, detectmobilebrowser, xdomainrequest, modernizr, sanitize, exjs, basecomponent, keycodes, httpstatuscodes, jqueryplugins, pubsub, manifesto, manifold, utils, URLDataProvider, UVComponent) {
    window.UV = UVComponent.default;
    window.UV.URLDataProvider = URLDataProvider.default;
    window.dispatchEvent(new CustomEvent('uvLoaded', {}));
});
