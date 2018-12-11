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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/CenterPanel", "../uv-shared-module/Position"], function (require, exports, BaseEvents_1, CenterPanel_1, Position_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AVCenterPanel = /** @class */ (function (_super) {
        __extends(AVCenterPanel, _super);
        function AVCenterPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this._mediaReady = false;
            _this._isThumbsViewOpen = false;
            _this.attributionPosition = Position_1.Position.BOTTOM_RIGHT;
            return _this;
        }
        AVCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('avCenterPanel');
            _super.prototype.create.call(this);
            var that = this;
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                that.openMedia(resources);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this._viewCanvas(canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RANGE_CHANGED, function (e, range) {
                if (!_this._observeRangeChanges()) {
                    return;
                }
                _this._whenMediaReady(function () {
                    that._viewRange(range);
                    that._setTitle();
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.METRIC_CHANGED, function () {
                _this._whenMediaReady(function () {
                    if (_this.avcomponent) {
                        _this.avcomponent.set({
                            limitToRange: _this._limitToRange(),
                            constrainNavigationToRange: _this._limitToRange()
                        });
                    }
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.CREATED, function () {
                _this._setTitle();
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_THUMBS_VIEW, function () {
                _this._isThumbsViewOpen = true;
                _this._whenMediaReady(function () {
                    if (_this.avcomponent) {
                        _this.avcomponent.set({
                            virtualCanvasEnabled: false
                        });
                        var canvas = _this.extension.helper.getCurrentCanvas();
                        if (canvas) {
                            _this._viewCanvas(_this.extension.helper.canvasIndex);
                        }
                    }
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_TREE_VIEW, function () {
                _this._isThumbsViewOpen = false;
                _this._whenMediaReady(function () {
                    if (_this.avcomponent) {
                        _this.avcomponent.set({
                            virtualCanvasEnabled: true
                        });
                    }
                });
            });
            this._createAVComponent();
        };
        AVCenterPanel.prototype._createAVComponent = function () {
            var _this = this;
            this.$avcomponent = $('<div class="iiif-av-component"></div>');
            this.$content.prepend(this.$avcomponent);
            this.avcomponent = new IIIFComponents.AVComponent({
                target: this.$avcomponent[0]
            });
            this.avcomponent.on('mediaready', function () {
                console.log('mediaready');
                _this._mediaReady = true;
            }, false);
            this.avcomponent.on('rangechanged', function (rangeId) {
                if (rangeId) {
                    _this._setTitle();
                    var range = _this.extension.helper.getRangeById(rangeId);
                    if (range) {
                        var currentRange = _this.extension.helper.getCurrentRange();
                        if (range !== currentRange) {
                            $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [range]);
                        }
                    }
                    else {
                        $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [null]);
                    }
                }
                else {
                    $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [null]);
                }
            }, false);
        };
        AVCenterPanel.prototype._observeRangeChanges = function () {
            if (!this._isThumbsViewOpen) {
                return true;
            }
            return false;
        };
        AVCenterPanel.prototype._setTitle = function () {
            var title = '';
            var value;
            var label;
            // get the current range or canvas title
            var currentRange = this.extension.helper.getCurrentRange();
            if (currentRange) {
                label = currentRange.getLabel();
            }
            else {
                label = this.extension.helper.getCurrentCanvas().getLabel();
            }
            value = Manifesto.LanguageMap.getValue(label);
            if (value) {
                title = value;
            }
            if (Utils.Bools.getBool(this.config.options.includeParentInTitleEnabled, false)) {
                // get the parent range or manifest's title
                if (currentRange) {
                    if (currentRange.parentRange) {
                        label = currentRange.parentRange.getLabel();
                        value = Manifesto.LanguageMap.getValue(label);
                    }
                }
                else {
                    value = this.extension.helper.getLabel();
                }
                if (value) {
                    title += this.content.delimiter + value;
                }
            }
            this.title = title;
            this.resize(false);
        };
        AVCenterPanel.prototype._isCurrentResourceAccessControlled = function () {
            var canvas = this.extension.helper.getCurrentCanvas();
            return canvas.externalResource.isAccessControlled();
        };
        AVCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.extension.getExternalResources(resources).then(function () {
                if (_this.avcomponent) {
                    // reset if the media has already been loaded (degraded flow has happened)
                    if (_this.extension.helper.canvasIndex === _this._lastCanvasIndex) {
                        _this.avcomponent.reset();
                    }
                    _this._lastCanvasIndex = _this.extension.helper.canvasIndex;
                    _this.avcomponent.set({
                        helper: _this.extension.helper,
                        adaptiveAuthEnabled: _this._isCurrentResourceAccessControlled(),
                        autoPlay: _this.config.options.autoPlay,
                        autoSelectRange: true,
                        constrainNavigationToRange: _this._limitToRange(),
                        content: _this.content,
                        defaultAspectRatio: 0.56,
                        doubleClickMS: 350,
                        limitToRange: _this._limitToRange(),
                        posterImageRatio: _this.config.options.posterImageRatio
                    });
                    _this.resize();
                }
            });
        };
        AVCenterPanel.prototype._limitToRange = function () {
            return !this.extension.isDesktopMetric();
        };
        AVCenterPanel.prototype._whenMediaReady = function (cb) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this._mediaReady;
            }, cb);
        };
        AVCenterPanel.prototype._viewRange = function (range) {
            var _this = this;
            this._whenMediaReady(function () {
                if (range && _this.avcomponent) {
                    _this.avcomponent.playRange(range.id);
                }
                // don't resize the av component to avoid expensively redrawing waveforms
                _this.resize(false);
            });
        };
        AVCenterPanel.prototype._viewCanvas = function (canvasIndex) {
            var _this = this;
            this._whenMediaReady(function () {
                var canvas = _this.extension.helper.getCanvasByIndex(canvasIndex);
                if (_this.avcomponent) {
                    _this.avcomponent.showCanvas(canvas.id);
                }
            });
        };
        AVCenterPanel.prototype.resize = function (resizeAVComponent) {
            if (resizeAVComponent === void 0) { resizeAVComponent = true; }
            _super.prototype.resize.call(this);
            if (this.title) {
                this.$title.ellipsisFill(this.title);
            }
            if (resizeAVComponent && this.avcomponent) {
                this.$avcomponent.height(this.$content.height());
                this.avcomponent.resize();
            }
        };
        return AVCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.AVCenterPanel = AVCenterPanel;
});
