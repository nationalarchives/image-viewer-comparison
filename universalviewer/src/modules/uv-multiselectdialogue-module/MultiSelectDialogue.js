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
define(["require", "exports", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/Dialogue", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, BaseEvents_1, Dialogue_1, Mode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultiSelectDialogue = /** @class */ (function (_super) {
        __extends(MultiSelectDialogue, _super);
        function MultiSelectDialogue($element) {
            return _super.call(this, $element) || this;
        }
        MultiSelectDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('multiSelectDialogue');
            _super.prototype.create.call(this);
            var that = this;
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_MULTISELECT_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_MULTISELECT_DIALOGUE;
            $.subscribe(this.openCommand, function () {
                _this.open();
                var multiSelectState = _this.extension.helper.getMultiSelectState();
                multiSelectState.setEnabled(true);
                _this.galleryComponent.set(_this.data);
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
                var multiSelectState = _this.extension.helper.getMultiSelectState();
                multiSelectState.setEnabled(false);
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$title.text(this.content.title);
            this.$gallery = $('<div class="iiif-gallery-component"></div>');
            this.$content.append(this.$gallery);
            this.data = {
                helper: this.extension.helper,
                chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
                content: this.config.content,
                debug: false,
                imageFadeInDuration: 300,
                initialZoom: 4,
                minLabelWidth: 20,
                pageModeEnabled: this.isPageModeEnabled(),
                searchResults: [],
                scrollStopDuration: 100,
                sizingEnabled: true,
                thumbHeight: this.config.options.galleryThumbHeight,
                thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
                thumbWidth: this.config.options.galleryThumbWidth,
                viewingDirection: this.extension.helper.getViewingDirection()
            };
            this.galleryComponent = new IIIFComponents.GalleryComponent({
                target: this.$gallery[0]
            });
            var $selectButton = this.$gallery.find('a.select');
            $selectButton.addClass('btn btn-primary');
            this.galleryComponent.on('multiSelectionMade', function (ids) {
                $.publish(BaseEvents_1.BaseEvents.MULTISELECTION_MADE, [ids]);
                that.close();
            }, false);
            this.$element.hide();
        };
        MultiSelectDialogue.prototype.isPageModeEnabled = function () {
            return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && this.extension.getMode().toString() === Mode_1.Mode.page.toString();
        };
        MultiSelectDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
        };
        MultiSelectDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        MultiSelectDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var $main = this.$gallery.find('.main');
            var $header = this.$gallery.find('.header');
            $main.height(this.$content.height() - this.$title.outerHeight() - this.$title.verticalMargins() - $header.height());
        };
        return MultiSelectDialogue;
    }(Dialogue_1.Dialogue));
    exports.MultiSelectDialogue = MultiSelectDialogue;
});
