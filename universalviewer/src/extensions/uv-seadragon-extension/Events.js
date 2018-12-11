define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events() {
        }
        Events.namespace = 'openseadragonExtension.';
        Events.CURRENT_VIEW_URI = Events.namespace + 'currentViewUri';
        Events.IMAGE_SEARCH = Events.namespace + 'imageSearch';
        Events.MODE_CHANGED = Events.namespace + 'modeChanged';
        Events.NEXT_SEARCH_RESULT = Events.namespace + 'nextSearchResult';
        Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE = Events.namespace + 'nextImagesSearchResultUnavailable';
        Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE = Events.namespace + 'prevImagesSearchResultUnavailable';
        Events.PAGE_SEARCH = Events.namespace + 'pageSearch';
        Events.PAGING_TOGGLED = Events.namespace + 'pagingToggled';
        Events.PREV_SEARCH_RESULT = Events.namespace + 'prevSearchResult';
        Events.PRINT = Events.namespace + 'print';
        Events.ROTATE = Events.namespace + 'rotate';
        Events.SEADRAGON_ANIMATION_FINISH = Events.namespace + 'animationFinish';
        Events.SEADRAGON_ANIMATION_START = Events.namespace + 'animationStart';
        Events.SEADRAGON_ANIMATION = Events.namespace + 'animation';
        Events.SEADRAGON_OPEN = Events.namespace + 'open';
        Events.SEADRAGON_RESIZE = Events.namespace + 'resize';
        Events.SEADRAGON_ROTATION = Events.namespace + 'rotationChanged';
        Events.SEARCH_PREVIEW_FINISH = Events.namespace + 'searchPreviewFinish';
        Events.SEARCH_PREVIEW_START = Events.namespace + 'searchPreviewStart';
        Events.SEARCH = Events.namespace + 'search';
        Events.XYWH_CHANGED = Events.namespace + 'xywhChanged';
        Events.ZOOM_IN = Events.namespace + 'zoomIn';
        Events.ZOOM_OUT = Events.namespace + 'zoomOut';
        return Events;
    }());
    exports.Events = Events;
});
