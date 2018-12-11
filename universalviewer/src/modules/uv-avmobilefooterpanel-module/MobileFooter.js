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
define(["require", "exports", "../uv-shared-module/FooterPanel"], function (require, exports, FooterPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FooterPanel = /** @class */ (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            return _super.call(this, $element) || this;
        }
        FooterPanel.prototype.create = function () {
            this.setConfig('mobileFooterPanel');
            _super.prototype.create.call(this);
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$options.css('left', Math.floor((this.$element.width() / 2) - (this.$options.width() / 2)));
        };
        return FooterPanel;
    }(FooterPanel_1.FooterPanel));
    exports.FooterPanel = FooterPanel;
});
