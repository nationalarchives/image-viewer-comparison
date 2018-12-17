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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../../extensions/uv-seadragon-extension/Bounds", "../uv-shared-module/CenterPanel", "../../extensions/uv-seadragon-extension/Events", "../../Utils"], function (require, exports, BaseEvents_1, Bounds_1, CenterPanel_1, Events_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SeadragonCenterPanel = /** @class */ (function (_super) {
        __extends(SeadragonCenterPanel, _super);
        function SeadragonCenterPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this.controlsVisible = false;
            _this.isCreated = false;
            _this.isFirstLoad = true;
            _this.navigatedFromSearch = false;
            _this.nextButtonEnabled = false;
            _this.prevButtonEnabled = false;
            return _this;
        }
        SeadragonCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('seadragonCenterPanel');
            _super.prototype.create.call(this);
            this.$viewer = $('<div id="viewer"></div>');
            this.$content.prepend(this.$viewer);
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS, function (e, args) {
                _this.overlayAnnotations();
                _this.zoomToInitialAnnotation();
            });
            $.subscribe(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, function (e, args) {
                _this.viewer.gestureSettingsMouse.clickToZoom = args.clickToZoomEnabled;
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                _this.whenResized(function () {
                    if (!_this.isCreated)
                        _this.createUI();
                    _this.openMedia(resources);
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS, function () {
                _this.whenCreated(function () {
                    _this.extension.currentAnnotationRect = null;
                    _this.clearAnnotations();
                });
            });
            $.subscribe(Events_1.Events.NEXT_SEARCH_RESULT, function () {
                _this.whenCreated(function () {
                    _this.nextAnnotation();
                });
            });
            $.subscribe(Events_1.Events.PREV_SEARCH_RESULT, function () {
                _this.whenCreated(function () {
                    _this.prevAnnotation();
                });
            });
            $.subscribe(Events_1.Events.ZOOM_IN, function () {
                _this.whenCreated(function () {
                    _this.zoomIn();
                });
            });
            $.subscribe(Events_1.Events.ZOOM_OUT, function () {
                _this.whenCreated(function () {
                    _this.zoomOut();
                });
            });
            $.subscribe(Events_1.Events.ROTATE, function () {
                _this.whenCreated(function () {
                    _this.rotateRight();
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.METRIC_CHANGED, function () {
                _this.whenCreated(function () {
                    _this.updateResponsiveView();
                });
            });
        };
        SeadragonCenterPanel.prototype.whenCreated = function (cb) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this.isCreated;
            }, cb);
        };
        SeadragonCenterPanel.prototype.zoomIn = function () {
            this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 2);
        };
        SeadragonCenterPanel.prototype.zoomOut = function () {
            this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 0.5);
        };
        SeadragonCenterPanel.prototype.rotateRight = function () {
            this.viewer.viewport.setRotation(this.viewer.viewport.getRotation() + 90);
        };
        SeadragonCenterPanel.prototype.updateResponsiveView = function () {
            this.setNavigatorVisible();
            if (!this.extension.isDesktopMetric()) {
                this.viewer.autoHideControls = false;
                this.$viewportNavButtons.hide();
            }
            else {
                this.viewer.autoHideControls = true;
                this.$viewportNavButtons.show();
            }
        };
        SeadragonCenterPanel.prototype.createUI = function () {
            var _this = this;
            this.$spinner = $('<div class="spinner"></div>');
            this.$content.append(this.$spinner);
            // add to window object for testing automation purposes.
            window.openSeadragonViewer = this.viewer = OpenSeadragon({
                id: "viewer",
                ajaxWithCredentials: false,
                showNavigationControl: true,
                showNavigator: true,
                showRotationControl: true,
                showHomeControl: Utils.Bools.getBool(this.config.options.showHomeControl, false),
                showFullPageControl: false,
                defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
                maxZoomPixelRatio: this.config.options.maxZoomPixelRatio || 2,
                controlsFadeDelay: this.config.options.controlsFadeDelay || 250,
                controlsFadeLength: this.config.options.controlsFadeLength || 250,
                navigatorPosition: this.config.options.navigatorPosition || "BOTTOM_RIGHT",
                animationTime: this.config.options.animationTime || 1.2,
                visibilityRatio: this.config.options.visibilityRatio || 0.5,
                constrainDuringPan: Utils.Bools.getBool(this.config.options.constrainDuringPan, false),
                immediateRender: Utils.Bools.getBool(this.config.options.immediateRender, false),
                blendTime: this.config.options.blendTime || 0,
                autoHideControls: Utils.Bools.getBool(this.config.options.autoHideControls, true),
                prefixUrl: this.extension.data.root + '/img/',
                gestureSettingsMouse: {
                    clickToZoom: Utils.Bools.getBool(this.extension.data.config.options.clickToZoomEnabled, true)
                },
                navImages: {
                    zoomIn: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    zoomOut: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    home: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    rotateright: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    rotateleft: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    next: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    previous: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    }
                }
            });
            this.$zoomInButton = this.$viewer.find('div[title="Zoom in"]');
            this.$zoomInButton.attr('tabindex', 0);
            this.$zoomInButton.prop('title', this.content.zoomIn);
            this.$zoomInButton.addClass('zoomIn viewportNavButton');
            this.$zoomOutButton = this.$viewer.find('div[title="Zoom out"]');
            this.$zoomOutButton.attr('tabindex', 0);
            this.$zoomOutButton.prop('title', this.content.zoomOut);
            this.$zoomOutButton.addClass('zoomOut viewportNavButton');
            this.$goHomeButton = this.$viewer.find('div[title="Go home"]');
            this.$goHomeButton.attr('tabindex', 0);
            this.$goHomeButton.prop('title', this.content.goHome);
            this.$goHomeButton.addClass('goHome viewportNavButton');
            this.$rotateButton = this.$viewer.find('div[title="Rotate right"]');
            this.$rotateButton.attr('tabindex', 0);
            this.$rotateButton.prop('title', this.content.rotateRight);
            this.$rotateButton.addClass('rotate viewportNavButton');
            this.$viewportNavButtonsContainer = this.$viewer.find('.openseadragon-container > div:not(.openseadragon-canvas):first');
            this.$viewportNavButtons = this.$viewportNavButtonsContainer.find('.viewportNavButton');
            this.$canvas = $(this.viewer.canvas);
            // disable right click on canvas
            this.$canvas.on('contextmenu', function () { return false; });
            this.$navigator = this.$viewer.find(".navigator");
            this.setNavigatorVisible();
            // events
            this.$element.on('mousemove', function () {
                if (_this.controlsVisible)
                    return;
                _this.controlsVisible = true;
                _this.viewer.setControlsEnabled(true);
            });
            this.$element.on('mouseleave', function () {
                if (!_this.controlsVisible)
                    return;
                _this.controlsVisible = false;
                _this.viewer.setControlsEnabled(false);
            });
            // when mouse move stopped
            this.$element.on('mousemove', function () {
                // if over element, hide controls.
                // When over prev/next buttons keep controls enabled
                if (_this.$prevButton.ismouseover()) {
                    return;
                }
                if (_this.$nextButton.ismouseover()) {
                    return;
                }
                if (!_this.$viewer.find('.navigator').ismouseover()) {
                    if (!_this.controlsVisible)
                        return;
                    _this.controlsVisible = false;
                    _this.viewer.setControlsEnabled(false);
                }
            }, this.config.options.controlsFadeAfterInactive);
            this.viewer.addHandler('tile-drawn', function () {
                _this.$spinner.hide();
            });
            //this.viewer.addHandler("open-failed", () => {
            //});
            this.viewer.addHandler('resize', function (viewer) {
                $.publish(Events_1.Events.SEADRAGON_RESIZE, [viewer]);
                _this.viewerResize(viewer);
            });
            this.viewer.addHandler('animation-start', function (viewer) {
                $.publish(Events_1.Events.SEADRAGON_ANIMATION_START, [viewer]);
            });
            this.viewer.addHandler('animation', function (viewer) {
                $.publish(Events_1.Events.SEADRAGON_ANIMATION, [viewer]);
            });
            this.viewer.addHandler('animation-finish', function (viewer) {
                _this.currentBounds = _this.getViewportBounds();
                _this.updateVisibleAnnotationRects();
                $.publish(Events_1.Events.SEADRAGON_ANIMATION_FINISH, [viewer]);
            });
            this.viewer.addHandler('rotate', function (args) {
                $.publish(Events_1.Events.SEADRAGON_ROTATION, [args.degrees]);
            });
            this.title = this.extension.helper.getLabel();
            this.createNavigationButtons();
            this.hidePrevButton();
            this.hideNextButton();
            this.isCreated = true;
            this.resize();
        };
        SeadragonCenterPanel.prototype.createNavigationButtons = function () {
            var _this = this;
            var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
            this.$prevButton = $('<div class="paging btn prev" tabindex="0"></div>');
            if (this.extension.helper.isRightToLeft()) {
                this.$prevButton.prop('title', this.content.next);
            }
            else {
                this.$prevButton.prop('title', this.content.previous);
            }
            this.$nextButton = $('<div class="paging btn next" tabindex="0"></div>');
            if (this.extension.helper.isRightToLeft()) {
                this.$nextButton.prop('title', this.content.previous);
            }
            else {
                this.$nextButton.prop('title', this.content.next);
            }
            this.viewer.addControl(this.$prevButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
            this.viewer.addControl(this.$nextButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT });
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.bottomToTop().toString():
                case manifesto.ViewingDirection.topToBottom().toString():
                    this.$prevButton.addClass('vertical');
                    this.$nextButton.addClass('vertical');
                    ;
                    break;
            }
            var that = this;
            this.$prevButton.onPressed(function (e) {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
                if (!that.prevButtonEnabled)
                    return;
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(BaseEvents_1.BaseEvents.PREV);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.NEXT);
                        break;
                }
            });
            this.$nextButton.onPressed(function (e) {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
                if (!that.nextButtonEnabled)
                    return;
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(BaseEvents_1.BaseEvents.NEXT);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.PREV);
                        break;
                }
            });
            // When Prev/Next buttons are focused, make sure the controls are enabled
            this.$prevButton.on('focus', function () {
                if (_this.controlsVisible)
                    return;
                _this.controlsVisible = true;
                _this.viewer.setControlsEnabled(true);
            });
            this.$nextButton.on('focus', function () {
                if (_this.controlsVisible)
                    return;
                _this.controlsVisible = true;
                _this.viewer.setControlsEnabled(true);
            });
        };
        SeadragonCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.$spinner.show();
            this.items = [];
            this.extension.getExternalResources(resources).then(function (resources) {
                _this.viewer.close();
                resources = _this.getPagePositions(resources);
                for (var i = 0; i < resources.length; i++) {
                    var data = resources[i];
                    var tileSource = void 0;
                    if (data.hasServiceDescriptor) {
                        tileSource = data;
                    }
                    else {
                        tileSource = {
                            type: 'image',
                            url: data.id,
                            buildPyramid: false
                        };
                    }
                    _this.viewer.addTiledImage({
                        tileSource: tileSource,
                        x: data.x,
                        y: data.y,
                        width: data.width,
                        success: function (item) {
                            _this.items.push(item);
                            if (_this.items.length === resources.length) {
                                _this.openPagesHandler();
                            }
                            _this.resize();
                        }
                    });
                }
            });
        };
        SeadragonCenterPanel.prototype.getPagePositions = function (resources) {
            var leftPage;
            var rightPage;
            var topPage;
            var bottomPage;
            var page;
            var nextPage;
            // if there's more than one image, determine alignment strategy
            if (resources.length > 1) {
                if (resources.length === 2) {
                    // recto verso
                    if (this.extension.helper.isVerticallyAligned()) {
                        // vertical alignment
                        topPage = resources[0];
                        topPage.y = 0;
                        bottomPage = resources[1];
                        bottomPage.y = topPage.height + this.config.options.pageGap;
                    }
                    else {
                        // horizontal alignment
                        leftPage = resources[0];
                        leftPage.x = 0;
                        rightPage = resources[1];
                        rightPage.x = leftPage.width + this.config.options.pageGap;
                    }
                }
                else {
                    // scroll
                    if (this.extension.helper.isVerticallyAligned()) {
                        // vertical alignment
                        if (this.extension.helper.isTopToBottom()) {
                            // top to bottom
                            for (var i = 0; i < resources.length - 1; i++) {
                                page = resources[i];
                                nextPage = resources[i + 1];
                                nextPage.y = (page.y || 0) + page.height;
                                ;
                            }
                        }
                        else {
                            // bottom to top
                            for (var i = resources.length; i > 0; i--) {
                                page = resources[i];
                                nextPage = resources[i - 1];
                                nextPage.y = (page.y || 0) - page.height;
                            }
                        }
                    }
                    else {
                        // horizontal alignment
                        if (this.extension.helper.isLeftToRight()) {
                            // left to right
                            for (var i = 0; i < resources.length - 1; i++) {
                                page = resources[i];
                                nextPage = resources[i + 1];
                                nextPage.x = (page.x || 0) + page.width;
                            }
                        }
                        else {
                            // right to left
                            for (var i = resources.length - 1; i > 0; i--) {
                                page = resources[i];
                                nextPage = resources[i - 1];
                                nextPage.x = (page.x || 0) - page.width;
                            }
                        }
                    }
                }
            }
            return resources;
        };
        SeadragonCenterPanel.prototype.openPagesHandler = function () {
            $.publish(Events_1.Events.SEADRAGON_OPEN);
            if (this.extension.helper.isMultiCanvas() && !this.extension.helper.isContinuous()) {
                this.showPrevButton();
                this.showNextButton();
                $('.navigator').addClass('extraMargin');
                var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
                if (viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString()) {
                    if (this.extension.helper.isFirstCanvas()) {
                        this.disableNextButton();
                    }
                    else {
                        this.enableNextButton();
                    }
                    if (this.extension.helper.isLastCanvas()) {
                        this.disablePrevButton();
                    }
                    else {
                        this.enablePrevButton();
                    }
                }
                else {
                    if (this.extension.helper.isFirstCanvas()) {
                        this.disablePrevButton();
                    }
                    else {
                        this.enablePrevButton();
                    }
                    if (this.extension.helper.isLastCanvas()) {
                        this.disableNextButton();
                    }
                    else {
                        this.enableNextButton();
                    }
                }
            }
            this.setNavigatorVisible();
            this.overlayAnnotations();
            this.updateBounds();
            // this only happens if prev/next search result were clicked and caused a reload
            if (this.navigatedFromSearch) {
                this.navigatedFromSearch = false;
                this.zoomToInitialAnnotation();
            }
            this.isFirstLoad = false;
        };
        SeadragonCenterPanel.prototype.zoomToInitialAnnotation = function () {
            var annotationRect = this.getInitialAnnotationRect();
            this.extension.previousAnnotationRect = null;
            this.extension.currentAnnotationRect = null;
            if (annotationRect && this.isZoomToSearchResultEnabled()) {
                this.zoomToAnnotation(annotationRect);
            }
        };
        SeadragonCenterPanel.prototype.overlayAnnotations = function () {
            var annotations = this.getAnnotationsForCurrentImages();
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                var overlayRects = this.getAnnotationOverlayRects(annotation);
                for (var k = 0; k < overlayRects.length; k++) {
                    var overlayRect = overlayRects[k];
                    var div = document.createElement('div');
                    div.id = 'searchResult-' + overlayRect.canvasIndex + '-' + overlayRect.resultIndex;
                    div.className = 'searchOverlay';
                    div.title = Utils_1.UVUtils.sanitize(overlayRect.chars);
                    this.viewer.addOverlay(div, overlayRect);
                }
            }
        };
        SeadragonCenterPanel.prototype.updateBounds = function () {
            var settings = this.extension.getSettings();
            // if this is the first load and there are initial bounds, fit to those.
            if (this.isFirstLoad) {
                this.initialRotation = this.extension.data.rotation;
                if (this.initialRotation) {
                    this.viewer.viewport.setRotation(parseInt(this.initialRotation));
                }
                this.initialBounds = this.extension.data.xywh;
                if (this.initialBounds) {
                    this.initialBounds = Bounds_1.Bounds.fromString(this.initialBounds);
                    this.currentBounds = this.initialBounds;
                    this.fitToBounds(this.currentBounds);
                }
            }
            else if (settings.preserveViewport) {
                this.fitToBounds(this.currentBounds);
            }
            else {
                this.goHome();
            }
        };
        SeadragonCenterPanel.prototype.goHome = function () {
            this.viewer.viewport.goHome(true);
        };
        SeadragonCenterPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.addClass('disabled');
        };
        SeadragonCenterPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.removeClass('disabled');
        };
        SeadragonCenterPanel.prototype.hidePrevButton = function () {
            this.disablePrevButton();
            this.$prevButton.hide();
        };
        SeadragonCenterPanel.prototype.showPrevButton = function () {
            this.enablePrevButton();
            this.$prevButton.show();
        };
        SeadragonCenterPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.addClass('disabled');
        };
        SeadragonCenterPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.removeClass('disabled');
        };
        SeadragonCenterPanel.prototype.hideNextButton = function () {
            this.disableNextButton();
            this.$nextButton.hide();
        };
        SeadragonCenterPanel.prototype.showNextButton = function () {
            this.enableNextButton();
            this.$nextButton.show();
        };
        SeadragonCenterPanel.prototype.fitToBounds = function (bounds, immediate) {
            if (immediate === void 0) { immediate = true; }
            var rect = new OpenSeadragon.Rect();
            rect.x = Number(bounds.x);
            rect.y = Number(bounds.y);
            rect.width = Number(bounds.w);
            rect.height = Number(bounds.h);
            this.viewer.viewport.fitBoundsWithConstraints(rect, immediate);
        };
        SeadragonCenterPanel.prototype.getCroppedImageBounds = function () {
            if (!this.viewer || !this.viewer.viewport)
                return null;
            var canvas = this.extension.helper.getCurrentCanvas();
            var dimensions = this.extension.getCroppedImageDimensions(canvas, this.viewer);
            if (dimensions) {
                var bounds = new Bounds_1.Bounds(dimensions.regionPos.x, dimensions.regionPos.y, dimensions.region.width, dimensions.region.height);
                return bounds.toString();
            }
            return null;
        };
        SeadragonCenterPanel.prototype.getViewportBounds = function () {
            if (!this.viewer || !this.viewer.viewport)
                return null;
            var b = this.viewer.viewport.getBounds(true);
            var bounds = new Bounds_1.Bounds(Math.floor(b.x), Math.floor(b.y), Math.floor(b.width), Math.floor(b.height));
            return bounds;
        };
        SeadragonCenterPanel.prototype.viewerResize = function (viewer) {
            if (!viewer.viewport)
                return;
            var center = viewer.viewport.getCenter(true);
            if (!center)
                return;
            // postpone pan for a millisecond - fixes iPad image stretching/squashing issue.
            setTimeout(function () {
                viewer.viewport.panTo(center, true);
            }, 1);
        };
        SeadragonCenterPanel.prototype.clearAnnotations = function () {
            this.$canvas.find('.searchOverlay').hide();
        };
        SeadragonCenterPanel.prototype.getAnnotationsForCurrentImages = function () {
            var annotationsForCurrentImages = [];
            var annotations = this.extension.annotations;
            if (!annotations || !annotations.length)
                return annotationsForCurrentImages;
            var indices = this.extension.getPagedIndices();
            for (var i = 0; i < indices.length; i++) {
                var canvasIndex = indices[i];
                for (var j = 0; j < annotations.length; j++) {
                    if (annotations[j].canvasIndex === canvasIndex) {
                        annotationsForCurrentImages.push(annotations[j]);
                        break;
                    }
                }
            }
            return annotationsForCurrentImages;
        };
        SeadragonCenterPanel.prototype.getAnnotationRectsForCurrentImages = function () {
            var annotations = this.getAnnotationsForCurrentImages();
            return annotations.en().selectMany(function (x) { return x.rects; }).toArray();
        };
        SeadragonCenterPanel.prototype.updateVisibleAnnotationRects = function () {
            // after animating, loop through all search result rects and flag their visibility based on whether they are inside the current viewport.
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            for (var i = 0; i < annotationRects.length; i++) {
                var rect = annotationRects[i];
                var viewportBounds = this.viewer.viewport.getBounds();
                rect.isVisible = Utils.Dimensions.hitRect(viewportBounds.x, viewportBounds.y, viewportBounds.width, viewportBounds.height, rect.viewportX, rect.viewportY);
            }
        };
        SeadragonCenterPanel.prototype.getAnnotationRectIndex = function (annotationRect) {
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            return annotationRects.indexOf(annotationRect);
        };
        SeadragonCenterPanel.prototype.isZoomToSearchResultEnabled = function () {
            return Utils.Bools.getBool(this.extension.data.config.options.zoomToSearchResultEnabled, true);
        };
        SeadragonCenterPanel.prototype.prevAnnotation = function () {
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            var currentAnnotationRect = this.extension.currentAnnotationRect;
            var currentAnnotationRectIndex = currentAnnotationRect ? this.getAnnotationRectIndex(currentAnnotationRect) : annotationRects.length;
            //const currentAnnotationRectIndex: number = this.getAnnotationRectIndex(<AnnotationRect>currentAnnotationRect);
            var foundRect = null;
            // if there's no currentAnnotationRect selected, index is the total available annotation rects for the current images.
            // minusing 1 makes the index the last of the available rects for the current images.
            for (var i = currentAnnotationRectIndex - 1; i >= 0; i--) {
                var rect = annotationRects[i];
                // this was removed as users found it confusing.
                // find the prev visible or non-visible rect.
                //if (rect.isVisible) {
                //    continue;
                //} else {
                foundRect = rect;
                break;
                //}
            }
            if (foundRect && this.isZoomToSearchResultEnabled()) {
                // if the rect's canvasIndex is less than the current canvasIndex
                if (foundRect.canvasIndex < this.extension.helper.canvasIndex) {
                    this.extension.currentAnnotationRect = foundRect;
                    this.navigatedFromSearch = true;
                    $.publish(BaseEvents_1.BaseEvents.ANNOTATION_CANVAS_CHANGED, [foundRect]);
                }
                else {
                    this.zoomToAnnotation(foundRect);
                }
            }
            else {
                this.navigatedFromSearch = true;
                $.publish(Events_1.Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            }
        };
        SeadragonCenterPanel.prototype.nextAnnotation = function () {
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            var currentAnnotationRect = this.extension.currentAnnotationRect;
            var currentAnnotationRectIndex = currentAnnotationRect ? this.getAnnotationRectIndex(currentAnnotationRect) : -1;
            var foundRect = null;
            // if there's no currentAnnotationRect selected, index is -1.
            // adding 1 makes the index 0 of available rects for the current images.
            for (var i = currentAnnotationRectIndex + 1; i < annotationRects.length; i++) {
                var rect = annotationRects[i];
                // this was removed as users found it confusing.
                // find the next visible or non-visible rect.
                //if (rect.isVisible) {
                //    continue;
                //} else {
                foundRect = rect;
                break;
                //}
            }
            if (foundRect && this.isZoomToSearchResultEnabled()) {
                // if the rect's canvasIndex is greater than the current canvasIndex
                if (foundRect.canvasIndex > this.extension.helper.canvasIndex) {
                    this.extension.currentAnnotationRect = foundRect;
                    this.navigatedFromSearch = true;
                    $.publish(BaseEvents_1.BaseEvents.ANNOTATION_CANVAS_CHANGED, [foundRect]);
                }
                else {
                    this.zoomToAnnotation(foundRect);
                }
            }
            else {
                this.navigatedFromSearch = true;
                $.publish(Events_1.Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            }
        };
        SeadragonCenterPanel.prototype.getAnnotationRectByIndex = function (index) {
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            if (!annotationRects.length)
                return null;
            return annotationRects[index];
        };
        SeadragonCenterPanel.prototype.getInitialAnnotationRect = function () {
            var _this = this;
            var annotationRects = this.getAnnotationRectsForCurrentImages();
            if (!annotationRects.length)
                return null;
            // if we've got this far it means that a reload has happened
            // check if the lastCanvasIndex is greater or less than the current canvasIndex
            // if greater than, select the last annotation on the current page
            // if less than, select the first annotation on the current page
            // otherwise default to the first annotation
            var previousAnnotationRect = this.extension.previousAnnotationRect;
            if (!previousAnnotationRect) {
                if (this.extension.lastCanvasIndex > this.extension.helper.canvasIndex) {
                    return annotationRects.en().where(function (x) { return x.canvasIndex === _this.extension.helper.canvasIndex; }).last();
                }
            }
            return annotationRects.en().where(function (x) { return x.canvasIndex === _this.extension.helper.canvasIndex; }).first();
        };
        SeadragonCenterPanel.prototype.zoomToAnnotation = function (annotationRect) {
            this.extension.previousAnnotationRect = this.extension.currentAnnotationRect || annotationRect;
            this.extension.currentAnnotationRect = annotationRect;
            // if zoomToBoundsEnabled, zoom to the annotation's bounds.
            // otherwise, pan into view preserving the current zoom level.
            if (Utils.Bools.getBool(this.config.options.zoomToBoundsEnabled, false)) {
                this.fitToBounds(new Bounds_1.Bounds(annotationRect.viewportX, annotationRect.viewportY, annotationRect.width, annotationRect.height), false);
            }
            else {
                var x = annotationRect.viewportX - ((this.currentBounds.w * 0.5) - annotationRect.width * 0.5);
                var y = annotationRect.viewportY - ((this.currentBounds.h * 0.5) - annotationRect.height * 0.5);
                var w = this.currentBounds.w;
                var h = this.currentBounds.h;
                var bounds = new Bounds_1.Bounds(x, y, w, h);
                this.fitToBounds(bounds);
            }
            this.highlightAnnotationRect(annotationRect);
            $.publish(BaseEvents_1.BaseEvents.ANNOTATION_CHANGED);
        };
        SeadragonCenterPanel.prototype.highlightAnnotationRect = function (annotationRect) {
            var $rect = $('#searchResult-' + annotationRect.canvasIndex + '-' + annotationRect.index);
            $rect.addClass('current');
            $('.searchOverlay').not($rect).removeClass('current');
        };
        SeadragonCenterPanel.prototype.getAnnotationOverlayRects = function (annotationGroup) {
            var newRects = [];
            if (!this.extension.resources) {
                return newRects;
            }
            var resource = this.extension.resources.en().where(function (x) { return x.index === annotationGroup.canvasIndex; }).first();
            var index = this.extension.resources.indexOf(resource);
            var offsetX = 0;
            if (index > 0) {
                offsetX = this.extension.resources[index - 1].width;
            }
            for (var i = 0; i < annotationGroup.rects.length; i++) {
                var searchRect = annotationGroup.rects[i];
                var x = (searchRect.x + offsetX) + ((index > 0) ? this.config.options.pageGap : 0);
                var y = searchRect.y;
                var w = searchRect.width;
                var h = searchRect.height;
                var rect = new OpenSeadragon.Rect(x, y, w, h);
                searchRect.viewportX = x;
                searchRect.viewportY = y;
                rect.canvasIndex = searchRect.canvasIndex;
                rect.resultIndex = searchRect.index;
                rect.chars = searchRect.chars;
                newRects.push(rect);
            }
            return newRects;
        };
        SeadragonCenterPanel.prototype.resize = function () {
            var _this = this;
            _super.prototype.resize.call(this);
            this.$viewer.height(this.$content.height() - this.$viewer.verticalMargins());
            this.$viewer.width(this.$content.width() - this.$viewer.horizontalMargins());
            if (!this.isCreated)
                return;
            if (this.title) {
                this.$title.ellipsisFill(Utils_1.UVUtils.sanitize(this.title));
            }
            this.$spinner.css('top', (this.$content.height() / 2) - (this.$spinner.height() / 2));
            this.$spinner.css('left', (this.$content.width() / 2) - (this.$spinner.width() / 2));
            var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
            ;
            if (this.extension.helper.isMultiCanvas() && this.$prevButton && this.$nextButton) {
                var verticalButtonPos = Math.floor(this.$content.width() / 2);
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        this.$prevButton.addClass('down');
                        this.$nextButton.addClass('up');
                        this.$prevButton.css('left', verticalButtonPos - (this.$prevButton.outerWidth() / 2));
                        this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()));
                        this.$nextButton.css('left', (verticalButtonPos * -1) - (this.$nextButton.outerWidth() / 2));
                        break;
                    case manifesto.ViewingDirection.topToBottom().toString():
                        this.$prevButton.css('left', verticalButtonPos - (this.$prevButton.outerWidth() / 2));
                        this.$nextButton.css('left', (verticalButtonPos * -1) - (this.$nextButton.outerWidth() / 2));
                        this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()));
                        break;
                    default:
                        this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
                        this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
                        break;
                }
            }
            // stretch navigator, allowing time for OSD to resize
            setTimeout(function () {
                if (_this.extension.helper.isContinuous()) {
                    if (_this.extension.helper.isHorizontallyAligned()) {
                        var width = _this.$viewer.width() - _this.$viewer.rightMargin();
                        _this.$navigator.width(width);
                    }
                    else {
                        _this.$navigator.height(_this.$viewer.height());
                    }
                }
            }, 100);
        };
        SeadragonCenterPanel.prototype.setFocus = function () {
            if (!this.$canvas.is(":focus")) {
                if (this.extension.data.config.options.allowStealFocus) {
                    this.$canvas.focus();
                }
            }
        };
        SeadragonCenterPanel.prototype.setNavigatorVisible = function () {
            var navigatorEnabled = Utils.Bools.getBool(this.extension.getSettings().navigatorEnabled, true) && this.extension.isDesktopMetric();
            this.viewer.navigator.setVisible(navigatorEnabled);
            if (navigatorEnabled) {
                this.$navigator.show();
            }
            else {
                this.$navigator.hide();
            }
        };
        return SeadragonCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.SeadragonCenterPanel = SeadragonCenterPanel;
});
