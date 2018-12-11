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
define(["require", "exports", "./Events", "../../modules/uv-dialogues-module/ShareDialogue"], function (require, exports, Events_1, ShareDialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShareDialogue = /** @class */ (function (_super) {
        __extends(ShareDialogue, _super);
        function ShareDialogue($element) {
            var _this = _super.call(this, $element) || this;
            $.subscribe(Events_1.Events.SEADRAGON_OPEN, function () {
                _this.update();
            });
            $.subscribe(Events_1.Events.SEADRAGON_ANIMATION_FINISH, function () {
                _this.update();
            });
            return _this;
        }
        ShareDialogue.prototype.create = function () {
            this.setConfig('shareDialogue');
            _super.prototype.create.call(this);
        };
        ShareDialogue.prototype.update = function () {
            _super.prototype.update.call(this);
            var xywh = this.extension.getViewportBounds();
            var rotation = this.extension.getViewerRotation();
            this.code = this.extension.getEmbedScript(this.options.embedTemplate, this.currentWidth, this.currentHeight, xywh, rotation);
            this.$code.val(this.code);
        };
        ShareDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return ShareDialogue;
    }(ShareDialogue_1.ShareDialogue));
    exports.ShareDialogue = ShareDialogue;
});
