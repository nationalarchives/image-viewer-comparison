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
    var MoreInfoDialogue = /** @class */ (function (_super) {
        __extends(MoreInfoDialogue, _super);
        function MoreInfoDialogue($element) {
            return _super.call(this, $element) || this;
        }
        MoreInfoDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('moreInfoDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_MOREINFO_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_MOREINFO_DIALOGUE;
            $.subscribe(this.openCommand, function (e, $triggerButton) {
                _this.open($triggerButton);
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.config.content = this.extension.data.config.modules.moreInfoRightPanel.content;
            this.config.options = this.extension.data.config.modules.moreInfoRightPanel.options;
            // create ui
            this.$title = $('<h1>' + this.config.content.title + '</h1>');
            this.$content.append(this.$title);
            this.$metadata = $('<div class="iiif-metadata-component"></div>');
            this.$content.append(this.$metadata);
            this.metadataComponent = new IIIFComponents.MetadataComponent({
                target: this.$metadata[0]
            });
            // hide
            this.$element.hide();
        };
        MoreInfoDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            this.metadataComponent.set(this._getData());
        };
        MoreInfoDialogue.prototype._getData = function () {
            return {
                canvasDisplayOrder: this.config.options.canvasDisplayOrder,
                canvases: this.extension.getCurrentCanvases(),
                canvasExclude: this.config.options.canvasExclude,
                canvasLabels: this.extension.getCanvasLabels(this.content.page),
                content: this.config.content,
                copiedMessageDuration: 2000,
                copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
                helper: this.extension.helper,
                licenseFormatter: null,
                limit: this.config.options.textLimit || 4,
                limitType: IIIFComponents.LimitType.LINES,
                manifestDisplayOrder: this.config.options.manifestDisplayOrder,
                manifestExclude: this.config.options.manifestExclude,
                range: this.extension.getCurrentCanvasRange(),
                rtlLanguageCodes: this.config.options.rtlLanguageCodes,
                sanitizer: function (html) {
                    return Utils_1.UVUtils.sanitize(html);
                },
                showAllLanguages: this.config.options.showAllLanguages
            };
        };
        MoreInfoDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        MoreInfoDialogue.prototype.resize = function () {
            this.setDockedPosition();
        };
        return MoreInfoDialogue;
    }(Dialogue_1.Dialogue));
    exports.MoreInfoDialogue = MoreInfoDialogue;
});
