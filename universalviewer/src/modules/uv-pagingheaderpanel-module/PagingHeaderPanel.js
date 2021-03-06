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
define(["require", "exports", "../uv-shared-module/AutoComplete", "../uv-shared-module/BaseEvents", "../../extensions/uv-seadragon-extension/Events", "../uv-shared-module/HeaderPanel", "../../extensions/uv-seadragon-extension/Mode", "../../Utils"], function (require, exports, AutoComplete_1, BaseEvents_1, Events_1, HeaderPanel_1, Mode_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PagingHeaderPanel = /** @class */ (function (_super) {
        __extends(PagingHeaderPanel, _super);
        function PagingHeaderPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this.firstButtonEnabled = false;
            _this.lastButtonEnabled = false;
            _this.nextButtonEnabled = false;
            _this.prevButtonEnabled = false;
            return _this;
        }
        PagingHeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pagingHeaderPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.canvasIndexChanged(canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, function () {
                _this.modeChanged();
                _this.updatePagingToggle();
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED, function () {
                _this.setSearchFieldValue(_this.extension.helper.canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START, function () {
                _this.openGallery();
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START, function () {
                _this.closeGallery();
            });
            this.$prevOptions = $('<div class="prevOptions"></div>');
            this.$centerOptions.append(this.$prevOptions);
            this.$firstButton = $("\n          <button class=\"btn imageBtn first\" tabindex=\"0\" title=\"" + this.content.first + "\">\n            <i class=\"uv-icon-first\" aria-hidden=\"true\"></i><span>" + this.content.first + "</span>\n          </button>\n        ");
            this.$prevOptions.append(this.$firstButton);
            this.$prevButton = $("\n          <button class=\"btn imageBtn prev\" tabindex=\"0\" title=\"" + this.content.previous + "\">\n            <i class=\"uv-icon-prev\" aria-hidden=\"true\"></i><span>" + this.content.previous + "</span>\n          </button>\n        ");
            this.$prevOptions.append(this.$prevButton);
            this.$modeOptions = $('<div class="mode"></div>');
            this.$centerOptions.append(this.$modeOptions);
            this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
            this.$modeOptions.append(this.$imageModeLabel);
            this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="0"/>');
            this.$modeOptions.append(this.$imageModeOption);
            this.$pageModeLabel = $('<label for="page"></label>');
            this.$modeOptions.append(this.$pageModeLabel);
            this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="0"/>');
            this.$modeOptions.append(this.$pageModeOption);
            this.$search = $('<div class="search"></div>');
            this.$centerOptions.append(this.$search);
            this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' + this.content.pageSearchLabel + '"/>');
            this.$search.append(this.$searchText);
            if (Utils.Bools.getBool(this.options.autoCompleteBoxEnabled, true)) {
                this.$searchText.hide();
                this.$autoCompleteBox = $('<input class="autocompleteText" type="text" maxlength="100" aria-label="' + this.content.pageSearchLabel + '"/>');
                this.$search.append(this.$autoCompleteBox);
                new AutoComplete_1.AutoComplete(this.$autoCompleteBox, function (term, cb) {
                    var results = [];
                    var canvases = _this.extension.helper.getCanvases();
                    // if in page mode, get canvases by label.
                    if (_this.isPageModeEnabled()) {
                        for (var i = 0; i < canvases.length; i++) {
                            var canvas = canvases[i];
                            var label = Manifesto.LanguageMap.getValue(canvas.getLabel());
                            if (label && label.startsWith(term)) {
                                results.push(label);
                            }
                        }
                    }
                    else {
                        // get canvas by index
                        for (var i = 0; i < canvases.length; i++) {
                            var canvas = canvases[i];
                            if (canvas.index.toString().startsWith(term)) {
                                results.push(canvas.index.toString());
                            }
                        }
                    }
                    cb(results);
                }, function (results) {
                    return results;
                }, function (terms) {
                    _this.search(terms);
                }, 300, 0, Utils.Bools.getBool(this.options.autocompleteAllowWords, false));
            }
            else if (Utils.Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
                this.$selectionBoxOptions = $('<div class="image-selectionbox-options"></div>');
                this.$centerOptions.append(this.$selectionBoxOptions);
                this.$imageSelectionBox = $('<select class="image-selectionbox" name="image-select" tabindex="0" ></select>');
                this.$selectionBoxOptions.append(this.$imageSelectionBox);
                for (var imageIndex = 0; imageIndex < this.extension.helper.getTotalCanvases(); imageIndex++) {
                    var canvas = this.extension.helper.getCanvasByIndex(imageIndex);
                    var label = Utils_1.UVUtils.sanitize(Manifesto.LanguageMap.getValue(canvas.getLabel(), this.extension.helper.options.locale));
                    this.$imageSelectionBox.append('<option value=' + (imageIndex) + '>' + label + '</option>');
                }
                this.$imageSelectionBox.change(function () {
                    var imageIndex = parseInt(_this.$imageSelectionBox.val());
                    $.publish(Events_1.Events.IMAGE_SEARCH, [imageIndex]);
                });
            }
            this.$total = $('<span class="total"></span>');
            this.$search.append(this.$total);
            this.$searchButton = $("<a class=\"go btn btn-primary\" title=\"" + this.content.go + "\" tabindex=\"0\">" + this.content.go + "</a>");
            this.$search.append(this.$searchButton);
            this.$nextOptions = $('<div class="nextOptions"></div>');
            this.$centerOptions.append(this.$nextOptions);
            this.$nextButton = $("\n          <button class=\"btn imageBtn next\" tabindex=\"0\" title=\"" + this.content.next + "\">\n            <i class=\"uv-icon-next\" aria-hidden=\"true\"></i><span>" + this.content.next + "</span>\n          </button>\n        ");
            this.$nextOptions.append(this.$nextButton);
            this.$lastButton = $("\n          <button class=\"btn imageBtn last\" tabindex=\"0\" title=\"" + this.content.last + "\">\n            <i class=\"uv-icon-last\" aria-hidden=\"true\"></i><span>" + this.content.last + "</span>\n          </button>\n        ");
            this.$nextOptions.append(this.$lastButton);
            if (this.isPageModeEnabled()) {
                this.$pageModeOption.attr('checked', 'checked');
                this.$pageModeOption.removeAttr('disabled');
                this.$pageModeLabel.removeClass('disabled');
            }
            else {
                this.$imageModeOption.attr('checked', 'checked');
                // disable page mode option.
                this.$pageModeOption.attr('disabled', 'disabled');
                this.$pageModeLabel.addClass('disabled');
            }
            if (this.extension.helper.getManifestType().toString() === manifesto.ManifestType.manuscript().toString()) {
                this.$pageModeLabel.text(this.content.folio);
            }
            else {
                this.$pageModeLabel.text(this.content.page);
            }
            this.$galleryButton = $("\n          <button class=\"btn imageBtn gallery\" title=\"" + this.content.gallery + "\" tabindex=\"0\">\n            <i class=\"uv-icon-gallery\" aria-hidden=\"true\"></i>" + this.content.gallery + "\n          </button>\n        ");
            this.$rightOptions.prepend(this.$galleryButton);
            this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
            this.$rightOptions.prepend(this.$pagingToggleButtons);
            this.$oneUpButton = $("\n          <button class=\"btn imageBtn one-up\" title=\"" + this.content.oneUp + "\" tabindex=\"0\">\n            <i class=\"uv-icon-one-up\" aria-hidden=\"true\"></i>" + this.content.oneUp + "\n          </button>");
            this.$pagingToggleButtons.append(this.$oneUpButton);
            this.$twoUpButton = $("\n          <button class=\"btn imageBtn two-up\" title=\"" + this.content.twoUp + "\" tabindex=\"0\">\n            <i class=\"uv-icon-two-up\" aria-hidden=\"true\"></i>" + this.content.twoUp + "\n          </button>\n        ");
            this.$pagingToggleButtons.append(this.$twoUpButton);
            this.updatePagingToggle();
            this.updateGalleryButton();
            this.$oneUpButton.onPressed(function () {
                var enabled = false;
                _this.updateSettings({ pagingEnabled: enabled });
                $.publish(Events_1.Events.PAGING_TOGGLED, [enabled]);
            });
            this.$twoUpButton.onPressed(function () {
                var enabled = true;
                _this.updateSettings({ pagingEnabled: enabled });
                $.publish(Events_1.Events.PAGING_TOGGLED, [enabled]);
            });
            this.$galleryButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.TOGGLE_EXPAND_LEFT_PANEL);
            });
            this.setNavigationTitles();
            this.setTotal();
            var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
            // check if the book has more than one page, otherwise hide prev/next options.
            if (this.extension.helper.getTotalCanvases() === 1) {
                this.$centerOptions.hide();
            }
            // ui event handlers.
            this.$firstButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        $.publish(BaseEvents_1.BaseEvents.FIRST);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.LAST);
                        break;
                }
            });
            this.$prevButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(BaseEvents_1.BaseEvents.PREV);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.NEXT);
                        break;
                }
            });
            this.$nextButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(BaseEvents_1.BaseEvents.NEXT);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.PREV);
                        break;
                }
            });
            this.$lastButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        $.publish(BaseEvents_1.BaseEvents.LAST);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(BaseEvents_1.BaseEvents.FIRST);
                        break;
                }
            });
            // If page mode is disabled, we don't need to show radio buttons since
            // there is only one option:
            if (!this.config.options.pageModeEnabled) {
                this.$imageModeOption.hide();
                this.$pageModeLabel.hide();
                this.$pageModeOption.hide();
            }
            else {
                // Only activate click actions for mode buttons when controls are
                // visible, since otherwise, clicking on the "Image" label can
                // trigger unexpected/undesired side effects.
                this.$imageModeOption.on('click', function (e) {
                    $.publish(Events_1.Events.MODE_CHANGED, [Mode_1.Mode.image.toString()]);
                });
                this.$pageModeOption.on('click', function (e) {
                    $.publish(Events_1.Events.MODE_CHANGED, [Mode_1.Mode.page.toString()]);
                });
            }
            this.$searchText.onEnter(function () {
                _this.$searchText.blur();
                _this.search(_this.$searchText.val());
            });
            this.$searchText.click(function () {
                $(this).select();
            });
            this.$searchButton.onPressed(function () {
                if (_this.options.autoCompleteBoxEnabled) {
                    _this.search(_this.$autoCompleteBox.val());
                }
                else {
                    _this.search(_this.$searchText.val());
                }
            });
            if (this.options.modeOptionsEnabled === false) {
                this.$modeOptions.hide();
                this.$centerOptions.addClass('modeOptionsDisabled');
            }
            // Search is shown as default
            if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true) {
                this.$search.hide();
            }
            if (this.options.helpEnabled === false) {
                this.$helpButton.hide();
            }
            // todo: discuss on community call
            // Get visible element in centerOptions with greatest tabIndex
            // var $elementWithGreatestTabIndex: JQuery = this.$centerOptions.getVisibleElementWithGreatestTabIndex();
            // // cycle focus back to start.
            // if ($elementWithGreatestTabIndex) {
            //     $elementWithGreatestTabIndex.blur(() => {
            //         if (this.extension.tabbing && !this.extension.shifted) {
            //             this.$nextButton.focus();
            //         }
            //     });
            // }
            // this.$nextButton.blur(() => {
            //     if (this.extension.tabbing && this.extension.shifted) {
            //         setTimeout(() => {
            //             $elementWithGreatestTabIndex.focus();
            //         }, 100);
            //     }
            // });
            if (!Utils.Bools.getBool(this.options.pagingToggleEnabled, true)) {
                this.$pagingToggleButtons.hide();
            }
        };
        PagingHeaderPanel.prototype.openGallery = function () {
            this.$oneUpButton.removeClass('on');
            this.$twoUpButton.removeClass('on');
            this.$galleryButton.addClass('on');
        };
        PagingHeaderPanel.prototype.closeGallery = function () {
            this.updatePagingToggle();
            this.$galleryButton.removeClass('on');
        };
        PagingHeaderPanel.prototype.isPageModeEnabled = function () {
            return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode_1.Mode.page.toString();
        };
        PagingHeaderPanel.prototype.setNavigationTitles = function () {
            if (this.isPageModeEnabled()) {
                if (this.extension.helper.isRightToLeft()) {
                    this.$firstButton.prop('title', this.content.lastPage);
                    this.$firstButton.find('span').text(this.content.lastPage);
                    this.$prevButton.prop('title', this.content.nextPage);
                    this.$prevButton.find('span').text(this.content.nextPage);
                    this.$nextButton.prop('title', this.content.previousPage);
                    this.$nextButton.find('span').text(this.content.previousPage);
                    this.$lastButton.prop('title', this.content.firstPage);
                    this.$lastButton.find('span').text(this.content.firstPage);
                }
                else {
                    this.$firstButton.prop('title', this.content.firstPage);
                    this.$firstButton.find('span').text(this.content.firstPage);
                    this.$prevButton.prop('title', this.content.previousPage);
                    this.$prevButton.find('span').text(this.content.previousPage);
                    this.$nextButton.prop('title', this.content.nextPage);
                    this.$nextButton.find('span').text(this.content.nextPage);
                    this.$lastButton.prop('title', this.content.lastPage);
                    this.$lastButton.find('span').text(this.content.lastPage);
                }
            }
            else {
                if (this.extension.helper.isRightToLeft()) {
                    this.$firstButton.prop('title', this.content.lastImage);
                    this.$firstButton.find('span').text(this.content.lastPage);
                    this.$prevButton.prop('title', this.content.nextImage);
                    this.$prevButton.find('span').text(this.content.nextImage);
                    this.$nextButton.prop('title', this.content.previousImage);
                    this.$nextButton.find('span').text(this.content.previousImage);
                    this.$lastButton.prop('title', this.content.firstImage);
                    this.$lastButton.find('span').text(this.content.firstImage);
                }
                else {
                    this.$firstButton.prop('title', this.content.firstImage);
                    this.$firstButton.find('span').text(this.content.firstImage);
                    this.$prevButton.prop('title', this.content.previousImage);
                    this.$prevButton.find('span').text(this.content.previousImage);
                    this.$nextButton.prop('title', this.content.nextImage);
                    this.$nextButton.find('span').text(this.content.nextImage);
                    this.$lastButton.prop('title', this.content.lastImage);
                    this.$lastButton.find('span').text(this.content.lastImage);
                }
            }
        };
        PagingHeaderPanel.prototype.updatePagingToggle = function () {
            if (!this.pagingToggleIsVisible()) {
                this.$pagingToggleButtons.hide();
                return;
            }
            if (this.extension.isPagingSettingEnabled()) {
                this.$oneUpButton.removeClass('on');
                this.$twoUpButton.addClass('on');
            }
            else {
                this.$twoUpButton.removeClass('on');
                this.$oneUpButton.addClass('on');
            }
        };
        PagingHeaderPanel.prototype.pagingToggleIsVisible = function () {
            return Utils.Bools.getBool(this.options.pagingToggleEnabled, true) && this.extension.helper.isPagingAvailable();
        };
        PagingHeaderPanel.prototype.updateGalleryButton = function () {
            if (!this.galleryIsVisible()) {
                this.$galleryButton.hide();
            }
        };
        PagingHeaderPanel.prototype.galleryIsVisible = function () {
            return Utils.Bools.getBool(this.options.galleryButtonEnabled, true) && this.extension.isLeftPanelEnabled();
        };
        PagingHeaderPanel.prototype.setTotal = function () {
            var of = this.content.of;
            if (this.isPageModeEnabled()) {
                this.$total.html(Utils.Strings.format(of, this.extension.helper.getLastCanvasLabel(true)));
            }
            else {
                this.$total.html(Utils.Strings.format(of, this.extension.helper.getTotalCanvases().toString()));
            }
        };
        PagingHeaderPanel.prototype.setSearchFieldValue = function (index) {
            var canvas = this.extension.helper.getCanvasByIndex(index);
            var value = null;
            if (this.isPageModeEnabled()) {
                var orderLabel = Manifesto.LanguageMap.getValue(canvas.getLabel());
                if (orderLabel === "-") {
                    value = "";
                }
                else {
                    value = orderLabel;
                }
            }
            else {
                index += 1;
                value = index.toString();
            }
            if (this.options.autoCompleteBoxEnabled) {
                this.$autoCompleteBox.val(value);
            }
            else {
                this.$searchText.val(value);
            }
        };
        PagingHeaderPanel.prototype.search = function (value) {
            if (!value) {
                this.extension.showMessage(this.content.emptyValue);
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            if (this.isPageModeEnabled()) {
                $.publish(Events_1.Events.PAGE_SEARCH, [value]);
            }
            else {
                var index = void 0;
                if (this.options.autoCompleteBoxEnabled) {
                    index = parseInt(this.$autoCompleteBox.val(), 10);
                }
                else {
                    index = parseInt(this.$searchText.val(), 10);
                }
                index -= 1;
                if (isNaN(index)) {
                    this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content.invalidNumber);
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
                    return;
                }
                var asset = this.extension.helper.getCanvasByIndex(index);
                if (!asset) {
                    this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content.pageNotFound);
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
                    return;
                }
                $.publish(Events_1.Events.IMAGE_SEARCH, [index]);
            }
        };
        PagingHeaderPanel.prototype.canvasIndexChanged = function (index) {
            this.setSearchFieldValue(index);
            if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true) {
                this.$imageSelectionBox.val(index);
            }
            var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
            if (viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString()) {
                if (this.extension.helper.isFirstCanvas()) {
                    this.disableLastButton();
                    this.disableNextButton();
                }
                else {
                    this.enableLastButton();
                    this.enableNextButton();
                }
                if (this.extension.helper.isLastCanvas()) {
                    this.disableFirstButton();
                    this.disablePrevButton();
                }
                else {
                    this.enableFirstButton();
                    this.enablePrevButton();
                }
            }
            else {
                if (this.extension.helper.isFirstCanvas()) {
                    this.disableFirstButton();
                    this.disablePrevButton();
                }
                else {
                    this.enableFirstButton();
                    this.enablePrevButton();
                }
                if (this.extension.helper.isLastCanvas()) {
                    this.disableLastButton();
                    this.disableNextButton();
                }
                else {
                    this.enableLastButton();
                    this.enableNextButton();
                }
            }
        };
        PagingHeaderPanel.prototype.disableFirstButton = function () {
            this.firstButtonEnabled = false;
            this.$firstButton.disable();
        };
        PagingHeaderPanel.prototype.enableFirstButton = function () {
            this.firstButtonEnabled = true;
            this.$firstButton.enable();
        };
        PagingHeaderPanel.prototype.disableLastButton = function () {
            this.lastButtonEnabled = false;
            this.$lastButton.disable();
        };
        PagingHeaderPanel.prototype.enableLastButton = function () {
            this.lastButtonEnabled = true;
            this.$lastButton.enable();
        };
        PagingHeaderPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.disable();
        };
        PagingHeaderPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.enable();
        };
        PagingHeaderPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.disable();
        };
        PagingHeaderPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.enable();
        };
        PagingHeaderPanel.prototype.modeChanged = function () {
            this.setSearchFieldValue(this.extension.helper.canvasIndex);
            this.setNavigationTitles();
            this.setTotal();
        };
        PagingHeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            // hide toggle buttons below minimum width
            if (this.extension.width() < this.extension.data.config.options.minWidthBreakPoint) {
                if (this.pagingToggleIsVisible())
                    this.$pagingToggleButtons.hide();
                if (this.galleryIsVisible())
                    this.$galleryButton.hide();
            }
            else {
                if (this.pagingToggleIsVisible())
                    this.$pagingToggleButtons.show();
                if (this.galleryIsVisible())
                    this.$galleryButton.show();
            }
        };
        return PagingHeaderPanel;
    }(HeaderPanel_1.HeaderPanel));
    exports.PagingHeaderPanel = PagingHeaderPanel;
});
