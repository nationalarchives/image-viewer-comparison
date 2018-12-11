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
define(["require", "exports", "../uv-shared-module/FooterPanel", "../../extensions/uv-seadragon-extension/Events"], function (require, exports, FooterPanel_1, Events_1) {
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
            this.$spacer = $('<div class="spacer"></div>');
            this.$options.prepend(this.$spacer);
            this.$rotateButton = $("\n            <button class=\"btn imageBtn rotate\" title=\"" + this.content.rotateRight + "\">\n                <i class=\"uv-icon-rotate\" aria-hidden=\"true\"></i>" + this.content.rotateRight + "\n            </button>\n        ");
            this.$options.prepend(this.$rotateButton);
            this.$zoomOutButton = $("\n            <button class=\"btn imageBtn zoomOut\" title=\"" + this.content.zoomOut + "\">\n                <i class=\"uv-icon-zoom-out\" aria-hidden=\"true\"></i>" + this.content.zoomOut + "\n            </button>\n        ");
            this.$options.prepend(this.$zoomOutButton);
            this.$zoomInButton = $("\n            <button class=\"btn imageBtn zoomIn\" title=\"" + this.content.zoomIn + "\">\n                <i class=\"uv-icon-zoom-in\" aria-hidden=\"true\"></i>" + this.content.zoomIn + "\n            </button>\n        ");
            this.$options.prepend(this.$zoomInButton);
            this.$zoomInButton.onPressed(function () {
                $.publish(Events_1.Events.ZOOM_IN);
            });
            this.$zoomOutButton.onPressed(function () {
                $.publish(Events_1.Events.ZOOM_OUT);
            });
            this.$rotateButton.onPressed(function () {
                $.publish(Events_1.Events.ROTATE);
            });
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$options.css('left', Math.floor((this.$element.width() / 2) - (this.$options.width() / 2)));
        };
        return FooterPanel;
    }(FooterPanel_1.FooterPanel));
    exports.FooterPanel = FooterPanel;
});
