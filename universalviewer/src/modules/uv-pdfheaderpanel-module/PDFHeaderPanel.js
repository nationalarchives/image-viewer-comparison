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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../../extensions/uv-pdf-extension/Events", "../uv-shared-module/HeaderPanel"], function (require, exports, BaseEvents_1, Events_1, HeaderPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PDFHeaderPanel = /** @class */ (function (_super) {
        __extends(PDFHeaderPanel, _super);
        function PDFHeaderPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this.firstButtonEnabled = false;
            _this.lastButtonEnabled = false;
            _this.nextButtonEnabled = false;
            _this.prevButtonEnabled = false;
            _this._pageIndex = 0;
            _this._pdfDoc = null;
            return _this;
        }
        PDFHeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pdfHeaderPanel');
            _super.prototype.create.call(this);
            $.subscribe(Events_1.Events.PAGE_INDEX_CHANGED, function (e, pageIndex) {
                _this._pageIndex = pageIndex;
                _this.render();
            });
            $.subscribe(Events_1.Events.PDF_LOADED, function (e, pdfDoc) {
                _this._pdfDoc = pdfDoc;
            });
            this.$prevOptions = $('<div class="prevOptions"></div>');
            this.$centerOptions.append(this.$prevOptions);
            this.$firstButton = $("\n          <button class=\"btn imageBtn first\" tabindex=\"0\" title=\"" + this.content.first + "\">\n            <i class=\"uv-icon-first\" aria-hidden=\"true\"></i>" + this.content.first + "\n          </button>\n        ");
            this.$prevOptions.append(this.$firstButton);
            this.$firstButton.disable();
            this.$prevButton = $("\n          <button class=\"btn imageBtn prev\" tabindex=\"0\" title=\"" + this.content.previous + "\">\n            <i class=\"uv-icon-prev\" aria-hidden=\"true\"></i>" + this.content.previous + "\n          </button>\n        ");
            this.$prevOptions.append(this.$prevButton);
            this.$prevButton.disable();
            this.$search = $('<div class="search"></div>');
            this.$centerOptions.append(this.$search);
            this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' + this.content.pageSearchLabel + '"/>');
            this.$search.append(this.$searchText);
            this.$total = $('<span class="total"></span>');
            this.$search.append(this.$total);
            this.$searchButton = $('<a class="go btn btn-primary" tabindex="0">' + this.content.go + '</a>');
            this.$search.append(this.$searchButton);
            this.$searchButton.disable();
            this.$nextOptions = $('<div class="nextOptions"></div>');
            this.$centerOptions.append(this.$nextOptions);
            this.$nextButton = $("\n          <button class=\"btn imageBtn next\" tabindex=\"0\" title=\"" + this.content.next + "\">\n            <i class=\"uv-icon-next\" aria-hidden=\"true\"></i>" + this.content.next + "\n          </button>\n        ");
            this.$nextOptions.append(this.$nextButton);
            this.$nextButton.disable();
            this.$lastButton = $("\n          <button class=\"btn imageBtn last\" tabindex=\"0\" title=\"" + this.content.last + "\">\n            <i class=\"uv-icon-last\" aria-hidden=\"true\"></i>" + this.content.last + "\n          </button>\n        ");
            this.$nextOptions.append(this.$lastButton);
            this.$lastButton.disable();
            // ui event handlers.
            this.$firstButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.FIRST);
            });
            this.$prevButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.PREV);
            });
            this.$nextButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.NEXT);
            });
            this.$lastButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.LAST);
            });
            this.$searchText.onEnter(function () {
                _this.$searchText.blur();
                _this.search(_this.$searchText.val());
            });
            this.$searchText.click(function () {
                $(this).select();
            });
            this.$searchButton.onPressed(function () {
                _this.search(_this.$searchText.val());
            });
        };
        PDFHeaderPanel.prototype.render = function () {
            // check if the book has more than one page, otherwise hide prev/next options.
            if (this._pdfDoc.numPages === 1) {
                this.$centerOptions.hide();
            }
            else {
                this.$centerOptions.show();
            }
            this.$searchText.val(this._pageIndex);
            var of = this.content.of;
            this.$total.html(Utils.Strings.format(of, this._pdfDoc.numPages.toString()));
            this.$searchButton.enable();
            if (this._pageIndex === 1) {
                this.$firstButton.disable();
                this.$prevButton.disable();
            }
            else {
                this.$firstButton.enable();
                this.$prevButton.enable();
            }
            if (this._pageIndex === this._pdfDoc.numPages) {
                this.$lastButton.disable();
                this.$nextButton.disable();
            }
            else {
                this.$lastButton.enable();
                this.$nextButton.enable();
            }
        };
        PDFHeaderPanel.prototype.search = function (value) {
            if (!value) {
                this.extension.showMessage(this.content.emptyValue);
                return;
            }
            var index = parseInt(this.$searchText.val(), 10);
            if (isNaN(index)) {
                this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content.invalidNumber);
                return;
            }
            $.publish(Events_1.Events.SEARCH, [index]);
        };
        PDFHeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return PDFHeaderPanel;
    }(HeaderPanel_1.HeaderPanel));
    exports.PDFHeaderPanel = PDFHeaderPanel;
});
