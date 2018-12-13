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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../../extensions/uv-mediaelement-extension/Events", "../uv-shared-module/CenterPanel"], function (require, exports, BaseEvents_1, Events_1, CenterPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MediaElementCenterPanel = /** @class */ (function (_super) {
        __extends(MediaElementCenterPanel, _super);
        function MediaElementCenterPanel($element) {
            return _super.call(this, $element) || this;
        }
        MediaElementCenterPanel.prototype.create = function () {
            this.setConfig('mediaelementCenterPanel');
            _super.prototype.create.call(this);
            var that = this;
            // events.
            // only full screen video
            if (this.isVideo()) {
                $.subscribe(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN, function () {
                    if (that.component.isFullScreen) {
                        that.player.enterFullScreen(false);
                    }
                    else {
                        that.player.exitFullScreen(false);
                    }
                });
            }
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                that.openMedia(resources);
            });
            this.$container = $('<div class="container"></div>');
            this.$content.append(this.$container);
            this.title = this.extension.helper.getLabel();
        };
        MediaElementCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            var that = this;
            this.extension.getExternalResources(resources).then(function () {
                _this.$container.empty();
                var canvas = _this.extension.helper.getCurrentCanvas();
                _this.mediaHeight = _this.config.defaultHeight;
                _this.mediaWidth = _this.config.defaultWidth;
                _this.$container.height(_this.mediaHeight);
                _this.$container.width(_this.mediaWidth);
                var poster = _this.extension.getPosterImageUri();
                var sources = [];
                var renderings = canvas.getRenderings();
                if (renderings && renderings.length) {
                    canvas.getRenderings().forEach(function (rendering) {
                        sources.push({
                            type: rendering.getFormat().toString(),
                            src: rendering.id
                        });
                    });
                }
                else {
                    var formats = _this.extension.getMediaFormats(_this.extension.helper.getCurrentCanvas());
                    if (formats && formats.length) {
                        formats.forEach(function (format) {
                            var type = format.getFormat();
                            if (type) {
                                sources.push({
                                    type: type.toString(),
                                    src: format.id
                                });
                            }
                        });
                    }
                }
                if (_this.isVideo()) {
                    _this.$media = $('<video controls="controls" preload="none"></video>');
                    _this.$container.append(_this.$media);
                    _this.player = new MediaElementPlayer($('video')[0], {
                        //pluginPath: this.extension.data.root + 'lib/mediaelement/',
                        poster: poster,
                        features: ['playpause', 'current', 'progress', 'volume'],
                        success: function (mediaElement, originalNode) {
                            mediaElement.addEventListener('canplay', function () {
                                that.resize();
                            });
                            mediaElement.addEventListener('play', function () {
                                $.publish(Events_1.Events.MEDIA_PLAYED, [Math.floor(mediaElement.currentTime)]);
                            });
                            mediaElement.addEventListener('pause', function () {
                                // mediaelement creates a pause event before the ended event. ignore this.
                                if (Math.floor(mediaElement.currentTime) != Math.floor(mediaElement.duration)) {
                                    $.publish(Events_1.Events.MEDIA_PAUSED, [Math.floor(mediaElement.currentTime)]);
                                }
                            });
                            mediaElement.addEventListener('ended', function () {
                                $.publish(Events_1.Events.MEDIA_ENDED, [Math.floor(mediaElement.duration)]);
                            });
                            mediaElement.setSrc(sources);
                        }
                    });
                }
                else {
                    _this.$media = $('<audio controls="controls" preload="none"></audio>');
                    _this.$container.append(_this.$media);
                    _this.player = new MediaElementPlayer($('audio')[0], {
                        poster: poster,
                        defaultAudioWidth: 'auto',
                        defaultAudioHeight: 'auto',
                        showPosterWhenPaused: true,
                        showPosterWhenEnded: true,
                        success: function (mediaElement, originalNode) {
                            mediaElement.addEventListener('canplay', function () {
                                that.resize();
                            });
                            mediaElement.addEventListener('play', function () {
                                $.publish(Events_1.Events.MEDIA_PLAYED, [Math.floor(mediaElement.currentTime)]);
                            });
                            mediaElement.addEventListener('pause', function () {
                                // mediaelement creates a pause event before the ended event. ignore this.
                                if (Math.floor(mediaElement.currentTime) != Math.floor(mediaElement.duration)) {
                                    $.publish(Events_1.Events.MEDIA_PAUSED, [Math.floor(mediaElement.currentTime)]);
                                }
                            });
                            mediaElement.addEventListener('ended', function () {
                                $.publish(Events_1.Events.MEDIA_ENDED, [Math.floor(mediaElement.duration)]);
                            });
                            mediaElement.setSrc(sources);
                        }
                    });
                }
                _this.resize();
            });
        };
        MediaElementCenterPanel.prototype.isVideo = function () {
            return this.extension.isVideo();
        };
        MediaElementCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            // if in Firefox < v13 don't resize the media container.
            if (window.browserDetect.browser === 'Firefox' && window.browserDetect.version < 13) {
                this.$container.width(this.mediaWidth);
                this.$container.height(this.mediaHeight);
            }
            else {
                // fit media to available space.
                var size = Utils.Dimensions.fitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());
                this.$container.height(size.height);
                this.$container.width(size.width);
                if (this.player && !this.extension.isFullScreen()) {
                    this.$media.width(size.width);
                    this.$media.height(size.height);
                }
            }
            var left = Math.floor((this.$content.width() - this.$container.width()) / 2);
            var top = Math.floor((this.$content.height() - this.$container.height()) / 2);
            this.$container.css({
                'left': left,
                'top': top
            });
            if (this.title) {
                this.$title.ellipsisFill(this.title);
            }
            if (this.player) {
                if (!this.isVideo() || (this.isVideo() && !this.component.isFullScreen)) {
                    this.player.setPlayerSize();
                    this.player.setControlsSize();
                    var $mejs = $('.mejs__container');
                    $mejs.css({
                        'margin-top': (this.$container.height() - $mejs.height()) / 2
                    });
                }
            }
        };
        return MediaElementCenterPanel;
    }(CenterPanel_1.CenterPanel));
    exports.MediaElementCenterPanel = MediaElementCenterPanel;
});
