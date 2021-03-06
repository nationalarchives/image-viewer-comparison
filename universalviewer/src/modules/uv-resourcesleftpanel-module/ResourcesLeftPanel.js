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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/LeftPanel", "./ThumbsView"], function (require, exports, BaseEvents_1, LeftPanel_1, ThumbsView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourcesLeftPanel = /** @class */ (function (_super) {
        __extends(ResourcesLeftPanel, _super);
        function ResourcesLeftPanel($element) {
            return _super.call(this, $element) || this;
        }
        ResourcesLeftPanel.prototype.create = function () {
            this.setConfig('resourcesLeftPanel');
            _super.prototype.create.call(this);
            this.setTitle(this.content.title);
            /*
             TODO: make tabs work
            this.$tabs = $('<div class="tabs"></div>');
            this.$main.append(this.$tabs);
    
            this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
            this.$thumbsButton.prop('title', this.content.thumbnails);
            this.$tabs.append(this.$thumbsButton);
    
            this.$resourcesButton = $('<a class="resources tab">' + this.content.resources+ '</a>');
            this.$resourcesButton.prop('title', this.content.resources);
            this.$tabs.append(this.$resourcesButton);
             */
            this.$tabsContent = $('<div class="tabsContent"></div>');
            this.$main.append(this.$tabsContent);
            this.$views = $('<div class="views"></div>');
            this.$tabsContent.append(this.$views);
            this.$thumbsView = $('<div class="thumbsView"></div>');
            this.$views.append(this.$thumbsView);
            this.$resourcesView = $('<div class="resourcesView"></div>');
            this.$resources = $('<ul></ul>');
            this.$resourcesView.append(this.$resources);
            this.$views.append(this.$resourcesView);
            this.thumbsView = new ThumbsView_1.ThumbsView(this.$thumbsView);
            this.dataBind();
        };
        ResourcesLeftPanel.prototype.dataBind = function () {
            this.dataBindThumbsView();
            var annotations = this.extension.helper.getCurrentCanvas().getResources();
            if (annotations.length === 0) {
                this.$resourcesView.hide();
            }
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                var resource = annotation.getResource();
                if (resource) {
                    var label = Manifesto.LanguageMap.getValue(resource.getLabel());
                    if (label) {
                        var mime = Utils.Files.simplifyMimeType(resource.getFormat().toString());
                        var $listItem = $('<li><a href="' + resource.id + '" target="_blank">' + label + ' (' + mime + ')' + '</li>');
                        this.$resources.append($listItem);
                    }
                }
            }
        };
        ResourcesLeftPanel.prototype.dataBindThumbsView = function () {
            if (!this.thumbsView)
                return;
            var width;
            var height;
            var viewingDirection = this.extension.helper.getViewingDirection();
            if (viewingDirection && (viewingDirection.toString() === manifesto.ViewingDirection.leftToRight().toString() || viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString())) {
                width = this.config.options.twoColThumbWidth;
                height = this.config.options.twoColThumbHeight;
            }
            else {
                width = this.config.options.oneColThumbWidth;
                height = this.config.options.oneColThumbHeight;
            }
            if (typeof (width) === "undefined") {
                width = 100;
            }
            if (typeof (height) === "undefined") {
                height = 100;
            }
            this.thumbsView.thumbs = this.extension.helper.getThumbs(width, height);
            // hide thumb selector for single-part manifests
            if (this.thumbsView.thumbs.length < 2) {
                this.$thumbsView.hide();
            }
            this.thumbsView.databind();
        };
        ResourcesLeftPanel.prototype.expandFullStart = function () {
            _super.prototype.expandFullStart.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START);
        };
        ResourcesLeftPanel.prototype.expandFullFinish = function () {
            _super.prototype.expandFullFinish.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
        };
        ResourcesLeftPanel.prototype.collapseFullStart = function () {
            _super.prototype.collapseFullStart.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
        };
        ResourcesLeftPanel.prototype.collapseFullFinish = function () {
            _super.prototype.collapseFullFinish.call(this);
            $.publish(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
        };
        ResourcesLeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$views.height(this.$main.height());
            this.$resources.height(this.$main.height());
        };
        return ResourcesLeftPanel;
    }(LeftPanel_1.LeftPanel));
    exports.ResourcesLeftPanel = ResourcesLeftPanel;
});
