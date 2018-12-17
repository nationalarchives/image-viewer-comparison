define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events() {
        }
        Events.namespace = 'mediaelementExtension.';
        Events.MEDIA_ENDED = Events.namespace + 'mediaEnded';
        Events.MEDIA_PAUSED = Events.namespace + 'mediaPaused';
        Events.MEDIA_PLAYED = Events.namespace + 'mediaPlayed';
        return Events;
    }());
    exports.Events = Events;
});
