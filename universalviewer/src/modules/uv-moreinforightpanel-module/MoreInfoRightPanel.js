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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/RightPanel", "../../Utils"], function (require, exports, BaseEvents_1, RightPanel_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoreInfoRightPanel = /** @class */ (function (_super) {
        __extends(MoreInfoRightPanel, _super);
        function MoreInfoRightPanel($element) {
            return _super.call(this, $element) || this;
        }
        MoreInfoRightPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('moreInfoRightPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function () {
                _this.databind();
            });
            $.subscribe(BaseEvents_1.BaseEvents.RANGE_CHANGED, function () {
                _this.databind();
            });
            this.setTitle(this.config.content.title);
            this.$metadata = $('<div class="iiif-metadata-component"></div>');
            this.$main.append(this.$metadata);
            this.metadataComponent = new IIIFComponents.MetadataComponent({
                target: this.$metadata[0],
                data: this._getData()
            });
            this.metadataComponent.on('iiifViewerLinkClicked', function (href) {
                // get the hash param.
                var rangeId = Utils.Urls.getHashParameterFromString('rid', href);
                if (rangeId) {
                    var range = _this.extension.helper.getRangeById(rangeId);
                    if (range) {
                        $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [range]);
                    }
                }
            }, false);
        };
        MoreInfoRightPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);
            this.databind();
        };
        MoreInfoRightPanel.prototype.databind = function () {
            this.metadataComponent.set(this._getData());
        };
        MoreInfoRightPanel.prototype._getCurrentRange = function () {
            var range = this.extension.helper.getCurrentRange();
            return range;
        };
        MoreInfoRightPanel.prototype._getData = function () {
            return {
                canvasDisplayOrder: this.config.options.canvasDisplayOrder,
                canvases: this.extension.getCurrentCanvases(),
                canvasExclude: this.config.options.canvasExclude,
                canvasLabels: this.extension.getCanvasLabels(this.content.page),
                content: this.config.content,
                copiedMessageDuration: 2000,
                copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
                helper: this.extension.helper,
                licenseFormatter: new Manifold.UriLabeller(this.config.license ? this.config.license : {}),
                limit: this.config.options.textLimit || 4,
                limitType: IIIFComponents.LimitType.LINES,
                limitToRange: Utils.Bools.getBool(this.config.options.limitToRange, false),
                manifestDisplayOrder: this.config.options.manifestDisplayOrder,
                manifestExclude: this.config.options.manifestExclude,
                range: this._getCurrentRange(),
                rtlLanguageCodes: this.config.options.rtlLanguageCodes,
                sanitizer: function (html) {
                    return Utils_1.UVUtils.sanitize(html);
                },
                showAllLanguages: this.config.options.showAllLanguages
            };
        };
        MoreInfoRightPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
        };
        return MoreInfoRightPanel;
    }(RightPanel_1.RightPanel));
    exports.MoreInfoRightPanel = MoreInfoRightPanel;
});
