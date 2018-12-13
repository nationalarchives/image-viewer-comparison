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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/CenterPanel", "../../extensions/uv-pdf-extension/Events"], function (require, exports, BaseEvents_1, CenterPanel_1, Events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PDFCenterPanel = /** @class */ (function (_super) {
        __extends(PDFCenterPanel, _super);
        function PDFCenterPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this._maxScale = 5;
            _this._minScale = 0.7;
            _this._nextButtonEnabled = false;
            _this._pageIndex = 1;
            _this._pageIndexPending = null;
            _this._pageRendering = false;
            _this._pdfDoc = null;
            _this._prevButtonEnabled = false;
            _this._scale = 0.7;
            return _this;
        }
        PDFCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pdfCenterPanel');
            _super.prototype.create.call(this);
            this._$pdfContainer = $('<div class="pdfContainer"></div>');
            this._$canvas = $('<canvas></canvas>');
            this._$spinner = $('<div class="spinner"></div>');
            this._canvas = this._$canvas[0];
            this._ctx = this._canvas.getContext('2d');
            this.$content.append(this._$spinner);
            this._$prevButton = $('<div class="btn prev" tabindex="0"></div>');
            this.$content.append(this._$prevButton);
            this._$nextButton = $('<div class="btn next" tabindex="0"></div>');
            this.$content.append(this._$nextButton);
            this._$zoomInButton = $('<div class="btn zoomIn" tabindex="0"></div>');
            this.$content.append(this._$zoomInButton);
            this._$zoomOutButton = $('<div class="btn zoomOut" tabindex="0"></div>');
            this.$content.append(this._$zoomOutButton);
            this._$pdfContainer.append(this._$canvas);
            this.$content.prepend(this._$pdfContainer);
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                _this.openMedia(resources);
            });
            $.subscribe(BaseEvents_1.BaseEvents.FIRST, function () {
                if (!_this._pdfDoc) {
                    return;
                }
                _this._pageIndex = 1;
                _this._queueRenderPage(_this._pageIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.PREV, function () {
                if (!_this._pdfDoc) {
                    return;
                }
                if (_this._pageIndex <= 1) {
                    return;
                }
                _this._pageIndex--;
                _this._queueRenderPage(_this._pageIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.NEXT, function () {
                if (!_this._pdfDoc) {
                    return;
                }
                if (_this._pageIndex >= _this._pdfDoc.numPages) {
                    return;
                }
                _this._pageIndex++;
                _this._queueRenderPage(_this._pageIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LAST, function () {
                if (!_this._pdfDoc) {
                    return;
                }
                _this._pageIndex = _this._pdfDoc.numPages;
                _this._queueRenderPage(_this._pageIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function () {
                if (!_this._pdfDoc) {
                    return;
                }
                _this._pageIndex = 1;
                _this._queueRenderPage(_this._pageIndex);
            });
            $.subscribe(Events_1.Events.SEARCH, function (e, pageIndex) {
                if (!_this._pdfDoc) {
                    return;
                }
                if (pageIndex < 1 || pageIndex > _this._pdfDoc.numPages) {
                    return;
                }
                _this._pageIndex = pageIndex;
                _this._queueRenderPage(_this._pageIndex);
            });
            this._$prevButton.onPressed(function (e) {
                e.preventDefault();
                if (!_this._prevButtonEnabled)
                    return;
                $.publish(BaseEvents_1.BaseEvents.PREV);
            });
            this.disablePrevButton();
            this._$nextButton.onPressed(function (e) {
                e.preventDefault();
                if (!_this._nextButtonEnabled)
                    return;
                $.publish(BaseEvents_1.BaseEvents.NEXT);
            });
            this.disableNextButton();
            this._$zoomInButton.onPressed(function (e) {
                e.preventDefault();
                var newScale = _this._scale + 0.5;
                if (newScale < _this._maxScale) {
                    _this._scale = newScale;
                }
                else {
                    _this._scale = _this._maxScale;
                }
                _this._render(_this._pageIndex);
            });
            this._$zoomOutButton.onPressed(function (e) {
                e.preventDefault();
                var newScale = _this._scale - 0.5;
                if (newScale > _this._minScale) {
                    _this._scale = newScale;
                }
                else {
                    _this._scale = _this._minScale;
                }
                _this._render(_this._pageIndex);
            });
        };
        PDFCenterPanel.prototype.disablePrevButton = function () {
            this._prevButtonEnabled = false;
            this._$prevButton.addClass('disabled');
        };
        PDFCenterPanel.prototype.enablePrevButton = function () {
            this._prevButtonEnabled = true;
            this._$prevButton.removeClass('disabled');
        };
        PDFCenterPanel.prototype.hidePrevButton = function () {
            this.disablePrevButton();
            this._$prevButton.hide();
        };
        PDFCenterPanel.prototype.showPrevButton = function () {
            this.enablePrevButton();
            this._$prevButton.show();
        };
        PDFCenterPanel.prototype.disableNextButton = function () {
            this._nextButtonEnabled = false;
            this._$nextButton.addClass('disabled');
        };
        PDFCenterPanel.prototype.enableNextButton = function () {
            this._nextButtonEnabled = true;
            this._$nextButton.removeClass('disabled');
        };
        PDFCenterPanel.prototype.hideNextButton = function () {
            this.disableNextButton();
            this._$nextButton.hide();
        };
        PDFCenterPanel.prototype.showNextButton = function () {
            this.enableNextButton();
            this._$nextButton.show();
        };
        PDFCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this._$spinner.show();
            this.extension.getExternalResources(resources).then(function () {
                var mediaUri = null;
                var canvas = _this.extension.helper.getCurrentCanvas();
                var formats = _this.extension.getMediaFormats(canvas);
                if (formats && formats.length) {
                    mediaUri = formats[0].id;
                }
                else {
                    mediaUri = canvas.id;
                }
                PDFJS.disableWorker = true;
                PDFJS.getDocument(mediaUri).then(function (pdfDoc) {
                    _this._pdfDoc = pdfDoc;
                    _this._render(_this._pageIndex);
                    $.publish(Events_1.Events.PDF_LOADED, [pdfDoc]);
                    _this._$spinner.hide();
                });
            });
        };
        PDFCenterPanel.prototype._render = function (num) {
            var _this = this;
            this._pageRendering = true;
            this._$zoomOutButton.enable();
            this._$zoomInButton.enable();
            //disable zoom if not possible
            var lowScale = this._scale - 0.5;
            var highScale = this._scale + 0.5;
            if (lowScale < this._minScale) {
                this._$zoomOutButton.disable();
            }
            if (highScale > this._maxScale) {
                this._$zoomInButton.disable();
            }
            //this._pdfDoc.getPage(num).then((page: any) => {
            this._pdfDoc.getPage(num).then(function (page) {
                if (_this._renderTask) {
                    _this._renderTask.cancel();
                }
                // how to fit to the available space
                // const height: number = this.$content.height();
                // this._canvas.height = height;
                // this._viewport = page.getViewport(this._canvas.height / page.getViewport(1.0).height);
                // const width: number = this._viewport.width;
                // this._canvas.width = width;
                // this._$canvas.css({
                //     left: (this.$content.width() / 2) - (width / 2)
                // });
                // scale viewport
                _this._viewport = page.getViewport(_this._scale);
                _this._canvas.height = _this._viewport.height;
                _this._canvas.width = _this._viewport.width;
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: _this._ctx,
                    viewport: _this._viewport
                };
                _this._renderTask = page.render(renderContext);
                // Wait for rendering to finish
                _this._renderTask.promise.then(function () {
                    $.publish(Events_1.Events.PAGE_INDEX_CHANGED, [_this._pageIndex]);
                    _this._pageRendering = false;
                    if (_this._pageIndexPending !== null) {
                        // New page rendering is pending
                        _this._render(_this._pageIndexPending);
                        _this._pageIndexPending = null;
                    }
                    if (_this._pageIndex === 1) {
                        _this.disablePrevButton();
                    }
                    else {
                        _this.enablePrevButton();
                    }
                    if (_this._pageIndex === _this._pdfDoc.numPages) {
                        _this.disableNextButton();
                    }
                    else {
                        _this.enableNextButton();
                    }
                }).catch(function (err) {
                    //console.log(err);
                });
            });
        };
        PDFCenterPanel.prototype._queueRenderPage = function (num) {
            if (this._pageRendering) {
                this._pageIndexPending = num;
            }
            else {
                this._render(num);
            }
        };
        PDFCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this._$pdfContainer.width(this.$content.width());
            this._$pdfContainer.height(this.$content.height());
            this._$spinner.css('top', (this.$content.height() / 2) - (this._$spinner.height() / 2));
            this._$spinner.css('left', (this.$content.width() / 2) - (this._$spinner.width() / 2));
            this._$prevButton.css({
                top: (this.$content.height() - this._$prevButton.height()) / 2,
                left: this._$prevButton.horizontalMargins()
            });
            this._$nextButton.css({
                top: (this.$content.height() - this._$nextButton.height()) / 2,
                left: this.$content.width() - (this._$nextButton.width() + this._$nextButton.horizontalMargins())
            });
            if (!this._viewport) {
                return;
            }
            this._render(this._pageIndex);
        };
        return PDFCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.PDFCenterPanel = PDFCenterPanel;
});
