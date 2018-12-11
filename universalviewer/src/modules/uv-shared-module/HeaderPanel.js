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
define(["require", "exports", "./BaseEvents", "./BaseView", "../uv-shared-module/InformationFactory"], function (require, exports, BaseEvents_1, BaseView_1, InformationFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderPanel = /** @class */ (function (_super) {
        __extends(HeaderPanel, _super);
        function HeaderPanel($element) {
            return _super.call(this, $element, false, false) || this;
        }
        HeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('headerPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_INFORMATION, function (e, args) {
                _this.showInformation(args);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_INFORMATION, function () {
                _this.hideInformation();
            });
            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);
            this.$centerOptions = $('<div class="centerOptions"></div>');
            this.$options.append(this.$centerOptions);
            this.$rightOptions = $('<div class="rightOptions"></div>');
            this.$options.append(this.$rightOptions);
            //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
            //this.$rightOptions.append(this.$helpButton);
            this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
            this.$rightOptions.append(this.$localeToggleButton);
            this.$settingsButton = $("\n          <button class=\"btn imageBtn settings\" tabindex=\"0\" title=\"" + this.content.settings + "\">\n            <i class=\"uv-icon-settings\" aria-hidden=\"true\"></i>" + this.content.settings + "\n          </button>\n        ");
            this.$settingsButton.attr('title', this.content.settings);
            this.$rightOptions.append(this.$settingsButton);
            this.$informationBox = $('<div class="informationBox" aria-hidden="true"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <button type="button" class="close" aria-label="Close"> \
                                        <span aria-hidden="true">&times;</span>\
                                    </button> \
                                  </div>');
            this.$element.append(this.$informationBox);
            this.$informationBox.hide();
            this.$informationBox.find('.close').attr('title', this.content.close);
            this.$informationBox.find('.close').on('click', function (e) {
                e.preventDefault();
                $.publish(BaseEvents_1.BaseEvents.HIDE_INFORMATION);
            });
            this.$localeToggleButton.on('click', function () {
                _this.extension.changeLocale(String(_this.$localeToggleButton.data('locale')));
            });
            this.$settingsButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_SETTINGS_DIALOGUE);
            });
            if (!Utils.Bools.getBool(this.options.centerOptionsEnabled, true)) {
                this.$centerOptions.hide();
            }
            this.updateLocaleToggle();
            this.updateSettingsButton();
        };
        HeaderPanel.prototype.updateLocaleToggle = function () {
            if (!this.localeToggleIsVisible()) {
                this.$localeToggleButton.hide();
                return;
            }
            var alternateLocale = this.extension.getAlternateLocale();
            var text = alternateLocale.name.split('-')[0].toUpperCase();
            this.$localeToggleButton.data('locale', alternateLocale.name);
            this.$localeToggleButton.attr('title', alternateLocale.label);
            this.$localeToggleButton.text(text);
        };
        HeaderPanel.prototype.updateSettingsButton = function () {
            var settingsEnabled = Utils.Bools.getBool(this.options.settingsButtonEnabled, true);
            if (!settingsEnabled) {
                this.$settingsButton.hide();
            }
            else {
                this.$settingsButton.show();
            }
        };
        HeaderPanel.prototype.localeToggleIsVisible = function () {
            var locales = this.extension.data.locales;
            if (locales) {
                return locales.length > 1 && Utils.Bools.getBool(this.options.localeToggleEnabled, false);
            }
            return false;
        };
        HeaderPanel.prototype.showInformation = function (args) {
            var informationFactory = new InformationFactory_1.InformationFactory(this.extension);
            this.information = informationFactory.Get(args);
            var $message = this.$informationBox.find('.message');
            $message.html(this.information.message).find('a').attr('target', '_top');
            var $actions = this.$informationBox.find('.actions');
            $actions.empty();
            for (var i = 0; i < this.information.actions.length; i++) {
                var action = this.information.actions[i];
                var $action = $('<a href="#" class="btn btn-default">' + action.label + '</a>');
                $action.on('click', action.action);
                $actions.append($action);
            }
            this.$informationBox.attr('aria-hidden', 'false');
            this.$informationBox.show();
            this.$element.addClass('showInformation');
            this.extension.resize();
        };
        HeaderPanel.prototype.hideInformation = function () {
            this.$element.removeClass('showInformation');
            this.$informationBox.attr('aria-hidden', 'true');
            this.$informationBox.hide();
            this.extension.resize();
        };
        HeaderPanel.prototype.getSettings = function () {
            return this.extension.getSettings();
        };
        HeaderPanel.prototype.updateSettings = function (settings) {
            this.extension.updateSettings(settings);
            $.publish(BaseEvents_1.BaseEvents.UPDATE_SETTINGS, [settings]);
        };
        HeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var headerWidth = this.$element.width();
            var center = headerWidth / 2;
            var containerWidth = this.$centerOptions.outerWidth();
            var pos = center - (containerWidth / 2);
            this.$centerOptions.css({
                left: pos
            });
            if (this.$informationBox.is(':visible')) {
                var $actions = this.$informationBox.find('.actions');
                var $message = this.$informationBox.find('.message');
                $message.width(Math.floor(this.$element.width()) - Math.ceil($message.horizontalMargins()) - Math.ceil($actions.outerWidth(true)) - Math.ceil(this.$informationBox.find('.close').outerWidth(true)) - 2);
                $message.ellipsisFill(this.information.message);
            }
            // hide toggle buttons below minimum width
            if (this.extension.width() < this.extension.data.config.options.minWidthBreakPoint) {
                if (this.localeToggleIsVisible())
                    this.$localeToggleButton.hide();
            }
            else {
                if (this.localeToggleIsVisible())
                    this.$localeToggleButton.show();
            }
        };
        return HeaderPanel;
    }(BaseView_1.BaseView));
    exports.HeaderPanel = HeaderPanel;
});
