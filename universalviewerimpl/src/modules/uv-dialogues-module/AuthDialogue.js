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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/Dialogue", "../../Utils"], function (require, exports, BaseEvents_1, Dialogue_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthDialogue = /** @class */ (function (_super) {
        __extends(AuthDialogue, _super);
        function AuthDialogue($element) {
            return _super.call(this, $element) || this;
        }
        AuthDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('authDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_AUTH_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_AUTH_DIALOGUE;
            $.subscribe(this.openCommand, function (s, e) {
                _this.closeCallback = e.closeCallback;
                _this.confirmCallback = e.confirmCallback;
                _this.cancelCallback = e.cancelCallback;
                _this.service = e.service;
                _this.open();
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
            </div>');
            this.$buttons.prepend(this._buttonsToAdd());
            this.$message = this.$content.find('.message');
            this.$confirmButton = this.$buttons.find('.confirm');
            this.$confirmButton.text(this.content.confirm);
            this.$cancelButton = this.$buttons.find('.close');
            this.$cancelButton.text(this.content.cancel);
            this.$element.hide();
            this.$confirmButton.on('click', function (e) {
                e.preventDefault();
                if (_this.confirmCallback) {
                    _this.confirmCallback();
                }
                _this.close();
            });
            this.$cancelButton.on('click', function (e) {
                e.preventDefault();
                if (_this.cancelCallback) {
                    _this.cancelCallback();
                }
                _this.close();
            });
        };
        AuthDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
            var header = this.service.getHeader();
            var description = this.service.getDescription();
            var confirmLabel = this.service.getConfirmLabel();
            if (header) {
                this.$title.text(Utils_1.UVUtils.sanitize(header));
            }
            if (description) {
                this.$message.html(Utils_1.UVUtils.sanitize(description));
                this.$message.targetBlank();
                this.$message.find('a').on('click', function () {
                    var url = $(this).attr('href');
                    $.publish(BaseEvents_1.BaseEvents.EXTERNAL_LINK_CLICKED, [url]);
                });
            }
            if (confirmLabel) {
                this.$confirmButton.text(Utils_1.UVUtils.sanitize(confirmLabel));
            }
            this.resize();
        };
        AuthDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        AuthDialogue.prototype._buttonsToAdd = function () {
            var buttonsToAdd = '<a class="confirm btn btn-primary" href="#" target="_parent"></a>';
            // If the top button is enabled, add an additional close button for consistency.
            if (this.config.topCloseButtonEnabled) {
                buttonsToAdd += '<button class="close btn btn-default"></button>';
            }
            return buttonsToAdd;
        };
        return AuthDialogue;
    }(Dialogue_1.Dialogue));
    exports.AuthDialogue = AuthDialogue;
});
