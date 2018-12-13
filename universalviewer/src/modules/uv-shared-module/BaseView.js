var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Panel"], function (require, exports, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseView = /** @class */ (function (_super) {
        __extends(BaseView, _super);
        function BaseView($element, fitToParentWidth, fitToParentHeight) {
            return _super.call(this, $element, fitToParentWidth, fitToParentHeight) || this;
        }
        BaseView.prototype.create = function () {
            this.component = this.$element.closest('.uv').data("component");
            _super.prototype.create.call(this);
            this.extension = this.component.extension;
            this.config = {};
            this.config.content = {};
            this.config.options = {};
            var that = this;
            // build config inheritance chain
            if (that.modules && that.modules.length) {
                that.modules = that.modules.reverse();
                that.modules.forEach(function (moduleName) {
                    that.config = $.extend(true, that.config, that.extension.data.config.modules[moduleName]);
                });
            }
            this.content = this.config.content;
            this.options = this.config.options;
        };
        BaseView.prototype.init = function () {
        };
        BaseView.prototype.setConfig = function (moduleName) {
            if (!this.modules) {
                this.modules = [];
            }
            this.modules.push(moduleName);
        };
        BaseView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return BaseView;
    }(Panel_1.Panel));
    exports.BaseView = BaseView;
});
