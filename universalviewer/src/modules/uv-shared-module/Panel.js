define(["require", "exports", "./BaseEvents"], function (require, exports, BaseEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Panel = /** @class */ (function () {
        function Panel($element, fitToParentWidth, fitToParentHeight) {
            this.isResized = false;
            this.$element = $element;
            this.fitToParentWidth = fitToParentWidth || false;
            this.fitToParentHeight = fitToParentHeight || false;
            this.create();
        }
        Panel.prototype.create = function () {
            var _this = this;
            $.subscribe(BaseEvents_1.BaseEvents.RESIZE, function () {
                _this.resize();
            });
        };
        Panel.prototype.whenResized = function (cb) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this.isResized;
            }, cb);
        };
        Panel.prototype.resize = function () {
            var $parent = this.$element.parent();
            if (this.fitToParentWidth) {
                this.$element.width($parent.width());
            }
            if (this.fitToParentHeight) {
                this.$element.height($parent.height());
            }
            this.isResized = true;
        };
        return Panel;
    }());
    exports.Panel = Panel;
});
