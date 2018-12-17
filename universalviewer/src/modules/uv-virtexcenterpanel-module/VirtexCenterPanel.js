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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/CenterPanel"], function (require, exports, BaseEvents_1, CenterPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VirtexCenterPanel = /** @class */ (function (_super) {
        __extends(VirtexCenterPanel, _super);
        function VirtexCenterPanel($element) {
            return _super.call(this, $element) || this;
        }
        VirtexCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('virtexCenterPanel');
            _super.prototype.create.call(this);
            var that = this;
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                that.openMedia(resources);
            });
            this.$navigation = $('<div class="navigation"></div>');
            this.$content.prepend(this.$navigation);
            this.$zoomInButton = $("\n          <button class=\"btn imageBtn zoomIn\" title=\"" + this.content.zoomIn + "\">\n            <i class=\"uv-icon-zoom-in\" aria-hidden=\"true\"></i>" + this.content.zoomIn + "\n          </button>\n        ");
            this.$navigation.append(this.$zoomInButton);
            this.$zoomOutButton = $("\n          <button class=\"btn imageBtn zoomOut\" title=\"" + this.content.zoomOut + "\">\n            <i class=\"uv-icon-zoom-out\" aria-hidden=\"true\"></i>" + this.content.zoomOut + "\n          </button>\n        ");
            this.$navigation.append(this.$zoomOutButton);
            this.$vrButton = $("\n          <button class=\"btn imageBtn vr\" title=\"" + this.content.vr + "\">\n            <i class=\"uv-icon-vr\" aria-hidden=\"true\"></i>" + this.content.vr + "\n          </button>\n        ");
            this.$navigation.append(this.$vrButton);
            this.$viewport = $('<div class="virtex"></div>');
            this.$content.prepend(this.$viewport);
            this.title = this.extension.helper.getLabel();
            this.$zoomInButton.on('click', function (e) {
                e.preventDefault();
                if (_this.viewport) {
                    _this.viewport.zoomIn();
                }
            });
            this.$zoomOutButton.on('click', function (e) {
                e.preventDefault();
                if (_this.viewport) {
                    _this.viewport.zoomOut();
                }
            });
            this.$vrButton.on('click', function (e) {
                e.preventDefault();
                if (_this.viewport) {
                    _this.viewport.toggleVR();
                }
            });
            if (!this._isVREnabled()) {
                this.$vrButton.hide();
            }
        };
        VirtexCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.extension.getExternalResources(resources).then(function () {
                _this.$viewport.empty();
                var mediaUri = null;
                var canvas = _this.extension.helper.getCurrentCanvas();
                var formats = _this.extension.getMediaFormats(canvas);
                var resourceType = null;
                // default to threejs format.
                var fileType = new Virtex.FileType("application/vnd.threejs+json");
                if (formats && formats.length) {
                    mediaUri = formats[0].id;
                    resourceType = formats[0].getFormat();
                }
                else {
                    mediaUri = canvas.id;
                }
                if (resourceType) {
                    fileType = new Virtex.FileType(resourceType.toString());
                }
                var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
                _this.viewport = new Virtex.Viewport({
                    target: _this.$viewport[0],
                    data: {
                        antialias: !isAndroid,
                        file: mediaUri,
                        fullscreenEnabled: false,
                        type: fileType,
                        showStats: _this.options.showStats
                    }
                });
                if (_this.viewport) {
                    _this.viewport.on('vravailable', function () {
                        _this.$vrButton.show();
                    }, false);
                    _this.viewport.on('vrunavailable', function () {
                        _this.$vrButton.hide();
                    }, false);
                }
                _this.resize();
            });
        };
        VirtexCenterPanel.prototype._isVREnabled = function () {
            return (Utils.Bools.getBool(this.config.options.vrEnabled, false) && WEBVR.isAvailable());
        };
        VirtexCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.title) {
                this.$title.ellipsisFill(this.title);
            }
            this.$viewport.width(this.$content.width());
            this.$viewport.height(this.$content.height());
            if (this.viewport) {
                this.viewport.resize();
            }
        };
        return VirtexCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.VirtexCenterPanel = VirtexCenterPanel;
});
