define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events() {
        }
        Events.namespace = 'pdfExtension.';
        Events.PDF_LOADED = Events.namespace + 'pdfLoaded';
        Events.PAGE_INDEX_CHANGED = Events.namespace + 'pageIndexChanged';
        Events.SEARCH = Events.namespace + 'search';
        return Events;
    }());
    exports.Events = Events;
});
