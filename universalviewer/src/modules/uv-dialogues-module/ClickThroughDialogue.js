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
    var ClickThroughDialogue = /** @class */ (function (_super) {
        __extends(ClickThroughDialogue, _super);
        function ClickThroughDialogue($element) {
            return _super.call(this, $element) || this;
        }
        ClickThroughDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('clickThroughDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_CLICKTHROUGH_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.acceptCallback = params.acceptCallback;
                _this.resource = params.resource;
                _this.open();
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="acceptTerms btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>');
            this.$message = this.$content.find(".message");
            this.$acceptTermsButton = this.$content.find(".acceptTerms");
            // TODO: get from config this.$acceptTermsButton.text(this.content.acceptTerms); // figure out config
            this.$acceptTermsButton.text("Accept Terms and Open");
            this.$element.hide();
            this.$acceptTermsButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
                $.publish(BaseEvents_1.BaseEvents.ACCEPT_TERMS);
                if (_this.acceptCallback)
                    _this.acceptCallback();
            });
        };
        ClickThroughDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
            if (this.resource.clickThroughService) {
                this.$title.text(this.resource.clickThroughService.getProperty('label'));
                this.$message.html(this.resource.clickThroughService.getProperty('description'));
                this.$message.targetBlank();
            }
            this.$message.find('a').on('click', function () {
                var url = $(this).attr('href');
                $.publish(BaseEvents_1.BaseEvents.EXTERNAL_LINK_CLICKED, [url]);
            });
            this.resize();
        };
        ClickThroughDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return ClickThroughDialogue;
    }(Dialogue_1.Dialogue));
    exports.ClickThroughDialogue = ClickThroughDialogue;
});
