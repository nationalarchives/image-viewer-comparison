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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/Dialogue"], function (require, exports, BaseEvents_1, Dialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HelpDialogue = /** @class */ (function (_super) {
        __extends(HelpDialogue, _super);
        function HelpDialogue($element) {
            return _super.call(this, $element) || this;
        }
        HelpDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('helpDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_HELP_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_HELP_DIALOGUE;
            $.subscribe(this.openCommand, function () {
                _this.open();
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$scroll = $('<div class="scroll"></div>');
            this.$content.append(this.$scroll);
            this.$message = $('<p></p>');
            this.$scroll.append(this.$message);
            // initialise ui.
            this.$title.text(this.content.title);
            this.$message.html(this.content.text);
            // ensure anchor tags link to _blank.
            this.$message.targetBlank();
            this.$element.hide();
        };
        HelpDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return HelpDialogue;
    }(Dialogue_1.Dialogue));
    exports.HelpDialogue = HelpDialogue;
});
