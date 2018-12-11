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
define(["require", "exports", "../../modules/uv-shared-module/AnnotationResults", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "../../modules/uv-contentleftpanel-module/ContentLeftPanel", "./CroppedImageDimensions", "./DownloadDialogue", "./Events", "../../modules/uv-dialogues-module/ExternalContentDialogue", "../../modules/uv-osdmobilefooterpanel-module/MobileFooter", "../../modules/uv-searchfooterpanel-module/FooterPanel", "../../modules/uv-dialogues-module/HelpDialogue", "./Mode", "../../modules/uv-dialogues-module/MoreInfoDialogue", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "../../modules/uv-multiselectdialogue-module/MultiSelectDialogue", "./MultiSelectionArgs", "../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel", "../../modules/uv-shared-module/Point", "../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, AnnotationResults_1, BaseEvents_1, BaseExtension_1, Bookmark_1, ContentLeftPanel_1, CroppedImageDimensions_1, DownloadDialogue_1, Events_1, ExternalContentDialogue_1, MobileFooter_1, FooterPanel_1, HelpDialogue_1, Mode_1, MoreInfoDialogue_1, MoreInfoRightPanel_1, MultiSelectDialogue_1, MultiSelectionArgs_1, PagingHeaderPanel_1, Point_1, SeadragonCenterPanel_1, SettingsDialogue_1, ShareDialogue_1, Shell_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnnotationGroup = Manifold.AnnotationGroup;
    var Extension = /** @class */ (function (_super) {
        __extends(Extension, _super);
        function Extension() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotations = [];
            _this.currentRotation = 0;
            _this.isAnnotating = false;
            return _this;
        }
        Extension.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.METRIC_CHANGED, function () {
                if (!_this.isDesktopMetric()) {
                    var settings = {};
                    settings.pagingEnabled = false;
                    _this.updateSettings(settings);
                    $.publish(BaseEvents_1.BaseEvents.UPDATE_SETTINGS);
                    Shell_1.Shell.$rightPanel.hide();
                }
                else {
                    Shell_1.Shell.$rightPanel.show();
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.previousAnnotationRect = null;
                _this.currentAnnotationRect = null;
                _this.viewPage(canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS, function () {
                _this.clearAnnotations();
                $.publish(BaseEvents_1.BaseEvents.ANNOTATIONS_CLEARED);
                _this.fire(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS);
            });
            $.subscribe(BaseEvents_1.BaseEvents.DOWN_ARROW, function () {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.END, function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.helper.getLastPageIndex()]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.FIRST, function () {
                _this.fire(BaseEvents_1.BaseEvents.FIRST);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.helper.getFirstPageIndex()]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.GALLERY_DECREASE_SIZE, function () {
                _this.fire(BaseEvents_1.BaseEvents.GALLERY_DECREASE_SIZE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.GALLERY_INCREASE_SIZE, function () {
                _this.fire(BaseEvents_1.BaseEvents.GALLERY_INCREASE_SIZE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.GALLERY_THUMB_SELECTED, function () {
                _this.fire(BaseEvents_1.BaseEvents.GALLERY_THUMB_SELECTED);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HOME, function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.helper.getFirstPageIndex()]);
            });
            $.subscribe(Events_1.Events.IMAGE_SEARCH, function (e, index) {
                _this.fire(Events_1.Events.IMAGE_SEARCH, index);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [index]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LAST, function () {
                _this.fire(BaseEvents_1.BaseEvents.LAST);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.helper.getLastPageIndex()]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFT_ARROW, function () {
                if (_this.useArrowKeysToNavigate()) {
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getPrevPageIndex()]);
                }
                else {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START, function () {
                if (_this.isDesktopMetric()) {
                    Shell_1.Shell.$rightPanel.show();
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
                Shell_1.Shell.$centerPanel.show();
                _this.resize();
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START, function () {
                Shell_1.Shell.$centerPanel.hide();
                Shell_1.Shell.$rightPanel.hide();
            });
            $.subscribe(BaseEvents_1.BaseEvents.MINUS, function () {
                _this.centerPanel.setFocus();
            });
            $.subscribe(Events_1.Events.MODE_CHANGED, function (e, mode) {
                _this.fire(Events_1.Events.MODE_CHANGED, mode);
                _this.mode = new Mode_1.Mode(mode);
                var settings = _this.getSettings();
                $.publish(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, [settings]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.MULTISELECTION_MADE, function (e, ids) {
                var args = new MultiSelectionArgs_1.MultiSelectionArgs();
                args.manifestUri = _this.helper.iiifResourceUri;
                args.allCanvases = ids.length === _this.helper.getCanvases().length;
                args.canvases = ids;
                args.format = _this.data.config.options.multiSelectionMimeType;
                args.sequence = _this.helper.getCurrentSequence().id;
                _this.fire(BaseEvents_1.BaseEvents.MULTISELECTION_MADE, args);
            });
            $.subscribe(BaseEvents_1.BaseEvents.NEXT, function () {
                _this.fire(BaseEvents_1.BaseEvents.NEXT);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getNextPageIndex()]);
            });
            $.subscribe(Events_1.Events.NEXT_SEARCH_RESULT, function () {
                _this.fire(Events_1.Events.NEXT_SEARCH_RESULT);
            });
            $.subscribe(Events_1.Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
                _this.fire(Events_1.Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
                _this.nextSearchResult();
            });
            $.subscribe(Events_1.Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
                _this.fire(Events_1.Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
                _this.prevSearchResult();
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_THUMBS_VIEW, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN_THUMBS_VIEW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_TREE_VIEW, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN_TREE_VIEW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.PAGE_DOWN, function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getNextPageIndex()]);
            });
            $.subscribe(Events_1.Events.PAGE_SEARCH, function (e, value) {
                _this.fire(Events_1.Events.PAGE_SEARCH, value);
                _this.viewLabel(value);
            });
            $.subscribe(BaseEvents_1.BaseEvents.PAGE_UP, function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getPrevPageIndex()]);
            });
            $.subscribe(Events_1.Events.PAGING_TOGGLED, function (e, obj) {
                _this.fire(Events_1.Events.PAGING_TOGGLED, obj);
            });
            $.subscribe(BaseEvents_1.BaseEvents.PLUS, function () {
                _this.centerPanel.setFocus();
            });
            $.subscribe(BaseEvents_1.BaseEvents.PREV, function () {
                _this.fire(BaseEvents_1.BaseEvents.PREV);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getPrevPageIndex()]);
            });
            $.subscribe(Events_1.Events.PREV_SEARCH_RESULT, function () {
                _this.fire(Events_1.Events.PREV_SEARCH_RESULT);
            });
            $.subscribe(Events_1.Events.PRINT, function () {
                _this.print();
            });
            $.subscribe(BaseEvents_1.BaseEvents.RELOAD, function () {
                $.publish(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHT_ARROW, function () {
                if (_this.useArrowKeysToNavigate()) {
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.getNextPageIndex()]);
                }
                else {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(Events_1.Events.SEADRAGON_ANIMATION, function () {
                _this.fire(Events_1.Events.SEADRAGON_ANIMATION);
            });
            $.subscribe(Events_1.Events.SEADRAGON_ANIMATION_FINISH, function (e, viewer) {
                var bounds = _this.centerPanel.getViewportBounds();
                if (_this.centerPanel && bounds) {
                    $.publish(Events_1.Events.XYWH_CHANGED, [bounds.toString()]);
                    _this.data.xywh = bounds.toString();
                    _this.fire(Events_1.Events.XYWH_CHANGED, _this.data.xywh);
                }
                var canvas = _this.helper.getCurrentCanvas();
                _this.fire(Events_1.Events.CURRENT_VIEW_URI, {
                    cropUri: _this.getCroppedImageUri(canvas, _this.getViewer()),
                    fullUri: _this.getConfinedImageUri(canvas, canvas.getWidth())
                });
            });
            $.subscribe(Events_1.Events.SEADRAGON_ANIMATION_START, function () {
                _this.fire(Events_1.Events.SEADRAGON_ANIMATION_START);
            });
            $.subscribe(Events_1.Events.SEADRAGON_OPEN, function () {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
                _this.fire(Events_1.Events.SEADRAGON_OPEN);
            });
            $.subscribe(Events_1.Events.SEADRAGON_RESIZE, function () {
                _this.fire(Events_1.Events.SEADRAGON_RESIZE);
            });
            $.subscribe(Events_1.Events.SEADRAGON_ROTATION, function (e, rotation) {
                _this.data.rotation = rotation;
                _this.fire(Events_1.Events.SEADRAGON_ROTATION, _this.data.rotation);
                _this.currentRotation = rotation;
            });
            $.subscribe(Events_1.Events.SEARCH, function (e, terms) {
                _this.fire(Events_1.Events.SEARCH, terms);
                _this.search(terms);
            });
            $.subscribe(Events_1.Events.SEARCH_PREVIEW_FINISH, function () {
                _this.fire(Events_1.Events.SEARCH_PREVIEW_FINISH);
            });
            $.subscribe(Events_1.Events.SEARCH_PREVIEW_START, function () {
                _this.fire(Events_1.Events.SEARCH_PREVIEW_START);
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS, function (e, obj) {
                _this.fire(BaseEvents_1.BaseEvents.ANNOTATIONS, obj);
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATION_CANVAS_CHANGED, function (e, rect) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [rect.canvasIndex]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS_EMPTY, function () {
                _this.fire(BaseEvents_1.BaseEvents.ANNOTATIONS_EMPTY);
            });
            $.subscribe(BaseEvents_1.BaseEvents.THUMB_SELECTED, function (e, thumb) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [thumb.index]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.TREE_NODE_SELECTED, function (e, node) {
                _this.fire(BaseEvents_1.BaseEvents.TREE_NODE_SELECTED, node.data.path);
                _this.treeNodeSelected(node);
            });
            $.subscribe(BaseEvents_1.BaseEvents.UP_ARROW, function () {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.UPDATE_SETTINGS, function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.helper.canvasIndex]);
                var settings = _this.getSettings();
                $.publish(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, [settings]);
            });
            // $.subscribe(Events.VIEW_PAGE, (e: any, index: number) => {
            //     this.fire(Events.VIEW_PAGE, index);
            //     $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [index]);
            // });
        };
        Extension.prototype.createModules = function () {
            _super.prototype.createModules.call(this);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel = new PagingHeaderPanel_1.PagingHeaderPanel(Shell_1.Shell.$headerPanel);
            }
            else {
                Shell_1.Shell.$headerPanel.hide();
            }
            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new ContentLeftPanel_1.ContentLeftPanel(Shell_1.Shell.$leftPanel);
            }
            else {
                Shell_1.Shell.$leftPanel.hide();
            }
            this.centerPanel = new SeadragonCenterPanel_1.SeadragonCenterPanel(Shell_1.Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(Shell_1.Shell.$rightPanel);
            }
            else {
                Shell_1.Shell.$rightPanel.hide();
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel_1.FooterPanel(Shell_1.Shell.$footerPanel);
                this.mobileFooterPanel = new MobileFooter_1.FooterPanel(Shell_1.Shell.$mobileFooterPanel);
            }
            else {
                Shell_1.Shell.$footerPanel.hide();
            }
            this.$helpDialogue = $('<div class="overlay help" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new HelpDialogue_1.HelpDialogue(this.$helpDialogue);
            this.$moreInfoDialogue = $('<div class="overlay moreInfo" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$moreInfoDialogue);
            this.moreInfoDialogue = new MoreInfoDialogue_1.MoreInfoDialogue(this.$moreInfoDialogue);
            this.$multiSelectDialogue = $('<div class="overlay multiSelect" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$multiSelectDialogue);
            this.multiSelectDialogue = new MultiSelectDialogue_1.MultiSelectDialogue(this.$multiSelectDialogue);
            this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
            this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$downloadDialogue);
            this.downloadDialogue = new DownloadDialogue_1.DownloadDialogue(this.$downloadDialogue);
            this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
            this.$externalContentDialogue = $('<div class="overlay externalContent" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$externalContentDialogue);
            this.externalContentDialogue = new ExternalContentDialogue_1.ExternalContentDialogue(this.$externalContentDialogue);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel.init();
            }
            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel.init();
            }
        };
        Extension.prototype.render = function () {
            _super.prototype.render.call(this);
            //Utils.Async.waitFor(() => {
            //    return this.centerPanel && this.centerPanel.isCreated;
            //}, () => {
            this.checkForAnnotations();
            this.checkForSearchParam();
            this.checkForRotationParam();
            //});
        };
        Extension.prototype.checkForAnnotations = function () {
            if (this.data.annotations) {
                var annotations = this.parseAnnotationList(this.data.annotations);
                $.publish(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS);
                this.annotate(annotations);
            }
        };
        Extension.prototype.annotate = function (annotations, terms) {
            this.annotations = annotations;
            // sort the annotations by canvasIndex
            this.annotations = annotations.sort(function (a, b) {
                return a.canvasIndex - b.canvasIndex;
            });
            var annotationResults = new AnnotationResults_1.AnnotationResults();
            annotationResults.terms = terms;
            annotationResults.annotations = this.annotations;
            $.publish(BaseEvents_1.BaseEvents.ANNOTATIONS, [annotationResults]);
            // reload current index as it may contain annotations.
            //$.publish(BaseEvents.CANVAS_INDEX_CHANGED, [this.helper.canvasIndex]);
        };
        Extension.prototype.checkForSearchParam = function () {
            // if a highlight param is set, use it to search.
            var highlight = this.data.highlight;
            if (highlight) {
                highlight.replace(/\+/g, " ").replace(/"/g, "");
                $.publish(Events_1.Events.SEARCH, [highlight]);
            }
        };
        Extension.prototype.checkForRotationParam = function () {
            // if a rotation value is passed, set rotation
            var rotation = this.data.rotation;
            if (rotation) {
                $.publish(Events_1.Events.SEADRAGON_ROTATION, [rotation]);
            }
        };
        Extension.prototype.viewPage = function (canvasIndex) {
            // if it's an invalid canvas index.
            if (canvasIndex === -1)
                return;
            var isReload = false;
            if (canvasIndex === this.helper.canvasIndex) {
                isReload = true;
            }
            if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
                this.showMessage(this.data.config.content.canvasIndexOutOfRange);
                canvasIndex = 0;
            }
            if (this.isPagingSettingEnabled() && !isReload) {
                var indices = this.getPagedIndices(canvasIndex);
                // if the page is already displayed, only advance canvasIndex.
                if (indices.includes(this.helper.canvasIndex)) {
                    this.viewCanvas(canvasIndex);
                    return;
                }
            }
            this.viewCanvas(canvasIndex);
        };
        Extension.prototype.getViewer = function () {
            return this.centerPanel.viewer;
        };
        Extension.prototype.getMode = function () {
            if (this.mode)
                return this.mode;
            switch (this.helper.getManifestType().toString()) {
                case manifesto.ManifestType.monograph().toString():
                    return Mode_1.Mode.page;
                case manifesto.ManifestType.manuscript().toString():
                    return Mode_1.Mode.page;
                default:
                    return Mode_1.Mode.image;
            }
        };
        Extension.prototype.getViewportBounds = function () {
            if (!this.centerPanel)
                return null;
            var bounds = this.centerPanel.getViewportBounds();
            if (bounds) {
                return bounds.toString();
            }
            return null;
        };
        Extension.prototype.getViewerRotation = function () {
            if (!this.centerPanel)
                return null;
            return this.currentRotation;
        };
        Extension.prototype.viewRange = function (path) {
            //this.currentRangePath = path;
            var range = this.helper.getRangeByPath(path);
            if (!range)
                return;
            var canvasId = range.getCanvasIds()[0];
            var index = this.helper.getCanvasIndexById(canvasId);
            $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [index]);
        };
        Extension.prototype.viewLabel = function (label) {
            if (!label) {
                this.showMessage(this.data.config.modules.genericDialogue.content.emptyValue);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            var index = this.helper.getCanvasIndexByLabel(label);
            if (index != -1) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [index]);
            }
            else {
                this.showMessage(this.data.config.modules.genericDialogue.content.pageNotFound);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
            }
        };
        Extension.prototype.treeNodeSelected = function (node) {
            var data = node.data;
            if (!data.type)
                return;
            switch (data.type) {
                case manifesto.IIIFResourceType.manifest().toString():
                    this.viewManifest(data);
                    break;
                case manifesto.IIIFResourceType.collection().toString():
                    // note: this won't get called as the tree component now has branchNodesSelectable = false
                    // useful to keep around for reference
                    this.viewCollection(data);
                    break;
                default:
                    this.viewRange(data.path);
                    break;
            }
        };
        Extension.prototype.clearAnnotations = function () {
            this.annotations = null;
            // reload current index as it may contain results.
            $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [this.helper.canvasIndex]);
        };
        Extension.prototype.prevSearchResult = function () {
            var foundResult;
            if (!this.annotations)
                return;
            // get the first result with a canvasIndex less than the current index.
            for (var i = this.annotations.length - 1; i >= 0; i--) {
                var result = this.annotations[i];
                if (result.canvasIndex <= this.getPrevPageIndex()) {
                    foundResult = result;
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [foundResult.canvasIndex]);
                    break;
                }
            }
        };
        Extension.prototype.nextSearchResult = function () {
            if (!this.annotations)
                return;
            // get the first result with an index greater than the current index.
            for (var i = 0; i < this.annotations.length; i++) {
                var result = this.annotations[i];
                if (result && result.canvasIndex >= this.getNextPageIndex()) {
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [result.canvasIndex]);
                    break;
                }
            }
        };
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.helper.getCurrentCanvas();
            var bookmark = new Bookmark_1.Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.LanguageMap.getValue(canvas.getLabel());
            bookmark.path = this.getCroppedImageUri(canvas, this.getViewer());
            bookmark.thumb = canvas.getCanonicalImageUri(this.data.config.options.bookmarkThumbWidth);
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            bookmark.type = manifesto.ResourceType.image().toString();
            this.fire(BaseEvents_1.BaseEvents.BOOKMARK, bookmark);
        };
        Extension.prototype.print = function () {
            // var args: MultiSelectionArgs = new MultiSelectionArgs();
            // args.manifestUri = this.helper.iiifResourceUri;
            // args.allCanvases = true;
            // args.format = this.data.config.options.printMimeType;
            // args.sequence = this.helper.getCurrentSequence().id;
            window.print();
            this.fire(Events_1.Events.PRINT);
        };
        Extension.prototype.getCroppedImageDimensions = function (canvas, viewer) {
            if (!viewer)
                return null;
            if (!viewer.viewport)
                return null;
            if (!canvas.getHeight() || !canvas.getWidth()) {
                return null;
            }
            var bounds = viewer.viewport.getBounds(true);
            var dimensions = new CroppedImageDimensions_1.CroppedImageDimensions();
            var width = Math.floor(bounds.width);
            var height = Math.floor(bounds.height);
            var x = Math.floor(bounds.x);
            var y = Math.floor(bounds.y);
            // constrain to image bounds
            if (x + width > canvas.getWidth()) {
                width = canvas.getWidth() - x;
            }
            else if (x < 0) {
                width = width + x;
            }
            if (x < 0) {
                x = 0;
            }
            if (y + height > canvas.getHeight()) {
                height = canvas.getHeight() - y;
            }
            else if (y < 0) {
                height = height + y;
            }
            if (y < 0) {
                y = 0;
            }
            width = Math.min(width, canvas.getWidth());
            height = Math.min(height, canvas.getHeight());
            var regionWidth = width;
            var regionHeight = height;
            var maxDimensions = canvas.getMaxDimensions();
            if (maxDimensions) {
                if (width > maxDimensions.width) {
                    var newWidth = maxDimensions.width;
                    height = Math.round(newWidth * (height / width));
                    width = newWidth;
                }
                if (height > maxDimensions.height) {
                    var newHeight = maxDimensions.height;
                    width = Math.round((width / height) * newHeight);
                    height = newHeight;
                }
            }
            dimensions.region = new manifesto.Size(regionWidth, regionHeight);
            dimensions.regionPos = new Point_1.Point(x, y);
            dimensions.size = new manifesto.Size(width, height);
            return dimensions;
        };
        // keep this around for reference
        // getOnScreenCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {
        //     if (!viewer) return null;
        //     if (!viewer.viewport) return null;
        //     if (!canvas.getHeight() || !canvas.getWidth()){
        //         return null;
        //     }
        //     var bounds = viewer.viewport.getBounds(true);
        //     var containerSize = viewer.viewport.getContainerSize();
        //     var zoom = viewer.viewport.getZoom(true);
        //     var top = Math.max(0, bounds.y);
        //     var left = Math.max(0, bounds.x);
        //     // change top to be normalised value proportional to height of image, not width (as per OSD).
        //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));
        //     // get on-screen pixel sizes.
        //     var viewportWidthPx = containerSize.x;
        //     var viewportHeightPx = containerSize.y;
        //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
        //     var ratio = canvas.getWidth() / imageWidthPx;
        //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));
        //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
        //     var viewportTopPx = parseInt(String(top * imageHeightPx));
        //     var rect1Left = 0;
        //     var rect1Right = imageWidthPx;
        //     var rect1Top = 0;
        //     var rect1Bottom = imageHeightPx;
        //     var rect2Left = viewportLeftPx;
        //     var rect2Right = viewportLeftPx + viewportWidthPx;
        //     var rect2Top = viewportTopPx;
        //     var rect2Bottom = viewportTopPx + viewportHeightPx;
        //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
        //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));
        //     // get original image pixel sizes.
        //     var ratio2 = canvas.getWidth() / imageWidthPx;
        //     var regionWidth = parseInt(String(sizeWidth * ratio2));
        //     var regionHeight = parseInt(String(sizeHeight * ratio2));
        //     var regionTop = parseInt(String(canvas.getHeight() * top));
        //     var regionLeft = parseInt(String(canvas.getWidth() * left));
        //     if (regionTop < 0) regionTop = 0;
        //     if (regionLeft < 0) regionLeft = 0;
        //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();
        //     dimensions.region = new manifesto.Size(regionWidth, regionHeight);
        //     dimensions.regionPos = new Point(regionLeft, regionTop);
        //     dimensions.size = new manifesto.Size(sizeWidth, sizeHeight);
        //     return dimensions;
        // }
        Extension.prototype.getCroppedImageUri = function (canvas, viewer) {
            if (!viewer)
                return null;
            if (!viewer.viewport)
                return null;
            var dimensions = this.getCroppedImageDimensions(canvas, viewer);
            if (!dimensions) {
                return null;
            }
            // construct uri
            // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            var baseUri = this.getImageBaseUri(canvas);
            var id = this.getImageId(canvas);
            if (!id) {
                return null;
            }
            var region = dimensions.regionPos.x + "," + dimensions.regionPos.y + "," + dimensions.region.width + "," + dimensions.region.height;
            var size = dimensions.size.width + ',' + dimensions.size.height;
            var rotation = this.getViewerRotation();
            var quality = 'default';
            return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
        };
        Extension.prototype.getConfinedImageDimensions = function (canvas, width) {
            var dimensions = new manifesto.Size(0, 0);
            dimensions.width = width;
            var normWidth = Utils.Maths.normalise(width, 0, canvas.getWidth());
            dimensions.height = Math.floor(canvas.getHeight() * normWidth);
            return dimensions;
        };
        Extension.prototype.getConfinedImageUri = function (canvas, width) {
            var baseUri = this.getImageBaseUri(canvas);
            // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            var id = this.getImageId(canvas);
            if (!id) {
                return null;
            }
            var region = 'full';
            var dimensions = this.getConfinedImageDimensions(canvas, width);
            var size = dimensions.width + ',' + dimensions.height;
            var rotation = this.getViewerRotation();
            var quality = 'default';
            return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
        };
        Extension.prototype.getImageId = function (canvas) {
            if (canvas.externalResource) {
                var id = canvas.externalResource.data['@id'];
                if (id) {
                    return id.substr(id.lastIndexOf("/") + 1);
                }
            }
            return null;
        };
        Extension.prototype.getImageBaseUri = function (canvas) {
            var uri = this.getInfoUri(canvas);
            // First trim off info.json, then trim off ID....
            uri = uri.substr(0, uri.lastIndexOf("/"));
            return uri.substr(0, uri.lastIndexOf("/"));
        };
        Extension.prototype.getInfoUri = function (canvas) {
            var infoUri = null;
            var images = canvas.getImages();
            if (images && images.length) {
                var firstImage = images[0];
                var resource = firstImage.getResource();
                var services = resource.getServices();
                for (var i = 0; i < services.length; i++) {
                    var service = services[i];
                    var id = service.id;
                    if (!id.endsWith('/')) {
                        id += '/';
                    }
                    if (manifesto.Utils.isImageProfile(service.getProfile())) {
                        infoUri = id + 'info.json';
                    }
                }
            }
            if (!infoUri) {
                // todo: use compiler flag (when available)
                infoUri = 'lib/imageunavailable.json';
            }
            return infoUri;
        };
        Extension.prototype.getEmbedScript = function (template, width, height, zoom, rotation) {
            var config = this.data.config.uri || '';
            var locales = this.getSerializedLocales();
            var appUri = this.getAppUri();
            var iframeSrc = appUri + "#?manifest=" + this.helper.iiifResourceUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&s=" + this.helper.sequenceIndex + "&cv=" + this.helper.canvasIndex + "&config=" + config + "&locales=" + locales + "&xywh=" + zoom + "&r=" + rotation;
            var script = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
            return script;
        };
        Extension.prototype.getPrevPageIndex = function (canvasIndex) {
            if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
            var index;
            if (this.isPagingSettingEnabled()) {
                var indices = this.getPagedIndices(canvasIndex);
                if (this.helper.isRightToLeft()) {
                    index = indices[indices.length - 1] - 1;
                }
                else {
                    index = indices[0] - 1;
                }
            }
            else {
                index = canvasIndex - 1;
            }
            return index;
        };
        Extension.prototype.isSearchEnabled = function () {
            if (!Utils.Bools.getBool(this.data.config.options.searchWithinEnabled, false)) {
                return false;
            }
            if (!this.helper.getSearchService()) {
                return false;
            }
            return true;
        };
        Extension.prototype.isPagingSettingEnabled = function () {
            if (this.helper.isPagingAvailable()) {
                return this.getSettings().pagingEnabled;
            }
            return false;
        };
        Extension.prototype.getNextPageIndex = function (canvasIndex) {
            if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
            var index;
            if (this.isPagingSettingEnabled()) {
                var indices = this.getPagedIndices(canvasIndex);
                if (this.helper.isRightToLeft()) {
                    index = indices[0] + 1;
                }
                else {
                    index = indices[indices.length - 1] + 1;
                }
            }
            else {
                index = canvasIndex + 1;
            }
            if (index > this.helper.getTotalCanvases() - 1) {
                return -1;
            }
            return index;
        };
        Extension.prototype.getAutoCompleteService = function () {
            var service = this.helper.getSearchService();
            if (!service)
                return null;
            return service.getService(manifesto.ServiceProfile.autoComplete());
        };
        Extension.prototype.getAutoCompleteUri = function () {
            var service = this.getAutoCompleteService();
            if (!service)
                return null;
            return service.id + '?q={0}';
        };
        Extension.prototype.getSearchServiceUri = function () {
            var service = this.helper.getSearchService();
            if (!service)
                return null;
            var uri = service.id;
            uri = uri + "?q={0}";
            return uri;
        };
        Extension.prototype.search = function (terms) {
            if (this.isAnnotating)
                return;
            this.isAnnotating = true;
            // clear search results
            this.annotations = [];
            var that = this;
            // searching
            var searchUri = this.getSearchServiceUri();
            if (!searchUri)
                return;
            searchUri = Utils.Strings.format(searchUri, terms);
            this.getSearchResults(searchUri, terms, this.annotations, function (annotations) {
                that.isAnnotating = false;
                if (annotations.length) {
                    that.annotate(annotations, terms);
                }
                else {
                    that.showMessage(that.data.config.modules.genericDialogue.content.noMatches, function () {
                        $.publish(BaseEvents_1.BaseEvents.ANNOTATIONS_EMPTY);
                    });
                }
            });
        };
        Extension.prototype.getSearchResults = function (searchUri, terms, searchResults, cb) {
            var _this = this;
            $.getJSON(searchUri, function (results) {
                if (results.resources && results.resources.length) {
                    searchResults = searchResults.concat(_this.parseAnnotationList(results));
                }
                if (results.next) {
                    _this.getSearchResults(results.next, terms, searchResults, cb);
                }
                else {
                    cb(searchResults);
                }
            });
        };
        Extension.prototype.parseAnnotationList = function (annotations) {
            var parsed = [];
            var _loop_1 = function (i) {
                var resource = annotations.resources[i];
                var canvasIndex = this_1.helper.getCanvasIndexById(resource.on.match(/(.*)#/)[1]);
                var annotationGroup = new AnnotationGroup(resource, canvasIndex);
                var match = parsed.en().where(function (x) { return x.canvasIndex === annotationGroup.canvasIndex; }).first();
                // if there's already an annotation for the canvas index, add a rect to it, otherwise create a new AnnotationGroup
                if (match) {
                    match.addRect(resource);
                }
                else {
                    parsed.push(annotationGroup);
                }
            };
            var this_1 = this;
            for (var i = 0; i < annotations.resources.length; i++) {
                _loop_1(i);
            }
            // sort by canvasIndex
            parsed.sort(function (a, b) {
                return a.canvasIndex - b.canvasIndex;
            });
            return parsed;
        };
        Extension.prototype.getAnnotationRects = function () {
            if (this.annotations) {
                return this.annotations.en().selectMany(function (x) { return x.rects; }).toArray();
            }
            return [];
        };
        Extension.prototype.getCurrentAnnotationRectIndex = function () {
            var annotationRects = this.getAnnotationRects();
            if (this.currentAnnotationRect) {
                return annotationRects.indexOf(this.currentAnnotationRect);
            }
            return -1;
        };
        Extension.prototype.getTotalAnnotationRects = function () {
            var annotationRects = this.getAnnotationRects();
            return annotationRects.length;
        };
        Extension.prototype.isFirstAnnotationRect = function () {
            return this.getCurrentAnnotationRectIndex() === 0;
        };
        Extension.prototype.getLastAnnotationRectIndex = function () {
            return this.getTotalAnnotationRects() - 1;
        };
        Extension.prototype.getPagedIndices = function (canvasIndex) {
            if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
            var indices = [];
            // if it's a continuous manifest, get all resources.
            if (this.helper.isContinuous()) {
                indices = $.map(this.helper.getCanvases(), function (c, index) {
                    return index;
                });
            }
            else {
                if (!this.isPagingSettingEnabled()) {
                    indices.push(this.helper.canvasIndex);
                }
                else {
                    if (this.helper.isFirstCanvas(canvasIndex) || (this.helper.isLastCanvas(canvasIndex) && this.helper.isTotalCanvasesEven())) {
                        indices = [canvasIndex];
                    }
                    else if (canvasIndex % 2) {
                        indices = [canvasIndex, canvasIndex + 1];
                    }
                    else {
                        indices = [canvasIndex - 1, canvasIndex];
                    }
                    if (this.helper.isRightToLeft()) {
                        indices = indices.reverse();
                    }
                }
            }
            return indices;
        };
        return Extension;
    }(BaseExtension_1.BaseExtension));
    exports.Extension = Extension;
});
