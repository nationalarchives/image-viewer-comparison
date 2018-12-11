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
define(["require", "exports", "../../modules/uv-dialogues-module/SettingsDialogue"], function (require, exports, SettingsDialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsDialogue = /** @class */ (function (_super) {
        __extends(SettingsDialogue, _super);
        function SettingsDialogue($element) {
            return _super.call(this, $element) || this;
        }
        SettingsDialogue.prototype.create = function () {
            this.setConfig('settingsDialogue');
            _super.prototype.create.call(this);
        };
        return SettingsDialogue;
    }(SettingsDialogue_1.SettingsDialogue));
    exports.SettingsDialogue = SettingsDialogue;
});
