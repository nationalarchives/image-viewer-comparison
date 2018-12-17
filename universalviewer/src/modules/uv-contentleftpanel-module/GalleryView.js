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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/BaseView"], function (require, exports, BaseEvents_1, BaseView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GalleryView = /** @class */ (function (_super) {
        __extends(GalleryView, _super);
        function GalleryView($element) {
            var _this = _super.call(this, $element, true, true) || this;
            _this.isOpen = false;
            return _this;
        }
        GalleryView.prototype.create = function () {
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            // search preview doesn't work well with the gallery because it loads thumbs in "chunks"
            // $.subscribe(Events.SEARCH_PREVIEW_START, (e, canvasIndex) => {
            //     this.galleryComponent.searchPreviewStart(canvasIndex);
            // });
            // $.subscribe(Events.SEARCH_PREVIEW_FINISH, () => {
            //     this.galleryComponent.searchPreviewFinish();
            // });
            this.$gallery = $('<div class="iiif-gallery-component"></div>');
            this.$element.append(this.$gallery);
            // stencil.js demo
            // const gallery = document.createElement('iiif-gallery');
            // gallery.setAttribute('manifest', this.extension.helper.manifest.id);
            // this.$element[0].appendChild(gallery);
        };
        GalleryView.prototype.setup = function () {
            this.galleryComponent = new IIIFComponents.GalleryComponent({
                target: this.$gallery[0]
            });
            this.galleryComponent.on('thumbSelected', function (thumb) {
                $.publish(BaseEvents_1.BaseEvents.GALLERY_THUMB_SELECTED, [thumb]);
                $.publish(BaseEvents_1.BaseEvents.THUMB_SELECTED, [thumb]);
            }, false);
            this.galleryComponent.on('decreaseSize', function () {
                $.publish(BaseEvents_1.BaseEvents.GALLERY_DECREASE_SIZE);
            }, false);
            this.galleryComponent.on('increaseSize', function () {
                $.publish(BaseEvents_1.BaseEvents.GALLERY_INCREASE_SIZE);
            }, false);
        };
        GalleryView.prototype.databind = function () {
            this.galleryComponent.options.data = this.galleryData;
            this.galleryComponent.set(this.galleryData);
            this.resize();
        };
        GalleryView.prototype.show = function () {
            var _this = this;
            this.isOpen = true;
            this.$element.show();
            // todo: would be better to have no imperative methods on components and use a reactive pattern
            setTimeout(function () {
                _this.galleryComponent.selectIndex(_this.extension.helper.canvasIndex);
            }, 10);
        };
        GalleryView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };
        GalleryView.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var $main = this.$gallery.find('.main');
            var $header = this.$gallery.find('.header');
            $main.height(this.$element.height() - $header.height());
        };
        return GalleryView;
    }(BaseView_1.BaseView));
    exports.GalleryView = GalleryView;
});
