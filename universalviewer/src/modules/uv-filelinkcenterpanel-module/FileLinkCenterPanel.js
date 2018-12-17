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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/CenterPanel", "../../Utils"], function (require, exports, BaseEvents_1, CenterPanel_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileLinkCenterPanel = /** @class */ (function (_super) {
        __extends(FileLinkCenterPanel, _super);
        function FileLinkCenterPanel($element) {
            return _super.call(this, $element) || this;
        }
        FileLinkCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('fileLinkCenterPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                _this.openMedia(resources);
            });
            this.$scroll = $('<div class="scroll"><div>');
            this.$content.append(this.$scroll);
            this.$downloadItems = $('<ol></ol>');
            this.$scroll.append(this.$downloadItems);
            this.$downloadItemTemplate = $('<li><img><div class="col2"><a class="filename" target="_blank" download></a><span class="label"></span><a class="description" target="_blank" download></a></div></li>');
            this.title = this.extension.helper.getLabel();
        };
        FileLinkCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.extension.getExternalResources(resources).then(function () {
                var canvas = _this.extension.helper.getCurrentCanvas();
                var annotations = canvas.getContent();
                var $item;
                for (var i = 0; i < annotations.length; i++) {
                    var annotation = annotations[i];
                    if (!annotation.getBody().length) {
                        continue;
                    }
                    $item = _this.$downloadItemTemplate.clone();
                    var $fileName = $item.find('.filename');
                    var $label = $item.find('.label');
                    var $thumb = $item.find('img');
                    var $description = $item.find('.description');
                    var annotationBody = annotation.getBody()[0];
                    var id = annotationBody.getProperty('id');
                    if (id) {
                        $fileName.prop('href', id);
                        $fileName.text(id.substr(id.lastIndexOf('/') + 1));
                    }
                    var label = Manifesto.LanguageMap.getValue(annotationBody.getLabel());
                    if (label) {
                        $label.text(Utils_1.UVUtils.sanitize(label));
                    }
                    var thumbnail = annotation.getProperty('thumbnail');
                    if (thumbnail) {
                        $thumb.prop('src', thumbnail);
                    }
                    else {
                        $thumb.hide();
                    }
                    var description = annotationBody.getProperty('description');
                    if (description) {
                        $description.text(Utils_1.UVUtils.sanitize(description));
                        if (id) {
                            $description.prop('href', id);
                        }
                    }
                    _this.$downloadItems.append($item);
                }
            });
        };
        FileLinkCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.title) {
                this.$title.ellipsisFill(this.title);
            }
            this.$scroll.height(this.$content.height() - this.$scroll.verticalMargins());
        };
        return FileLinkCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.FileLinkCenterPanel = FileLinkCenterPanel;
});
