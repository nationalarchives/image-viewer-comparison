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
define(["require", "exports", "../uv-shared-module/BaseEvents", "./GalleryView", "../uv-shared-module/LeftPanel", "../../extensions/uv-seadragon-extension/Mode", "./ThumbsView", "./TreeView"], function (require, exports, BaseEvents_1, GalleryView_1, LeftPanel_1, Mode_1, ThumbsView_1, TreeView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentLeftPanel = /** @class */ (function (_super) {
        __extends(ContentLeftPanel, _super);
        function ContentLeftPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this.expandFullEnabled = false;
            _this.isThumbsViewOpen = false;
            _this.isTreeViewOpen = false;
            _this.treeSortType = Manifold.TreeSortType.NONE;
            return _this;
        }
        ContentLeftPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, function () {
                _this.databind();
            });
            $.subscribe(BaseEvents_1.BaseEvents.GALLERY_THUMB_SELECTED, function () {
                _this.collapseFull();
            });
            $.subscribe(BaseEvents_1.BaseEvents.METRIC_CHANGED, function () {
                if (!_this.extension.isDesktopMetric()) {
                    if (_this.isFullyExpanded) {
                        _this.collapseFull();
                    }
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS_CLEARED, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS_EMPTY, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function () {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                _this.selectCurrentTreeNode();
                _this.updateTreeTabBySelection();
            });
            $.subscribe(BaseEvents_1.BaseEvents.RANGE_CHANGED, function () {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                _this.selectCurrentTreeNode();
                _this.updateTreeTabBySelection();
            });
            this.$tabs = $('<div class="tabs"></div>');
            this.$main.append(this.$tabs);
            this.$treeButton = $('<a class="index tab" tabindex="0">' + this.content.index + '</a>');
            this.$tabs.append(this.$treeButton);
            this.$thumbsButton = $('<a class="thumbs tab" tabindex="0">' + this.content.thumbnails + '</a>');
            this.$thumbsButton.prop('title', this.content.thumbnails);
            this.$tabs.append(this.$thumbsButton);
            this.$tabsContent = $('<div class="tabsContent"></div>');
            this.$main.append(this.$tabsContent);
            this.$options = $('<div class="options"></div>');
            this.$tabsContent.append(this.$options);
            this.$topOptions = $('<div class="top"></div>');
            this.$options.append(this.$topOptions);
            this.$treeSelect = $('<select aria-label="' + this.content.manifestRanges + '"></select>');
            this.$topOptions.append(this.$treeSelect);
            this.$bottomOptions = $('<div class="bottom"></div>');
            this.$options.append(this.$bottomOptions);
            this.$leftOptions = $('<div class="left"></div>');
            this.$bottomOptions.append(this.$leftOptions);
            this.$rightOptions = $('<div class="right"></div>');
            this.$bottomOptions.append(this.$rightOptions);
            this.$treeViewOptions = $('<div class="treeView"></div>');
            this.$leftOptions.append(this.$treeViewOptions);
            this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + '</span>');
            this.$treeViewOptions.append(this.$sortByLabel);
            this.$sortButtonGroup = $('<div class="btn-group"></div>');
            this.$treeViewOptions.append(this.$sortButtonGroup);
            this.$sortByDateButton = $('<button class="btn tabindex="0"">' + this.content.date + '</button>');
            this.$sortButtonGroup.append(this.$sortByDateButton);
            this.$sortByVolumeButton = $('<button class="btn" tabindex="0">' + this.content.volume + '</button>');
            this.$sortButtonGroup.append(this.$sortByVolumeButton);
            this.$views = $('<div class="views"></div>');
            this.$tabsContent.append(this.$views);
            this.$treeView = $('<div class="treeView"></div>');
            this.$views.append(this.$treeView);
            this.$thumbsView = $('<div class="thumbsView" tabindex="0"></div>');
            this.$views.append(this.$thumbsView);
            this.$galleryView = $('<div class="galleryView"></div>');
            this.$views.append(this.$galleryView);
            this.$treeSelect.hide();
            this.$treeSelect.change(function () {
                _this.databindTreeView();
                _this.selectCurrentTreeNode();
                _this.updateTreeTabBySelection();
            });
            this.$sortByDateButton.on('click', function () {
                _this.sortByDate();
            });
            this.$sortByVolumeButton.on('click', function () {
                _this.sortByVolume();
            });
            this.$treeViewOptions.hide();
            this.$treeButton.onPressed(function () {
                _this.openTreeView();
            });
            this.$thumbsButton.onPressed(function () {
                _this.openThumbsView();
            });
            this.setTitle(this.content.title);
            this.$sortByVolumeButton.addClass('on');
            var tabOrderConfig = this.options.tabOrder;
            if (tabOrderConfig) {
                // sort tabs
                tabOrderConfig = tabOrderConfig.toLowerCase();
                tabOrderConfig = tabOrderConfig.replace(/ /g, "");
                var tabOrder = tabOrderConfig.split(',');
                if (tabOrder[0] === 'thumbs') {
                    this.$treeButton.before(this.$thumbsButton);
                    this.$thumbsButton.addClass('first');
                }
                else {
                    this.$treeButton.addClass('first');
                }
            }
        };
        ContentLeftPanel.prototype.createTreeView = function () {
            this.treeView = new TreeView_1.TreeView(this.$treeView);
            this.treeView.treeData = this.getTreeData();
            this.treeView.setup();
            this.databindTreeView();
            // populate the tree select drop down when there are multiple top-level ranges
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                for (var i = 0; i < topRanges.length; i++) {
                    var range = topRanges[i];
                    this.$treeSelect.append('<option value="' + range.id + '">' + Manifesto.LanguageMap.getValue(range.getLabel()) + '</option>');
                }
            }
            this.updateTreeViewOptions();
        };
        ContentLeftPanel.prototype.databind = function () {
            this.databindThumbsView();
            this.databindTreeView();
            this.databindGalleryView();
        };
        ContentLeftPanel.prototype.updateTreeViewOptions = function () {
            var treeData = this.getTree();
            if (!treeData) {
                return;
            }
            if (this.isCollection() && this.extension.helper.treeHasNavDates(treeData)) {
                this.$treeViewOptions.show();
            }
            else {
                this.$treeViewOptions.hide();
            }
            if (this.$treeSelect.find('option').length) {
                this.$treeSelect.show();
            }
            else {
                this.$treeSelect.hide();
            }
        };
        ContentLeftPanel.prototype.sortByDate = function () {
            this.treeSortType = Manifold.TreeSortType.DATE;
            this.treeView.treeData = this.getTreeData();
            this.treeView.databind();
            this.selectCurrentTreeNode();
            this.$sortByDateButton.addClass('on');
            this.$sortByVolumeButton.removeClass('on');
            this.resize();
        };
        ContentLeftPanel.prototype.sortByVolume = function () {
            this.treeSortType = Manifold.TreeSortType.NONE;
            this.treeView.treeData = this.getTreeData();
            this.treeView.databind();
            this.selectCurrentTreeNode();
            this.$sortByDateButton.removeClass('on');
            this.$sortByVolumeButton.addClass('on');
            this.resize();
        };
        ContentLeftPanel.prototype.isCollection = function () {
            var treeData = this.getTree();
            if (treeData) {
                return treeData.data.type === manifesto.TreeNodeType.collection().toString();
            }
            throw new Error("Tree not available");
        };
        ContentLeftPanel.prototype.databindTreeView = function () {
            if (!this.treeView)
                return;
            this.treeView.treeData = this.getTreeData();
            this.treeView.databind();
            this.selectCurrentTreeNode();
        };
        ContentLeftPanel.prototype.getTreeData = function () {
            return {
                autoExpand: this._isTreeAutoExpanded(),
                branchNodesExpandOnClick: Utils.Bools.getBool(this.config.options.branchNodesExpandOnClick, true),
                branchNodesSelectable: Utils.Bools.getBool(this.config.options.branchNodesSelectable, false),
                helper: this.extension.helper,
                topRangeIndex: this.getSelectedTopRangeIndex(),
                treeSortType: this.treeSortType
            };
        };
        ContentLeftPanel.prototype._isTreeAutoExpanded = function () {
            var autoExpandTreeEnabled = Utils.Bools.getBool(this.config.options.autoExpandTreeEnabled, false);
            var autoExpandTreeIfFewerThan = this.config.options.autoExpandTreeIfFewerThan || 0;
            if (autoExpandTreeEnabled) {
                // get total number of tree nodes
                var flatTree = this.extension.helper.getFlattenedTree();
                if (flatTree.length < autoExpandTreeIfFewerThan) {
                    return true;
                }
            }
            return false;
        };
        ContentLeftPanel.prototype.updateTreeTabByCanvasIndex = function () {
            // update tab to current top range label (if there is one)
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                var index = this.getCurrentCanvasTopRangeIndex();
                if (index === -1) {
                    return;
                }
                var currentRange = topRanges[index];
                this.setTreeTabTitle(Manifesto.LanguageMap.getValue(currentRange.getLabel()));
            }
            else {
                this.setTreeTabTitle(this.content.index);
            }
        };
        ContentLeftPanel.prototype.setTreeTabTitle = function (title) {
            this.$treeButton.text(title);
            this.$treeButton.prop('title', title);
        };
        ContentLeftPanel.prototype.updateTreeTabBySelection = function () {
            var title = null;
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                if (this.treeView) {
                    title = this.getSelectedTree().text();
                }
                else {
                    title = Manifesto.LanguageMap.getValue(topRanges[0].getLabel());
                }
            }
            if (title) {
                this.setTreeTabTitle(title);
            }
            else {
                this.setTreeTabTitle(this.content.index);
            }
        };
        ContentLeftPanel.prototype.getViewingHint = function () {
            return this.extension.helper.getViewingHint();
        };
        ContentLeftPanel.prototype.getViewingDirection = function () {
            return this.extension.helper.getViewingDirection();
        };
        ContentLeftPanel.prototype.createThumbsView = function () {
            this.thumbsView = new ThumbsView_1.ThumbsView(this.$thumbsView);
            this.databindThumbsView();
        };
        ContentLeftPanel.prototype.databindThumbsView = function () {
            if (!this.thumbsView)
                return;
            var width;
            var height;
            var viewingHint = this.getViewingHint();
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection && (viewingDirection.toString() === manifesto.ViewingDirection.leftToRight().toString() || viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString())) {
                width = this.config.options.twoColThumbWidth;
                height = this.config.options.twoColThumbHeight;
            }
            else if (viewingHint && viewingHint.toString() === manifesto.ViewingHint.paged().toString()) {
                width = this.config.options.twoColThumbWidth;
                height = this.config.options.twoColThumbHeight;
            }
            else {
                width = this.config.options.oneColThumbWidth;
                height = this.config.options.oneColThumbHeight;
            }
            var thumbs = this.extension.helper.getThumbs(width, height);
            if (viewingDirection && viewingDirection.toString() === manifesto.ViewingDirection.bottomToTop().toString()) {
                thumbs.reverse();
            }
            // add a search result icon for pages with results
            var searchResults = this.extension.annotations;
            if (searchResults && searchResults.length) {
                var _loop_1 = function (i) {
                    var searchResult = searchResults[i];
                    // find the thumb with the same canvasIndex and add the searchResult
                    var thumb = thumbs.en().where(function (t) { return t.index === searchResult.canvasIndex; }).first();
                    if (thumb) {
                        // clone the data so searchResults isn't persisted on the canvas.
                        var data = $.extend(true, {}, thumb.data);
                        data.searchResults = searchResult.rects.length;
                        thumb.data = data;
                    }
                };
                for (var i = 0; i < searchResults.length; i++) {
                    _loop_1(i);
                }
            }
            this.thumbsView.thumbs = thumbs;
            this.thumbsView.databind();
        };
        ContentLeftPanel.prototype.createGalleryView = function () {
            this.galleryView = new GalleryView_1.GalleryView(this.$galleryView);
            this.galleryView.galleryData = this.getGalleryData();
            this.galleryView.setup();
            this.databindGalleryView();
        };
        ContentLeftPanel.prototype.databindGalleryView = function () {
            if (!this.galleryView)
                return;
            this.galleryView.galleryData = this.getGalleryData();
            this.galleryView.databind();
        };
        ContentLeftPanel.prototype.getGalleryData = function () {
            return {
                helper: this.extension.helper,
                chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
                content: this.config.content,
                debug: false,
                imageFadeInDuration: 300,
                initialZoom: 6,
                minLabelWidth: 20,
                pageModeEnabled: this.isPageModeEnabled(),
                scrollStopDuration: 100,
                searchResults: this.extension.annotations,
                sizingEnabled: Modernizr.inputtypes.range,
                thumbHeight: this.config.options.galleryThumbHeight,
                thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
                thumbWidth: this.config.options.galleryThumbWidth,
                viewingDirection: this.getViewingDirection()
            };
        };
        ContentLeftPanel.prototype.isPageModeEnabled = function () {
            // todo: checks if the panel is being used in the openseadragon extension.
            // pass a `isPageModeEnabled` function to the panel's constructor instead?
            if (typeof this.extension.getMode === "function") {
                return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && this.extension.getMode().toString() === Mode_1.Mode.page.toString();
            }
            return Utils.Bools.getBool(this.config.options.pageModeEnabled, true);
        };
        ContentLeftPanel.prototype.getSelectedTree = function () {
            return this.$treeSelect.find(':selected');
        };
        ContentLeftPanel.prototype.getSelectedTopRangeIndex = function () {
            var topRangeIndex = this.getSelectedTree().index();
            if (topRangeIndex === -1) {
                topRangeIndex = 0;
            }
            return topRangeIndex;
        };
        ContentLeftPanel.prototype.getTree = function () {
            var topRangeIndex = this.getSelectedTopRangeIndex();
            return this.extension.helper.getTree(topRangeIndex, Manifold.TreeSortType.NONE);
        };
        ContentLeftPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);
            if (this.isUnopened) {
                var treeEnabled = Utils.Bools.getBool(this.config.options.treeEnabled, true);
                var thumbsEnabled = Utils.Bools.getBool(this.config.options.thumbsEnabled, true);
                var treeData = this.getTree();
                if (!treeData || !treeData.nodes.length) {
                    treeEnabled = false;
                }
                // hide the tabs if either tree or thumbs are disabled
                if (!treeEnabled || !thumbsEnabled)
                    this.$tabs.hide();
                if (thumbsEnabled && this.defaultToThumbsView()) {
                    this.openThumbsView();
                }
                else if (treeEnabled) {
                    this.openTreeView();
                }
            }
        };
        ContentLeftPanel.prototype.defaultToThumbsView = function () {
            var defaultToTreeEnabled = Utils.Bools.getBool(this.config.options.defaultToTreeEnabled, false);
            var defaultToTreeIfGreaterThan = this.config.options.defaultToTreeIfGreaterThan || 0;
            var treeData = this.getTree();
            if (defaultToTreeEnabled) {
                if (treeData && treeData.nodes.length > defaultToTreeIfGreaterThan) {
                    return false;
                }
            }
            return true;
        };
        ContentLeftPanel.prototype.expandFullStart = function () {
            _super.prototype.expandFullStart.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START);
        };
        ContentLeftPanel.prototype.expandFullFinish = function () {
            _super.prototype.expandFullFinish.call(this);
            if (this.$treeButton.hasClass('on')) {
                this.openTreeView();
            }
            else if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
        };
        ContentLeftPanel.prototype.collapseFullStart = function () {
            _super.prototype.collapseFullStart.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
        };
        ContentLeftPanel.prototype.collapseFullFinish = function () {
            _super.prototype.collapseFullFinish.call(this);
            // todo: write a more generic tabs system with base tab class.
            // thumbsView may not necessarily have been created yet.
            // replace thumbsView with galleryView.
            if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
        };
        ContentLeftPanel.prototype.openTreeView = function () {
            this.isTreeViewOpen = true;
            this.isThumbsViewOpen = false;
            if (!this.treeView) {
                this.createTreeView();
            }
            this.$treeButton.addClass('on');
            this.$thumbsButton.removeClass('on');
            this.treeView.show();
            if (this.thumbsView)
                this.thumbsView.hide();
            if (this.galleryView)
                this.galleryView.hide();
            this.updateTreeViewOptions();
            this.selectCurrentTreeNode();
            this.resize();
            this.treeView.resize();
            $.publish(BaseEvents_1.BaseEvents.OPEN_TREE_VIEW);
        };
        ContentLeftPanel.prototype.openThumbsView = function () {
            this.isTreeViewOpen = false;
            this.isThumbsViewOpen = true;
            if (!this.thumbsView) {
                this.createThumbsView();
            }
            if (this.isFullyExpanded && !this.galleryView) {
                this.createGalleryView();
            }
            this.$treeButton.removeClass('on');
            this.$thumbsButton.addClass('on');
            if (this.treeView)
                this.treeView.hide();
            this.$treeSelect.hide();
            this.$treeViewOptions.hide();
            this.resize();
            if (this.isFullyExpanded) {
                this.thumbsView.hide();
                if (this.galleryView)
                    this.galleryView.show();
                if (this.galleryView)
                    this.galleryView.resize();
            }
            else {
                if (this.galleryView)
                    this.galleryView.hide();
                this.thumbsView.show();
                this.thumbsView.resize();
            }
            $.publish(BaseEvents_1.BaseEvents.OPEN_THUMBS_VIEW);
        };
        ContentLeftPanel.prototype.selectTopRangeIndex = function (index) {
            this.$treeSelect.prop('selectedIndex', index);
        };
        ContentLeftPanel.prototype.getCurrentCanvasTopRangeIndex = function () {
            var topRangeIndex = -1;
            var range = this.extension.getCurrentCanvasRange();
            if (range) {
                topRangeIndex = Number(range.path.split('/')[0]);
            }
            return topRangeIndex;
        };
        ContentLeftPanel.prototype.selectCurrentTreeNode = function () {
            // todo: merge selectCurrentTreeNodeByCanvas and selectCurrentTreeNodeByRange
            // the openseadragon extension should keep track of the current range instead of using canvas index
            if (this.extension.name === 'uv-seadragon-extension') {
                this.selectCurrentTreeNodeByCanvas();
            }
            else {
                this.selectCurrentTreeNodeByRange();
            }
        };
        ContentLeftPanel.prototype.selectCurrentTreeNodeByRange = function () {
            if (this.treeView) {
                var range = this.extension.helper.getCurrentRange();
                var node = null;
                if (range && range.treeNode) {
                    node = this.treeView.getNodeById(range.treeNode.id);
                }
                if (node) {
                    this.treeView.selectNode(node);
                }
                else {
                    this.treeView.deselectCurrentNode();
                }
            }
        };
        ContentLeftPanel.prototype.selectCurrentTreeNodeByCanvas = function () {
            if (this.treeView) {
                var node = null;
                var currentCanvasTopRangeIndex = this.getCurrentCanvasTopRangeIndex();
                var selectedTopRangeIndex = this.getSelectedTopRangeIndex();
                var usingCorrectTree = currentCanvasTopRangeIndex === selectedTopRangeIndex;
                var range = null;
                if (currentCanvasTopRangeIndex !== -1) {
                    range = this.extension.getCurrentCanvasRange();
                    //range = this.extension.helper.getCurrentRange();
                    if (range && range.treeNode) {
                        node = this.treeView.getNodeById(range.treeNode.id);
                    }
                }
                // use manifest root node
                // if (!node){
                //     id = this.extension.helper.manifest.defaultTree.id;
                //     node = this.treeView.getNodeById(id);
                // }
                if (node && usingCorrectTree) {
                    this.treeView.selectNode(node);
                }
                else {
                    range = this.extension.helper.getCurrentRange();
                    if (range && range.treeNode) {
                        node = this.treeView.getNodeById(range.treeNode.id);
                    }
                    if (node) {
                        this.treeView.selectNode(node);
                    }
                    else {
                        this.treeView.deselectCurrentNode();
                    }
                }
            }
        };
        ContentLeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
            this.$views.height(this.$tabsContent.height() - this.$options.outerHeight());
        };
        return ContentLeftPanel;
    }(LeftPanel_1.LeftPanel));
    exports.ContentLeftPanel = ContentLeftPanel;
});
