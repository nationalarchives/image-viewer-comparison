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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/Dialogue"], function (require, exports, BaseEvents_1, Dialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsDialogue = /** @class */ (function (_super) {
        __extends(SettingsDialogue, _super);
        function SettingsDialogue($element) {
            return _super.call(this, $element) || this;
        }
        SettingsDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('settingsDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_SETTINGS_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_SETTINGS_DIALOGUE;
            $.subscribe(this.openCommand, function () {
                _this.open();
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$scroll = $('<div class="scroll"></div>');
            this.$content.append(this.$scroll);
            this.$version = $('<div class="version"></div>');
            this.$content.append(this.$version);
            this.$website = $('<div class="website"></div>');
            this.$content.append(this.$website);
            this.$locale = $('<div class="setting locale"></div>');
            this.$scroll.append(this.$locale);
            this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
            this.$locale.append(this.$localeLabel);
            this.$localeDropDown = $('<select id="locale"></select>');
            this.$locale.append(this.$localeDropDown);
            // initialise ui.
            this.$title.text(this.content.title);
            this.$website.html(this.content.website);
            this.$website.targetBlank();
            this._createLocalesMenu();
            this.$element.hide();
        };
        SettingsDialogue.prototype.getSettings = function () {
            return this.extension.getSettings();
        };
        SettingsDialogue.prototype.updateSettings = function (settings) {
            this.extension.updateSettings(settings);
            $.publish(BaseEvents_1.BaseEvents.UPDATE_SETTINGS, [settings]);
        };
        SettingsDialogue.prototype.open = function () {
            var _this = this;
            _super.prototype.open.call(this);
            $.getJSON(this.extension.data.root + "/info.json", function (pjson) {
                _this.$version.text("v" + pjson.version);
            });
        };
        SettingsDialogue.prototype._createLocalesMenu = function () {
            var _this = this;
            var locales = this.extension.data.locales;
            if (locales && locales.length > 1) {
                for (var i = 0; i < locales.length; i++) {
                    var locale = locales[i];
                    this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
                }
                this.$localeDropDown.val(locales[0].name);
            }
            else {
                this.$locale.hide();
            }
            this.$localeDropDown.change(function () {
                _this.extension.changeLocale(_this.$localeDropDown.val());
            });
        };
        SettingsDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return SettingsDialogue;
    }(Dialogue_1.Dialogue));
    exports.SettingsDialogue = SettingsDialogue;
});
