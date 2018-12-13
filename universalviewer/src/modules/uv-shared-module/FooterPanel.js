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
define(["require", "exports", "./BaseEvents", "./BaseView"], function (require, exports, BaseEvents_1, BaseView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FooterPanel = /** @class */ (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            return _super.call(this, $element) || this;
        }
        FooterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('footerPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN, function () {
                _this.updateFullScreenButton();
            });
            $.subscribe(BaseEvents_1.BaseEvents.METRIC_CHANGED, function () {
                _this.updateMinimisedButtons();
                _this.updateMoreInfoButton();
            });
            $.subscribe(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, function () {
                _this.updateDownloadButton();
            });
            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);
            this.$feedbackButton = $("\n          <button class=\"feedback btn imageBtn\" title=\"" + this.content.feedback + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-feedback\" aria-hidden=\"true\"></i>" + this.content.feedback + "\n          </button>\n        ");
            this.$options.prepend(this.$feedbackButton);
            this.$openButton = $("\n          <button class=\"open btn imageBtn\" title=\"" + this.content.open + "\" tabindex=\"0\">\n            <i class=\"uv-icon-open\" aria-hidden=\"true\"></i>" + this.content.open + "\n          </button>\n        ");
            this.$options.prepend(this.$openButton);
            this.$bookmarkButton = $("\n          <button class=\"bookmark btn imageBtn\" title=\"" + this.content.bookmark + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-bookmark\" aria-hidden=\"true\"></i>" + this.content.bookmark + "\n          </button>\n        ");
            this.$options.prepend(this.$bookmarkButton);
            this.$shareButton = $("\n          <button class=\"share btn imageBtn\" title=\"" + this.content.share + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-share\" aria-hidden=\"true\"></i>" + this.content.share + "\n          </button>\n        ");
            this.$options.append(this.$shareButton);
            this.$embedButton = $("\n          <button class=\"embed btn imageBtn\" title=\"" + this.content.embed + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-embed\" aria-hidden=\"true\"></i>" + this.content.embed + "\n          </button>\n        ");
            this.$options.append(this.$embedButton);
            this.$downloadButton = $("\n          <button class=\"download btn imageBtn\" title=\"" + this.content.download + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-download\" aria-hidden=\"true\"></i>" + this.content.download + "\n          </button>\n        ");
            this.$options.prepend(this.$downloadButton);
            this.$moreInfoButton = $("\n          <button class=\"moreInfo btn imageBtn\" title=\"" + this.content.moreInfo + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-more-info\" aria-hidden=\"true\"></i>" + this.content.moreInfo + "\n          </button>\n        ");
            this.$options.prepend(this.$moreInfoButton);
            this.$fullScreenBtn = $("\n          <button class=\"fullScreen btn imageBtn\" title=\"" + this.content.fullScreen + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-fullscreen\" aria-hidden=\"true\"></i>" + this.content.fullScreen + "\n          </button>\n        ");
            this.$options.append(this.$fullScreenBtn);
            this.$openButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.OPEN);
            });
            this.$feedbackButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.FEEDBACK);
            });
            this.$bookmarkButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.BOOKMARK);
            });
            this.$shareButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_SHARE_DIALOGUE, [_this.$shareButton]);
            });
            this.$embedButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_EMBED_DIALOGUE, [_this.$embedButton]);
            });
            this.$downloadButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_DOWNLOAD_DIALOGUE, [_this.$downloadButton]);
            });
            this.$moreInfoButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_MOREINFO_DIALOGUE, [_this.$moreInfoButton]);
            });
            this.$fullScreenBtn.on('click', function (e) {
                e.preventDefault();
                $.publish(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN);
            });
            if (!Utils.Bools.getBool(this.options.embedEnabled, true)) {
                this.$embedButton.hide();
            }
            this.updateMoreInfoButton();
            this.updateOpenButton();
            this.updateFeedbackButton();
            this.updateBookmarkButton();
            this.updateEmbedButton();
            this.updateDownloadButton();
            this.updateFullScreenButton();
            this.updateShareButton();
            this.updateMinimisedButtons();
        };
        FooterPanel.prototype.updateMinimisedButtons = function () {
            // if configured to always minimise buttons
            if (Utils.Bools.getBool(this.options.minimiseButtons, false)) {
                this.$options.addClass('minimiseButtons');
                return;
            }
            // otherwise, check metric
            if (!this.extension.isDesktopMetric()) {
                this.$options.addClass('minimiseButtons');
            }
            else {
                this.$options.removeClass('minimiseButtons');
            }
        };
        FooterPanel.prototype.updateMoreInfoButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.moreInfoEnabled, false);
            if (configEnabled && !this.extension.isDesktopMetric() && !this.extension.isCatchAllMetric()) {
                this.$moreInfoButton.show();
            }
            else {
                this.$moreInfoButton.hide();
            }
        };
        FooterPanel.prototype.updateOpenButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.openEnabled, false);
            if (configEnabled && Utils.Documents.isInIFrame()) {
                this.$openButton.show();
            }
            else {
                this.$openButton.hide();
            }
        };
        FooterPanel.prototype.updateFullScreenButton = function () {
            if (!Utils.Bools.getBool(this.options.fullscreenEnabled, true) || !Utils.Documents.supportsFullscreen()) {
                this.$fullScreenBtn.hide();
                return;
            }
            if (this.extension.data.isLightbox) {
                this.$fullScreenBtn.addClass('lightbox');
            }
            if (this.extension.isFullScreen()) {
                this.$fullScreenBtn.switchClass('fullScreen', 'exitFullscreen');
                this.$fullScreenBtn.find('i').switchClass('uv-icon-fullscreen', 'uv-icon-exit-fullscreen');
                this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
                $(this.$fullScreenBtn[0].firstChild.nextSibling.nextSibling).replaceWith(this.content.exitFullScreen);
            }
            else {
                this.$fullScreenBtn.switchClass('exitFullscreen', 'fullScreen');
                this.$fullScreenBtn.find('i').switchClass('uv-icon-exit-fullscreen', 'uv-icon-fullscreen');
                this.$fullScreenBtn.attr('title', this.content.fullScreen);
                $(this.$fullScreenBtn[0].firstChild.nextSibling.nextSibling).replaceWith(this.content.fullScreen);
            }
        };
        FooterPanel.prototype.updateEmbedButton = function () {
            if (this.extension.helper.isUIEnabled('embed') && Utils.Bools.getBool(this.options.embedEnabled, false)) {
                // current jquery version sets display to 'inline' in mobile version, while this should remain hidden (see media query)
                if (!this.extension.isMobile()) {
                    this.$embedButton.show();
                }
            }
            else {
                this.$embedButton.hide();
            }
        };
        FooterPanel.prototype.updateShareButton = function () {
            if (this.extension.helper.isUIEnabled('share') && Utils.Bools.getBool(this.options.shareEnabled, true)) {
                this.$shareButton.show();
            }
            else {
                this.$shareButton.hide();
            }
        };
        FooterPanel.prototype.updateDownloadButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.downloadEnabled, true);
            if (configEnabled) {
                this.$downloadButton.show();
            }
            else {
                this.$downloadButton.hide();
            }
        };
        FooterPanel.prototype.updateFeedbackButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.feedbackEnabled, false);
            if (configEnabled) {
                this.$feedbackButton.show();
            }
            else {
                this.$feedbackButton.hide();
            }
        };
        FooterPanel.prototype.updateBookmarkButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.bookmarkEnabled, false);
            if (configEnabled) {
                this.$bookmarkButton.show();
            }
            else {
                this.$bookmarkButton.hide();
            }
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return FooterPanel;
    }(BaseView_1.BaseView));
    exports.FooterPanel = FooterPanel;
});
