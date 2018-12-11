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
define(["require", "exports", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "./DownloadDialogue", "./Events", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-dialogues-module/HelpDialogue", "../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, BaseEvents_1, BaseExtension_1, Bookmark_1, DownloadDialogue_1, Events_1, FooterPanel_1, HeaderPanel_1, HelpDialogue_1, MediaElementCenterPanel_1, MoreInfoRightPanel_1, ResourcesLeftPanel_1, SettingsDialogue_1, ShareDialogue_1, Shell_1) {
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
            $.subscribe(BaseEvents_1.BaseEvents.THUMB_SELECTED, function (e, thumb) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [thumb.index]);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START, function () {
                Shell_1.Shell.$centerPanel.hide();
                Shell_1.Shell.$rightPanel.hide();
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
                Shell_1.Shell.$centerPanel.show();
                Shell_1.Shell.$rightPanel.show();
                _this.resize();
            });
            $.subscribe(Events_1.Events.MEDIA_ENDED, function () {
                _this.fire(Events_1.Events.MEDIA_ENDED);
            });
            $.subscribe(Events_1.Events.MEDIA_PAUSED, function () {
                _this.fire(Events_1.Events.MEDIA_PAUSED);
            });
            $.subscribe(Events_1.Events.MEDIA_PLAYED, function () {
                _this.fire(Events_1.Events.MEDIA_PLAYED);
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
            this.centerPanel = new MediaElementCenterPanel_1.MediaElementCenterPanel(Shell_1.Shell.$centerPanel);
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
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.extensions.helper.getCurrentCanvas();
            var bookmark = new Bookmark_1.Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.LanguageMap.getValue(canvas.getLabel());
            bookmark.thumb = canvas.getProperty('thumbnail');
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            if (this.isVideo()) {
                bookmark.type = manifesto.ResourceType.movingimage().toString();
            }
            else {
                bookmark.type = manifesto.ResourceType.sound().toString();
            }
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
        // todo: use canvas.getThumbnail()
        Extension.prototype.getPosterImageUri = function () {
            var canvas = this.helper.getCurrentCanvas();
            var annotations = canvas.getContent();
            if (annotations && annotations.length) {
                return annotations[0].getProperty('thumbnail');
            }
            else {
                return canvas.getProperty('thumbnail');
            }
        };
        Extension.prototype.isVideoFormat = function (type) {
            var videoFormats = [manifesto.MediaType.mp4().toString(), manifesto.MediaType.webm().toString()];
            return videoFormats.indexOf(type) != -1;
        };
        Extension.prototype.isVideo = function () {
            var canvas = this.helper.getCurrentCanvas();
            var annotations = canvas.getContent();
            if (annotations && annotations.length) {
                var formats = this.getMediaFormats(canvas);
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i];
                    var type = format.getFormat();
                    if (type) {
                        if (this.isVideoFormat(type.toString())) {
                            return true;
                        }
                    }
                }
            }
            else {
                var type = canvas.getType();
                if (type) {
                    return type.toString() === manifesto.ResourceType.movingimage().toString();
                }
            }
            throw (new Error("Unable to determine media type"));
        };
        return Extension;
    }(BaseExtension_1.BaseExtension));
    exports.Extension = Extension;
});
