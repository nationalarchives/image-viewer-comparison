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
    var ExternalContentDialogue = /** @class */ (function (_super) {
        __extends(ExternalContentDialogue, _super);
        function ExternalContentDialogue($element) {
            return _super.call(this, $element) || this;
        }
        ExternalContentDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('externalContentDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_EXTERNALCONTENT_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_EXTERNALCONTENT_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.open();
                _this.$iframe.prop('src', params.uri);
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$iframe = $('<iframe></iframe>');
            this.$content.append(this.$iframe);
            this.$element.hide();
        };
        ExternalContentDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$iframe.width(this.$content.width());
            this.$iframe.height(this.$content.height());
        };
        return ExternalContentDialogue;
    }(Dialogue_1.Dialogue));
    exports.ExternalContentDialogue = ExternalContentDialogue;
});
