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
define(["require", "exports", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-filelinkcenterpanel-module/FileLinkCenterPanel", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-dialogues-module/HelpDialogue", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, BaseEvents_1, BaseExtension_1, FileLinkCenterPanel_1, FooterPanel_1, HeaderPanel_1, HelpDialogue_1, MoreInfoRightPanel_1, ResourcesLeftPanel_1, SettingsDialogue_1, ShareDialogue_1, Shell_1) {
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
            // listen for mediaelement enter/exit fullscreen events.
            $(window).bind('enterfullscreen', function () {
                $.publish(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN);
            });
            $(window).bind('exitfullscreen', function () {
                $.publish(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN);
            });
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
                this.leftPanel = new ResourcesLeftPanel_1.ResourcesLeftPanel(Shell_1.Shell.$leftPanel);
            }
            this.centerPanel = new FileLinkCenterPanel_1.FileLinkCenterPanel(Shell_1.Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(Shell_1.Shell.$rightPanel);
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel_1.FooterPanel(Shell_1.Shell.$footerPanel);
            }
            else {
                Shell_1.Shell.$footerPanel.hide();
            }
            this.$helpDialogue = $('<div class="overlay help" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new HelpDialogue_1.HelpDialogue(this.$helpDialogue);
            this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
            this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
        };
        Extension.prototype.render = function () {
            _super.prototype.render.call(this);
        };
        Extension.prototype.isLeftPanelEnabled = function () {
            return Utils.Bools.getBool(this.data.config.options.leftPanelEnabled, true)
                && ((this.helper.isMultiCanvas() || this.helper.isMultiSequence()) || this.helper.hasResources());
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
