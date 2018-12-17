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
define(["require", "exports", "../../modules/uv-dialogues-module/DownloadDialogue", "../../modules/uv-shared-module/DownloadOption", "../uv-seadragon-extension/DownloadType", "../../modules/uv-shared-module/BaseEvents"], function (require, exports, DownloadDialogue_1, DownloadOption_1, DownloadType_1, BaseEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DownloadDialogue = /** @class */ (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            return _super.call(this, $element) || this;
        }
        DownloadDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
            this.$entireFileAsOriginal = $('<li class="option single"><input id="' + DownloadOption_1.DownloadOption.entireFileAsOriginal.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption_1.DownloadOption.entireFileAsOriginal.toString() + 'label" for="' + DownloadOption_1.DownloadOption.entireFileAsOriginal.toString() + '"></label></li>');
            this.$downloadOptions.append(this.$entireFileAsOriginal);
            this.$entireFileAsOriginal.hide();
            this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
            this.$buttons.prepend(this.$downloadButton);
            var that = this;
            this.$downloadButton.on('click', function (e) {
                e.preventDefault();
                var $selectedOption = that.getSelectedOption();
                var id = $selectedOption.attr('id');
                var label = $selectedOption.attr('title');
                var type = DownloadType_1.DownloadType.UNKNOWN;
                if (_this.renderingUrls[id]) {
                    window.open(_this.renderingUrls[id]);
                }
                else {
                    var id_1 = _this.getCurrentResourceId();
                    window.open(id_1);
                }
                $.publish(BaseEvents_1.BaseEvents.DOWNLOAD, [{
                        "type": type,
                        "label": label
                    }]);
                _this.close();
            });
        };
        DownloadDialogue.prototype._isAdaptive = function () {
            var format = this.getCurrentResourceFormat();
            return format === 'mpd' || format === 'm3u8';
        };
        DownloadDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.entireFileAsOriginal) && !this._isAdaptive()) {
                var $input = this.$entireFileAsOriginal.find('input');
                var $label = this.$entireFileAsOriginal.find('label');
                var label = Utils.Strings.format(this.content.entireFileAsOriginalWithFormat, this.getCurrentResourceFormat());
                $label.text(label);
                $input.prop('title', label);
                this.$entireFileAsOriginal.show();
            }
            this.resetDynamicDownloadOptions();
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.rangeRendering)) {
                var range = this.extension.helper.getCurrentRange();
                if (range) {
                    var renderingOptions = this.getDownloadOptionsForRenderings(range, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.dynamicCanvasRenderings);
                    this.addDownloadOptionsForRenderings(renderingOptions);
                }
            }
            if (!this.$downloadOptions.find('li.option:visible').length) {
                this.$noneAvailable.show();
                this.$downloadButton.hide();
            }
            else {
                // select first option.
                this.$downloadOptions.find('li.option input:visible:first').prop('checked', true);
                this.$noneAvailable.hide();
                this.$downloadButton.show();
            }
            this.resize();
        };
        DownloadDialogue.prototype.addDownloadOptionsForRenderings = function (renderingOptions) {
            var _this = this;
            renderingOptions.forEach(function (option) {
                _this.$downloadOptions.append(option.button);
            });
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            return _super.prototype.isDownloadOptionAvailable.call(this, option);
        };
        return DownloadDialogue;
    }(DownloadDialogue_1.DownloadDialogue));
    exports.DownloadDialogue = DownloadDialogue;
});
