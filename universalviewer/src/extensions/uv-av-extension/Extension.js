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
define(["require", "exports", "../../modules/uv-avcenterpanel-module/AVCenterPanel", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-contentleftpanel-module/ContentLeftPanel", "./DownloadDialogue", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-avmobilefooterpanel-module/MobileFooter", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, AVCenterPanel_1, BaseEvents_1, BaseExtension_1, ContentLeftPanel_1, DownloadDialogue_1, FooterPanel_1, MobileFooter_1, HeaderPanel_1, MoreInfoRightPanel_1, SettingsDialogue_1, ShareDialogue_1, Shell_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Extension = /** @class */ (function (_super) {
        __extends(Extension, _super);
        function Extension() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Extension.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            //requirejs.config({shim: {'uv/lib/hls.min': { deps: ['require'], exports: "Hls"}}});
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.viewCanvas(canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.TREE_NODE_SELECTED, function (e, node) {
                _this.fire(BaseEvents_1.BaseEvents.TREE_NODE_SELECTED, node.data.path);
                _this.treeNodeSelected(node);
            });
            $.subscribe(BaseEvents_1.BaseEvents.THUMB_SELECTED, function (e, thumb) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [thumb.index]);
            });
        };
        Extension.prototype.dependencyLoaded = function (index, dep) {
            if (index === this.getDependencyIndex('waveform-data')) {
                window.WaveformData = dep;
            }
            else if (index === this.getDependencyIndex('hls')) {
                window.Hls = dep; //https://github.com/mrdoob/three.js/issues/9602
            }
        };
        Extension.prototype.createModules = function () {
            _super.prototype.createModules.call(this);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel = new HeaderPanel_1.HeaderPanel(Shell_1.Shell.$headerPanel);
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
            this.centerPanel = new AVCenterPanel_1.AVCenterPanel(Shell_1.Shell.$centerPanel);
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
            this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
            this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$downloadDialogue);
            this.downloadDialogue = new DownloadDialogue_1.DownloadDialogue(this.$downloadDialogue);
            this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
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
        Extension.prototype.isLeftPanelEnabled = function () {
            var isEnabled = _super.prototype.isLeftPanelEnabled.call(this);
            var tree = this.helper.getTree();
            if (tree && tree.nodes.length) {
                isEnabled = true;
            }
            return isEnabled;
        };
        Extension.prototype.render = function () {
            _super.prototype.render.call(this);
        };
        Extension.prototype.getEmbedScript = function (template, width, height) {
            var appUri = this.getAppUri();
            var iframeSrc = appUri + "#?manifest=" + this.helper.iiifResourceUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&s=" + this.helper.sequenceIndex + "&cv=" + this.helper.canvasIndex + "&rid=" + this.helper.rangeId;
            var script = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
            return script;
        };
        Extension.prototype.treeNodeSelected = function (node) {
            var data = node.data;
            if (!data.type)
                return;
            switch (data.type) {
                case manifesto.IIIFResourceType.manifest().toString():
                    // do nothing
                    break;
                case manifesto.IIIFResourceType.collection().toString():
                    // do nothing
                    break;
                default:
                    this.viewRange(data.path);
                    break;
            }
        };
        Extension.prototype.viewRange = function (path) {
            var range = this.helper.getRangeByPath(path);
            if (!range)
                return;
            $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [range]);
            // don't update the canvas index, only when thumbs are clicked
            // if (range.canvases && range.canvases.length) {
            //     const canvasId: string = range.canvases[0];
            //     const canvas: Manifesto.ICanvas | null = this.helper.getCanvasById(canvasId);
            //     if (canvas) {
            //         const canvasIndex: number = canvas.index;
            //         if (canvasIndex !== this.helper.canvasIndex) {
            //             $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [canvasIndex]);
            //         }
            //     }
            // }
        };
        return Extension;
    }(BaseExtension_1.BaseExtension));
    exports.Extension = Extension;
});
