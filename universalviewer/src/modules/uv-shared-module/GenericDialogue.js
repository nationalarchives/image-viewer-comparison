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
define(["require", "exports", "./BaseEvents", "./Dialogue"], function (require, exports, BaseEvents_1, Dialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenericDialogue = /** @class */ (function (_super) {
        __extends(GenericDialogue, _super);
        function GenericDialogue($element) {
            return _super.call(this, $element) || this;
        }
        GenericDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('genericDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_GENERIC_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_GENERIC_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.acceptCallback = params.acceptCallback;
                _this.showMessage(params);
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$message = $('<p></p>');
            this.$content.append(this.$message);
            this.$acceptButton = $("\n          <button class=\"btn btn-primary accept default\">\n            " + this.content.ok + "\n          </button>\n        ");
            this.$buttons.append(this.$acceptButton);
            // Hide the redundant close button
            this.$buttons.find('.close').hide();
            this.$acceptButton.onPressed(function () {
                _this.accept();
            });
            this.returnFunc = function () {
                if (_this.isActive) {
                    _this.accept();
                }
            };
            this.$element.hide();
        };
        GenericDialogue.prototype.accept = function () {
            $.publish(BaseEvents_1.BaseEvents.CLOSE_ACTIVE_DIALOGUE);
            if (this.acceptCallback)
                this.acceptCallback();
        };
        GenericDialogue.prototype.showMessage = function (params) {
            this.$message.html(params.message);
            if (params.buttonText) {
                this.$acceptButton.text(params.buttonText);
            }
            else {
                this.$acceptButton.text(this.content.ok);
            }
            if (params.allowClose === false) {
                this.disableClose();
            }
            this.open();
        };
        GenericDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return GenericDialogue;
    }(Dialogue_1.Dialogue));
    exports.GenericDialogue = GenericDialogue;
});
