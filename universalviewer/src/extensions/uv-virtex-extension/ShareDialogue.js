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
define(["require", "exports", "../../modules/uv-dialogues-module/ShareDialogue"], function (require, exports, ShareDialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShareDialogue = /** @class */ (function (_super) {
        __extends(ShareDialogue, _super);
        function ShareDialogue($element) {
            return _super.call(this, $element) || this;
        }
        ShareDialogue.prototype.create = function () {
            this.setConfig('shareDialogue');
            _super.prototype.create.call(this);
        };
        ShareDialogue.prototype.update = function () {
            _super.prototype.update.call(this);
            this.code = this.extension.getEmbedScript(this.options.embedTemplate, this.currentWidth, this.currentHeight);
            this.$code.val(this.code);
        };
        ShareDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return ShareDialogue;
    }(ShareDialogue_1.ShareDialogue));
    exports.ShareDialogue = ShareDialogue;
});
