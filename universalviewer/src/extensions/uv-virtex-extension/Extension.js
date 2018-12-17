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
define(["require", "exports", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "../../modules/uv-contentleftpanel-module/ContentLeftPanel", "./DownloadDialogue", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell", "../../modules/uv-virtexcenterpanel-module/VirtexCenterPanel"], function (require, exports, BaseEvents_1, BaseExtension_1, Bookmark_1, ContentLeftPanel_1, DownloadDialogue_1, FooterPanel_1, HeaderPanel_1, MoreInfoRightPanel_1, SettingsDialogue_1, ShareDialogue_1, Shell_1, VirtexCenterPanel_1) {
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
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.viewCanvas(canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.THUMB_SELECTED, function (e, canvasIndex) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [canvasIndex]);
            });
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
            this.centerPanel = new VirtexCenterPanel_1.VirtexCenterPanel(Shell_1.Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(Shell_1.Shell.$rightPanel);
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel_1.FooterPanel(Shell_1.Shell.$footerPanel);
            }
            else {
                Shell_1.Shell.$footerPanel.hide();
            }
            this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$downloadDialogue);
            this.downloadDialogue = new DownloadDialogue_1.DownloadDialogue(this.$downloadDialogue);
            this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
            this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
            else {
                Shell_1.Shell.$leftPanel.hide();
            }
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
            else {
                Shell_1.Shell.$rightPanel.hide();
            }
        };
        Extension.prototype.render = function () {
            _super.prototype.render.call(this);
        };
        Extension.prototype.dependencyLoaded = function (index, dep) {
            if (index === 0) {
                window.THREE = dep; //https://github.com/mrdoob/three.js/issues/9602
            }
        };
        Extension.prototype.isLeftPanelEnabled = function () {
            return Utils.Bools.getBool(this.data.config.options.leftPanelEnabled, true)
                && (this.helper.isMultiCanvas() || this.helper.isMultiSequence());
        };
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.helper.getCurrentCanvas();
            var bookmark = new Bookmark_1.Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.LanguageMap.getValue(canvas.getLabel());
            bookmark.thumb = canvas.getProperty('thumbnail');
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            bookmark.type = manifesto.ResourceType.physicalobject().toString();
            this.fire(BaseEvents_1.BaseEvents.BOOKMARK, bookmark);
        };
        Extension.prototype.getEmbedScript = function (template, width, height) {
            //const configUri: string = this.data.config.uri || '';
            //const script: string = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.data.embedScriptUri);
            var appUri = this.getAppUri();
            var iframeSrc = appUri + "#?manifest=" + this.helper.iiifResourceUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&s=" + this.helper.sequenceIndex + "&cv=" + this.helper.canvasIndex;
            var script = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
            return script;
        };
        return Extension;
    }(BaseExtension_1.BaseExtension));
    exports.Extension = Extension;
});
