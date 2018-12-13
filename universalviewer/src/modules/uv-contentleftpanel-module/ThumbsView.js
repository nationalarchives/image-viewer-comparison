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
define(["require", "exports", "../uv-shared-module/ThumbsView", "../../extensions/uv-seadragon-extension/Events", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, ThumbsView_1, Events_1, Mode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ThumbsView = /** @class */ (function (_super) {
        __extends(ThumbsView, _super);
        function ThumbsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ThumbsView.prototype.create = function () {
            var _this = this;
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            // todo: this should be a setting
            $.subscribe(Events_1.Events.MODE_CHANGED, function () {
                _this.setLabel();
            });
            $.subscribe(Events_1.Events.SEARCH_PREVIEW_START, function (e, canvasIndex) {
                _this.searchPreviewStart(canvasIndex);
            });
            $.subscribe(Events_1.Events.SEARCH_PREVIEW_FINISH, function () {
                _this.searchPreviewFinish();
            });
            if (this.extension.helper.isPaged()) {
                this.$thumbs.addClass('paged');
            }
            var that = this;
            $.views.helpers({
                separator: function () {
                    // two thumbs per line
                    if (that.extension.helper.isPaged()) {
                        return ((this.data.index - 1) % 2 == 0) ? false : true;
                    }
                    return true; // default to one thumbnail per row
                }
            });
        };
        ThumbsView.prototype.addSelectedClassToThumbs = function (index) {
            var indices = this.extension.getPagedIndices(index);
            for (var i = 0; i < indices.length; i++) {
                this.getThumbByIndex(indices[i]).addClass('selected');
            }
        };
        ThumbsView.prototype.isPageModeEnabled = function () {
            // todo: move getMode to BaseExtension. call it getIndexingMode which can be Label or Index
            if (typeof this.extension.getMode === "function") {
                return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode_1.Mode.page.toString();
            }
            return this.config.options.pageModeEnabled;
        };
        ThumbsView.prototype.searchPreviewStart = function (canvasIndex) {
            this.scrollToThumb(canvasIndex);
            var $thumb = this.getThumbByIndex(canvasIndex);
            $thumb.addClass('searchpreview');
        };
        ThumbsView.prototype.searchPreviewFinish = function () {
            this.scrollToThumb(this.extension.helper.canvasIndex);
            this.getAllThumbs().removeClass('searchpreview');
        };
        ThumbsView.prototype.setLabel = function () {
            if (this.isPDF()) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').hide();
            }
            else {
                if (this.isPageModeEnabled()) {
                    $(this.$thumbs).find('span.index').hide();
                    $(this.$thumbs).find('span.label').show();
                }
                else {
                    $(this.$thumbs).find('span.index').show();
                    $(this.$thumbs).find('span.label').hide();
                }
            }
        };
        return ThumbsView;
    }(ThumbsView_1.ThumbsView));
    exports.ThumbsView = ThumbsView;
});
