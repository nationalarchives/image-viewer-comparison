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
define(["require", "exports", "./Shell", "./BaseView", "./Position", "../../Utils"], function (require, exports, Shell_1, BaseView_1, Position_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CenterPanel = /** @class */ (function (_super) {
        __extends(CenterPanel, _super);
        function CenterPanel($element) {
            var _this = _super.call(this, $element, false, true) || this;
            _this.isAttributionOpen = false;
            _this.attributionPosition = Position_1.Position.BOTTOM_LEFT;
            return _this;
        }
        CenterPanel.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.$title = $('<div class="title"></div>');
            this.$element.append(this.$title);
            this.$content = $('<div id="content" class="content"></div>');
            this.$element.append(this.$content);
            this.$attribution = $("\n                                <div class=\"attribution\">\n                                  <div class=\"header\">\n                                    <div class=\"title\"></div>\n                                    <button type=\"button\" class=\"close\" aria-label=\"Close\">\n                                      <span aria-hidden=\"true\">&times;</span>\n                                    </button>\n                                  </div>\n                                  <div class=\"main\">\n                                    <div class=\"attribution-text\"></div>\n                                    <div class=\"license\"></div>\n                                    <div class=\"logo\"></div>\n                                  </div>\n                                </div>\n        ");
            this.$attribution.find('.header .title').text(this.content.attribution);
            this.$content.append(this.$attribution);
            this.closeAttribution();
            this.$closeAttributionButton = this.$attribution.find('.header .close');
            this.$closeAttributionButton.on('click', function (e) {
                e.preventDefault();
                _this.closeAttribution();
            });
            if (!Utils.Bools.getBool(this.options.titleEnabled, true)) {
                this.$title.hide();
            }
            this.whenResized(function () {
                _this.updateRequiredStatement();
            });
        };
        CenterPanel.prototype.openAttribution = function () {
            this.$attribution.show();
            this.isAttributionOpen = true;
        };
        CenterPanel.prototype.closeAttribution = function () {
            this.$attribution.hide();
            this.isAttributionOpen = false;
        };
        CenterPanel.prototype.updateRequiredStatement = function () {
            var _this = this;
            var requiredStatement = this.extension.helper.getRequiredStatement();
            //var license = this.provider.getLicense();
            //var logo = this.provider.getLogo();
            var enabled = Utils.Bools.getBool(this.options.requiredStatementEnabled, true);
            if (!requiredStatement || !requiredStatement.value || !enabled) {
                return;
            }
            this.openAttribution();
            var $attributionTitle = this.$attribution.find('.title');
            var $attributionText = this.$attribution.find('.attribution-text');
            var $license = this.$attribution.find('.license');
            var $logo = this.$attribution.find('.logo');
            if (requiredStatement.label) {
                var sanitizedTitle = Utils_1.UVUtils.sanitize(requiredStatement.label);
                $attributionTitle.html(sanitizedTitle);
            }
            else {
                $attributionTitle.text(this.content.attribution);
            }
            if (requiredStatement.value) {
                var sanitizedText = Utils_1.UVUtils.sanitize(requiredStatement.value);
                $attributionText.html(sanitizedText);
                $attributionText.find('img').one('load', function () {
                    _this.resize();
                }).each(function () {
                    if (this.complete)
                        $(this).load();
                });
                $attributionText.targetBlank();
            }
            // $attribution.toggleExpandText(this.options.trimAttributionCount, () => {
            //     this.resize();
            // });
            //if (license){
            //    $license.append('<a href="' + license + '">' + license + '</a>');
            //} else {
            $license.hide();
            //}
            //
            //if (logo){
            //    $logo.append('<img src="' + logo + '"/>');
            //} else {
            $logo.hide();
            //}
            this.resize();
        };
        CenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var leftPanelWidth = Shell_1.Shell.$leftPanel.is(':visible') ? Math.floor(Shell_1.Shell.$leftPanel.width()) : 0;
            var rightPanelWidth = Shell_1.Shell.$rightPanel.is(':visible') ? Math.floor(Shell_1.Shell.$rightPanel.width()) : 0;
            var width = Math.floor(this.$element.parent().width() - leftPanelWidth - rightPanelWidth);
            this.$element.css({
                'left': leftPanelWidth,
                'width': width
            });
            var titleHeight;
            if (this.options && this.options.titleEnabled === false || !this.$title.is(':visible')) {
                titleHeight = 0;
            }
            else {
                titleHeight = this.$title.height();
            }
            this.$content.height(this.$element.height() - titleHeight);
            this.$content.width(this.$element.width());
            if (this.$attribution && this.isAttributionOpen) {
                switch (this.attributionPosition) {
                    case Position_1.Position.BOTTOM_LEFT:
                        this.$attribution.css('top', this.$content.height() - this.$attribution.outerHeight() - this.$attribution.verticalMargins());
                        this.$attribution.css('left', 0);
                        break;
                    case Position_1.Position.BOTTOM_RIGHT:
                        this.$attribution.css('top', this.$content.height() - this.$attribution.outerHeight() - this.$attribution.verticalMargins());
                        this.$attribution.css('left', this.$content.width() - this.$attribution.outerWidth() - this.$attribution.horizontalMargins());
                        break;
                }
                // hide the attribution if there's no room for it
                if (this.$content.width() <= this.$attribution.width()) {
                    this.$attribution.hide();
                }
                else {
                    this.$attribution.show();
                }
            }
        };
        return CenterPanel;
    }(BaseView_1.BaseView));
    exports.CenterPanel = CenterPanel;
});
