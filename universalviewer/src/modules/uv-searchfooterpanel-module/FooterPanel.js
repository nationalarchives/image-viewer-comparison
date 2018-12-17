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
define(["require", "exports", "../uv-shared-module/AutoComplete", "../uv-shared-module/BaseEvents", "../../extensions/uv-seadragon-extension/Events", "../uv-shared-module/FooterPanel", "../../extensions/uv-seadragon-extension/Mode", "../../Utils"], function (require, exports, AutoComplete_1, BaseEvents_1, Events_1, FooterPanel_1, Mode_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FooterPanel = /** @class */ (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            var _this = _super.call(this, $element) || this;
            _this.placemarkerTouched = false;
            return _this;
        }
        FooterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('searchFooterPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function () {
                _this.canvasIndexChanged();
                _this.setCurrentSearchResultPlacemarker();
                _this.updatePrevButton();
                _this.updateNextButton();
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS, function () {
                _this.clearSearchResults();
            });
            // todo: this should be a setting
            $.subscribe(Events_1.Events.MODE_CHANGED, function () {
                _this.settingsChanged();
            });
            $.subscribe(Events_1.Events.SEARCH, function (e, terms) {
                _this.terms = terms;
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS, function (e, annotationResults) {
                _this.displaySearchResults(annotationResults.annotations, annotationResults.terms);
                _this.setCurrentSearchResultPlacemarker();
                _this.updatePrevButton();
                _this.updateNextButton();
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATIONS_EMPTY, function () {
                _this.hideSearchSpinner();
            });
            $.subscribe(BaseEvents_1.BaseEvents.ANNOTATION_CHANGED, function () {
                _this.updatePrevButton();
                _this.updateNextButton();
            });
            this.$printButton = $("\n          <button class=\"print btn imageBtn\" title=\"" + this.content.print + "\" tabindex=\"0\">\n            <i class=\"uv-icon uv-icon-print\" aria-hidden=\"true\"></i>" + this.content.print + "\n          </button>\n        ");
            this.$options.prepend(this.$printButton);
            // search input.
            this.$searchContainer = $('<div class="search"></div>');
            this.$element.prepend(this.$searchContainer);
            this.$searchOptions = $('<div class="searchOptions"></div>');
            this.$searchContainer.append(this.$searchOptions);
            this.$searchLabel = $('<span class="label">' + this.content.searchWithin + '</span>');
            this.$searchOptions.append(this.$searchLabel);
            this.$searchTextContainer = $('<div class="searchTextContainer"></div>');
            this.$searchOptions.append(this.$searchTextContainer);
            this.$searchText = $('<input class="searchText" type="text" maxlength="100" value="' + this.content.enterKeyword + '" aria-label="' + this.content.searchWithin + '"/>');
            this.$searchTextContainer.append(this.$searchText);
            this.$searchButton = $('<a class="imageButton searchButton" tabindex="0"></a>');
            this.$searchTextContainer.append(this.$searchButton);
            // search results.
            this.$searchPagerContainer = $('<div class="searchPager"></div>');
            this.$element.prepend(this.$searchPagerContainer);
            this.$searchPagerControls = $('<div class="controls"></div>');
            this.$searchPagerContainer.prepend(this.$searchPagerControls);
            this.$previousResultButton = $('<a class="previousResult" title="' + this.content.previousResult + '">' + this.content.previousResult + '</a>');
            this.$searchPagerControls.append(this.$previousResultButton);
            this.$searchResultsInfo = $('<div class="searchResultsInfo"><span class="info"><span class="number">x</span> <span class="foundFor"></span> \'<span class="terms">y</span>\'<?span></div>');
            this.$searchPagerControls.append(this.$searchResultsInfo);
            this.$clearSearchResultsButton = $('<a class="clearSearch" title="' + this.content.clearSearch + '">' + this.content.clearSearch + '</a>');
            this.$searchResultsInfo.append(this.$clearSearchResultsButton);
            this.$nextResultButton = $('<a class="nextResult" title="' + this.content.nextResult + '">' + this.content.nextResult + '</a>');
            this.$searchPagerControls.append(this.$nextResultButton);
            // placemarker line.
            this.$searchResultsContainer = $('<div class="searchResults"></div>');
            this.$element.prepend(this.$searchResultsContainer);
            this.$line = $('<div class="line"></div>');
            this.$searchResultsContainer.append(this.$line);
            this.$pagePositionMarker = $('<div class="positionPlacemarker"></div>');
            this.$searchResultsContainer.append(this.$pagePositionMarker);
            this.$pagePositionLabel = $('<div class="label"></div>');
            this.$searchResultsContainer.append(this.$pagePositionLabel);
            this.$placemarkerDetails = $('<div class="placeMarkerDetails"></div>');
            this.$searchResultsContainer.append(this.$placemarkerDetails);
            this.$placemarkerDetailsTop = $('<h1></h1>');
            this.$placemarkerDetails.append(this.$placemarkerDetailsTop);
            this.$placemarkerDetailsBottom = $('<p></p>');
            this.$placemarkerDetails.append(this.$placemarkerDetailsBottom);
            // initialise ui.
            this.$searchPagerContainer.hide();
            this.$placemarkerDetails.hide();
            // ui event handlers.
            var that = this;
            this.$searchButton.on('click', function (e) {
                e.preventDefault();
                _this.search(_this.$searchText.val());
            });
            this.$searchText.on('focus', function () {
                // clear initial text.
                if (_this.$searchText.val() === _this.content.enterKeyword)
                    _this.$searchText.val('');
            });
            this.$placemarkerDetails.on('mouseover', function () {
                $.publish(Events_1.Events.SEARCH_PREVIEW_START, [_this.currentPlacemarkerIndex]);
            });
            this.$placemarkerDetails.on('mouseleave', function () {
                $(this).hide();
                $.publish(Events_1.Events.SEARCH_PREVIEW_FINISH);
                // reset all placemarkers.
                var placemarkers = that.getSearchResultPlacemarkers();
                placemarkers.removeClass('hover');
            });
            this.$placemarkerDetails.on('click', function () {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [_this.currentPlacemarkerIndex]);
            });
            this.$previousResultButton.on('click', function (e) {
                e.preventDefault();
                if (_this.isPreviousButtonEnabled()) {
                    $.publish(Events_1.Events.PREV_SEARCH_RESULT);
                }
            });
            this.$nextResultButton.on('click', function (e) {
                e.preventDefault();
                if (_this.isNextButtonEnabled()) {
                    $.publish(Events_1.Events.NEXT_SEARCH_RESULT);
                }
            });
            this.$clearSearchResultsButton.on('click', function (e) {
                e.preventDefault();
                $.publish(BaseEvents_1.BaseEvents.CLEAR_ANNOTATIONS);
            });
            // hide search options if not enabled/supported.
            if (!this.isSearchEnabled()) {
                this.$searchContainer.hide();
                this.$searchPagerContainer.hide();
                this.$searchResultsContainer.hide();
                this.$element.addClass('min');
            }
            if (this.extension.helper.getTotalCanvases() === 1) {
                this.$searchResultsContainer.hide();
            }
            var autocompleteService = this.extension.getAutoCompleteUri();
            if (autocompleteService) {
                new AutoComplete_1.AutoComplete(this.$searchText, function (terms, cb) {
                    $.getJSON(Utils.Strings.format(autocompleteService, terms), function (results) {
                        cb(results);
                    });
                }, function (results) {
                    return $.map(results.terms, function (result) {
                        return result.match;
                    });
                }, function (terms) {
                    _this.search(terms);
                }, 300, 2, true, Utils.Bools.getBool(this.options.autocompleteAllowWords, false));
            }
            else {
                this.$searchText.on("keyup", function (e) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) {
                        that.search(that.$searchText.val());
                    }
                });
            }
            this.$printButton.onPressed(function () {
                $.publish(Events_1.Events.PRINT);
            });
            this.updatePrintButton();
            var positionMarkerEnabled = Utils.Bools.getBool(this.config.options.positionMarkerEnabled, true);
            if (!positionMarkerEnabled) {
                this.$pagePositionMarker.hide();
                this.$pagePositionLabel.hide();
            }
        };
        FooterPanel.prototype.isSearchEnabled = function () {
            return this.extension.isSearchEnabled();
        };
        FooterPanel.prototype.isZoomToSearchResultEnabled = function () {
            return Utils.Bools.getBool(this.extension.data.config.options.zoomToSearchResultEnabled, true);
        };
        FooterPanel.prototype.isPreviousButtonEnabled = function () {
            var currentCanvasIndex = this.extension.helper.canvasIndex;
            var firstSearchResultCanvasIndex = this.getFirstSearchResultCanvasIndex();
            var currentSearchResultRectIndex = this.getCurrentSearchResultRectIndex();
            // if zoom to search result is enabled and there is a highlighted search result.
            if (this.isZoomToSearchResultEnabled() && this.extension.currentAnnotationRect) {
                if (currentCanvasIndex < firstSearchResultCanvasIndex) {
                    return false;
                }
                else if (currentCanvasIndex === firstSearchResultCanvasIndex) {
                    if (currentSearchResultRectIndex === 0) {
                        return false;
                    }
                }
                return true;
            }
            return (currentCanvasIndex > firstSearchResultCanvasIndex);
        };
        FooterPanel.prototype.isNextButtonEnabled = function () {
            var currentCanvasIndex = this.extension.helper.canvasIndex;
            var lastSearchResultCanvasIndex = this.getLastSearchResultCanvasIndex();
            var currentSearchResultRectIndex = this.getCurrentSearchResultRectIndex();
            // if zoom to search result is enabled and there is a highlighted search result.
            if (this.isZoomToSearchResultEnabled() && this.extension.currentAnnotationRect) {
                if (currentCanvasIndex > lastSearchResultCanvasIndex) {
                    return false;
                }
                else if (currentCanvasIndex === lastSearchResultCanvasIndex) {
                    if (currentSearchResultRectIndex === this.getLastSearchResultRectIndex()) {
                        return false;
                    }
                }
                return true;
            }
            return (currentCanvasIndex < lastSearchResultCanvasIndex);
        };
        FooterPanel.prototype.getSearchResults = function () {
            return this.extension.annotations;
        };
        FooterPanel.prototype.getCurrentSearchResultRectIndex = function () {
            return this.extension.getCurrentAnnotationRectIndex();
        };
        FooterPanel.prototype.getFirstSearchResultCanvasIndex = function () {
            var searchResults = this.getSearchResults();
            if (!searchResults)
                return -1;
            var firstSearchResultCanvasIndex = searchResults[0].canvasIndex;
            return firstSearchResultCanvasIndex;
        };
        FooterPanel.prototype.getLastSearchResultCanvasIndex = function () {
            var searchResults = this.getSearchResults();
            if (!searchResults)
                return -1;
            var lastSearchResultCanvasIndex = searchResults[searchResults.length - 1].canvasIndex;
            return lastSearchResultCanvasIndex;
        };
        FooterPanel.prototype.getLastSearchResultRectIndex = function () {
            return this.extension.getLastAnnotationRectIndex();
        };
        FooterPanel.prototype.updateNextButton = function () {
            var searchResults = this.getSearchResults();
            if (searchResults && searchResults.length) {
                if (this.isNextButtonEnabled()) {
                    this.$nextResultButton.removeClass('disabled');
                }
                else {
                    this.$nextResultButton.addClass('disabled');
                }
            }
        };
        FooterPanel.prototype.updatePrevButton = function () {
            var searchResults = this.getSearchResults();
            if (searchResults && searchResults.length) {
                if (this.isPreviousButtonEnabled()) {
                    this.$previousResultButton.removeClass('disabled');
                }
                else {
                    this.$previousResultButton.addClass('disabled');
                }
            }
        };
        FooterPanel.prototype.updatePrintButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.printEnabled, false);
            //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
            //if (configEnabled && printService && this.extension.isOnHomeDomain()){
            if (configEnabled) {
                this.$printButton.show();
            }
            else {
                this.$printButton.hide();
            }
        };
        FooterPanel.prototype.search = function (terms) {
            this.terms = terms;
            if (this.terms === '' || this.terms === this.content.enterKeyword) {
                this.extension.showMessage(this.config.modules.genericDialogue.content.emptyValue, function () {
                    this.$searchText.focus();
                });
                return;
            }
            // blur search field
            this.$searchText.blur();
            this.showSearchSpinner();
            $.publish(Events_1.Events.SEARCH, [this.terms]);
        };
        FooterPanel.prototype.getSearchResultPlacemarkers = function () {
            return this.$searchResultsContainer.find('.searchResultPlacemarker');
        };
        FooterPanel.prototype.setCurrentSearchResultPlacemarker = function () {
            var placemarkers = this.getSearchResultPlacemarkers();
            placemarkers.parent().find('.current').removeClass('current');
            var $current = $('.searchResultPlacemarker[data-index="' + this.extension.helper.canvasIndex + '"]');
            $current.addClass('current');
        };
        FooterPanel.prototype.positionSearchResultPlacemarkers = function () {
            var searchResults = this.getSearchResults();
            if (!searchResults || !searchResults.length)
                return;
            // clear all existing placemarkers
            var placemarkers = this.getSearchResultPlacemarkers();
            placemarkers.remove();
            var pageWidth = this.getPageLineRatio();
            var lineTop = this.$line.position().top;
            var lineLeft = this.$line.position().left;
            var that = this;
            // for each page with a result, place a marker along the line.
            for (var i = 0; i < searchResults.length; i++) {
                var result = searchResults[i];
                var distance = result.canvasIndex * pageWidth;
                var $placemarker = $('<div class="searchResultPlacemarker" data-index="' + result.canvasIndex + '"></div>');
                $placemarker[0].ontouchstart = function (e) { that.onPlacemarkerTouchStart.call(this, that); };
                $placemarker.click(function (e) { that.onPlacemarkerClick.call(this, that); });
                $placemarker.mouseenter(function (e) { that.onPlacemarkerMouseEnter.call(this, that); });
                $placemarker.mouseleave(function (e) { that.onPlacemarkerMouseLeave.call(this, e, that); });
                this.$searchResultsContainer.append($placemarker);
                var top_1 = lineTop - $placemarker.height();
                var left = lineLeft + distance - ($placemarker.width() / 2);
                $placemarker.css({
                    top: top_1,
                    left: left
                });
            }
        };
        FooterPanel.prototype.onPlacemarkerTouchStart = function (that) {
            that.placemarkerTouched = true;
            //const $placemarker: JQuery = $(this);
            //const index: number = parseInt($placemarker.attr('data-index'));
            //$.publish(Events.VIEW_PAGE, [index]);
        };
        FooterPanel.prototype.onPlacemarkerClick = function (that) {
            if (that.placemarkerTouched)
                return;
            that.placemarkerTouched = false;
            //const $placemarker: JQuery = $(this);
            //const index: number = parseInt($placemarker.attr('data-index'));
            //$.publish(Events.VIEW_PAGE, [index]);
        };
        FooterPanel.prototype.onPlacemarkerMouseEnter = function (that) {
            if (that.placemarkerTouched)
                return;
            var $placemarker = $(this);
            $placemarker.addClass('hover');
            var canvasIndex = parseInt($placemarker.attr('data-index'));
            $.publish(Events_1.Events.SEARCH_PREVIEW_START, [canvasIndex]);
            var $placemarkers = that.getSearchResultPlacemarkers();
            var elemIndex = $placemarkers.index($placemarker[0]);
            that.currentPlacemarkerIndex = canvasIndex;
            that.$placemarkerDetails.show();
            var title = "{0} {1}";
            if (that.isPageModeEnabled()) {
                var canvas = that.extension.helper.getCanvasByIndex(canvasIndex);
                var label = Manifesto.LanguageMap.getValue(canvas.getLabel());
                if (!label) {
                    label = this.extension.helper.manifest.options.defaultLabel;
                }
                title = Utils.Strings.format(title, that.content.pageCaps, label);
            }
            else {
                title = Utils.Strings.format(title, that.content.imageCaps, String(canvasIndex + 1));
            }
            that.$placemarkerDetailsTop.html(title);
            var searchResults = that.getSearchResults();
            if (searchResults) {
                var result = searchResults[elemIndex];
                var terms = "";
                if (that.terms) {
                    terms = Utils.Strings.ellipsis(that.terms, that.options.elideDetailsTermsCount);
                }
                var instanceFoundText = that.content.instanceFound;
                var instancesFoundText = that.content.instancesFound;
                var text = '';
                if (result.rects.length === 1) {
                    text = Utils.Strings.format(instanceFoundText, terms);
                    that.$placemarkerDetailsBottom.html(text);
                }
                else {
                    text = Utils.Strings.format(instancesFoundText, String(result.rects.length), terms);
                    that.$placemarkerDetailsBottom.html(text);
                }
            }
            var pos = $placemarker.position();
            var top = pos.top - that.$placemarkerDetails.height();
            var left = pos.left;
            if (left < that.$placemarkerDetails.width() / 2) {
                left = 0 - ($placemarker.width() / 2);
            }
            else if (left > that.$line.width() - (that.$placemarkerDetails.width() / 2)) {
                left = that.$line.width() - that.$placemarkerDetails.width() + ($placemarker.width() / 2);
            }
            else {
                left -= (that.$placemarkerDetails.width() / 2);
            }
            that.$placemarkerDetails.css({
                top: top,
                left: left
            });
        };
        FooterPanel.prototype.onPlacemarkerMouseLeave = function (e, that) {
            $.publish(Events_1.Events.SEARCH_PREVIEW_FINISH);
            var $placemarker = $(this);
            var newElement = e.toElement || e.relatedTarget;
            var isChild = $(newElement).closest(that.$placemarkerDetails).length;
            if (newElement != that.$placemarkerDetails.get(0) && isChild === 0) {
                that.$placemarkerDetails.hide();
                $placemarker.removeClass('hover');
            }
        };
        FooterPanel.prototype.setPageMarkerPosition = function () {
            if (this.extension.helper.canvasIndex === null)
                return;
            // position placemarker showing current page.
            var pageLineRatio = this.getPageLineRatio();
            var lineTop = this.$line.position().top;
            var lineLeft = this.$line.position().left;
            var position = this.extension.helper.canvasIndex * pageLineRatio;
            var top = lineTop;
            var left = lineLeft + position;
            this.$pagePositionMarker.css({
                top: top,
                left: left
            });
            // if the remaining distance to the right is less than the width of the label
            // shift it to the left.
            var lineWidth = this.$line.width();
            if (left + this.$pagePositionLabel.outerWidth(true) > lineWidth) {
                left -= this.$pagePositionLabel.outerWidth(true);
                this.$pagePositionLabel.removeClass('right');
                this.$pagePositionLabel.addClass('left');
            }
            else {
                this.$pagePositionLabel.removeClass('left');
                this.$pagePositionLabel.addClass('right');
            }
            this.$pagePositionLabel.css({
                top: top,
                left: left
            });
        };
        FooterPanel.prototype.clearSearchResults = function () {
            if (!this.isSearchEnabled()) {
                return;
            }
            // clear all existing placemarkers
            var $placemarkers = this.getSearchResultPlacemarkers();
            $placemarkers.remove();
            // clear search input field.
            this.$searchText.val(this.content.enterKeyword);
            // hide pager.
            this.$searchContainer.show();
            this.$searchPagerContainer.hide();
            // set focus to search box.
            this.$searchText.focus();
        };
        FooterPanel.prototype.getPageLineRatio = function () {
            var lineWidth = this.$line.width();
            // find page/width ratio by dividing the line width by the number of pages in the book.
            if (this.extension.helper.getTotalCanvases() === 1)
                return 0;
            return lineWidth / (this.extension.helper.getTotalCanvases() - 1);
        };
        FooterPanel.prototype.canvasIndexChanged = function () {
            this.setPageMarkerPosition();
            this.setPlacemarkerLabel();
        };
        FooterPanel.prototype.settingsChanged = function () {
            this.setPlacemarkerLabel();
        };
        FooterPanel.prototype.setPlacemarkerLabel = function () {
            var displaying = this.content.displaying;
            var index = this.extension.helper.canvasIndex;
            if (this.isPageModeEnabled()) {
                var canvas = this.extension.helper.getCanvasByIndex(index);
                var label = Manifesto.LanguageMap.getValue(canvas.getLabel());
                if (!label) {
                    label = this.content.defaultLabel;
                }
                var lastCanvasOrderLabel = this.extension.helper.getLastCanvasLabel(true);
                if (lastCanvasOrderLabel) {
                    this.$pagePositionLabel.html(Utils.Strings.format(displaying, this.content.page, Utils_1.UVUtils.sanitize(label), Utils_1.UVUtils.sanitize(lastCanvasOrderLabel)));
                }
            }
            else {
                this.$pagePositionLabel.html(Utils.Strings.format(displaying, this.content.image, String(index + 1), this.extension.helper.getTotalCanvases().toString()));
            }
        };
        FooterPanel.prototype.isPageModeEnabled = function () {
            return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode_1.Mode.page.toString() && !Utils.Bools.getBool(this.config.options.forceImageMode, false);
        };
        FooterPanel.prototype.showSearchSpinner = function () {
            this.$searchText.addClass('searching');
        };
        FooterPanel.prototype.hideSearchSpinner = function () {
            this.$searchText.removeClass('searching');
        };
        FooterPanel.prototype.displaySearchResults = function (results, terms) {
            if (!this.isSearchEnabled()) {
                return;
            }
            this.hideSearchSpinner();
            this.positionSearchResultPlacemarkers();
            // show pager.
            this.$searchContainer.hide();
            this.$searchPagerControls.css({
                'left': 0
            });
            var $info = this.$searchResultsInfo.find('.info');
            var $number = $info.find('.number');
            var $foundFor = $info.find('.foundFor');
            var $terms = $info.find('.terms');
            if (terms) {
                $info.show();
                $number.text(this.extension.getTotalAnnotationRects());
                if (results.length === 1) {
                    $foundFor.html(this.content.resultFoundFor);
                }
                else {
                    $foundFor.html(this.content.resultsFoundFor);
                }
                $terms.html(Utils.Strings.ellipsis(terms, this.options.elideResultsTermsCount));
                $terms.prop('title', terms);
            }
            else {
                $info.hide();
            }
            this.$searchPagerContainer.show();
            this.resize();
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var searchResults = this.getSearchResults();
            if (searchResults && searchResults.length) {
                this.positionSearchResultPlacemarkers();
            }
            this.setPageMarkerPosition();
            this.$searchPagerContainer.width(this.$element.width());
            var center = this.$element.width() / 2;
            // position search pager controls.
            this.$searchPagerControls.css({
                'left': center - (this.$searchPagerControls.width() / 2)
            });
            // position search input.
            this.$searchOptions.css({
                'left': center - (this.$searchOptions.outerWidth() / 2)
            });
        };
        return FooterPanel;
    }(FooterPanel_1.FooterPanel));
    exports.FooterPanel = FooterPanel;
});
