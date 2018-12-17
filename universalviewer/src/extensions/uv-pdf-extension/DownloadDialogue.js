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
define(["require", "exports", "../../modules/uv-dialogues-module/DownloadDialogue"], function (require, exports, DownloadDialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DownloadDialogue = /** @class */ (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            return _super.call(this, $element) || this;
        }
        DownloadDialogue.prototype.create = function () {
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
        };
        DownloadDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            this.addEntireFileDownloadOptions();
            if (!this.$downloadOptions.find('li:visible').length) {
                this.$noneAvailable.show();
            }
            else {
                // select first option.
                this.$noneAvailable.hide();
            }
            this.resize();
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            return _super.prototype.isDownloadOptionAvailable.call(this, option);
        };
        return DownloadDialogue;
    }(DownloadDialogue_1.DownloadDialogue));
    exports.DownloadDialogue = DownloadDialogue;
});
