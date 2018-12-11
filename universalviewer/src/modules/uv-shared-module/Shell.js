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
define(["require", "exports", "./BaseEvents", "./BaseView", "./GenericDialogue"], function (require, exports, BaseEvents_1, BaseView_1, GenericDialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shell = /** @class */ (function (_super) {
        __extends(Shell, _super);
        function Shell($element) {
            var _this = this;
            Shell.$element = $element;
            _this = _super.call(this, Shell.$element, true, true) || this;
            return _this;
        }
        Shell.prototype.create = function () {
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_OVERLAY, function () {
                Shell.$overlays.show();
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_OVERLAY, function () {
                Shell.$overlays.hide();
            });
            Shell.$headerPanel = $('<div class="headerPanel"></div>');
            Shell.$element.append(Shell.$headerPanel);
            Shell.$mainPanel = $('<div class="mainPanel"></div>');
            Shell.$element.append(Shell.$mainPanel);
            Shell.$centerPanel = $('<div class="centerPanel"></div>');
            Shell.$mainPanel.append(Shell.$centerPanel);
            Shell.$leftPanel = $('<div class="leftPanel"></div>');
            Shell.$mainPanel.append(Shell.$leftPanel);
            Shell.$rightPanel = $('<div class="rightPanel"></div>');
            Shell.$mainPanel.append(Shell.$rightPanel);
            Shell.$footerPanel = $('<div class="footerPanel"></div>');
            Shell.$element.append(Shell.$footerPanel);
            Shell.$mobileFooterPanel = $('<div class="mobileFooterPanel"></div>');
            Shell.$element.append(Shell.$mobileFooterPanel);
            Shell.$overlays = $('<div class="overlays"></div>');
            Shell.$element.append(Shell.$overlays);
            Shell.$genericDialogue = $('<div class="overlay genericDialogue" aria-hidden="true"></div>');
            Shell.$overlays.append(Shell.$genericDialogue);
            Shell.$overlays.on('click', function (e) {
                if ($(e.target).hasClass('overlays')) {
                    e.preventDefault();
                    $.publish(BaseEvents_1.BaseEvents.CLOSE_ACTIVE_DIALOGUE);
                }
            });
            // create shared views.
            new GenericDialogue_1.GenericDialogue(Shell.$genericDialogue);
        };
        Shell.prototype.resize = function () {
            _super.prototype.resize.call(this);
            Shell.$overlays.width(this.extension.width());
            Shell.$overlays.height(this.extension.height());
            var mainHeight = this.$element.height() - parseInt(Shell.$mainPanel.css('paddingTop'))
                - (Shell.$headerPanel.is(':visible') ? Shell.$headerPanel.height() : 0)
                - (Shell.$footerPanel.is(':visible') ? Shell.$footerPanel.height() : 0)
                - (Shell.$mobileFooterPanel.is(':visible') ? Shell.$mobileFooterPanel.height() : 0);
            Shell.$mainPanel.height(mainHeight);
        };
        return Shell;
    }(BaseView_1.BaseView));
    exports.Shell = Shell;
});
