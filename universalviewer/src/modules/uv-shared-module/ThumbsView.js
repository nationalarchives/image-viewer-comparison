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
    var ThumbsView = /** @class */ (function (_super) {
        __extends(ThumbsView, _super);
        function ThumbsView($element) {
            var _this = _super.call(this, $element, true, true) || this;
            _this.isCreated = false;
            _this.isOpen = false;
            return _this;
        }
        ThumbsView.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, index) {
                _this.selectIndex(parseInt(index));
            });
            $.subscribe(BaseEvents_1.BaseEvents.LOGIN, function () {
                _this.loadThumbs();
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLICKTHROUGH, function () {
                _this.loadThumbs();
            });
            this.$thumbs = $('<div class="thumbs"></div>');
            this.$element.append(this.$thumbs);
            var viewingDirection = this.extension.helper.getViewingDirection() || manifesto.ViewingDirection.leftToRight();
            this.$thumbs.addClass(viewingDirection.toString()); // defaults to "left-to-right"
            var that = this;
            $.templates({
                thumbsTemplate: '<div id="thumb{{>index}}" class="{{:~className()}}" data-src="{{>uri}}" data-visible="{{>visible}}" data-index="{{>index}}">\
                                <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
                                <div class="info">\
                                    <span class="index">{{:#index + 1}}</span>\
                                    <span class="label" title="{{>label}}">{{>label}}&nbsp;</span>\
                                    <span class="searchResults" title="{{:~searchResultsTitle()}}">{{>data.searchResults}}</span>\
                                </div>\
                             </div>\
                             {{if ~separator()}} \
                                 <div class="separator"></div> \
                             {{/if}}'
            });
            var extraHeight = this.options.thumbsExtraHeight;
            $.views.helpers({
                separator: function () {
                    return false;
                },
                extraHeight: function () {
                    return extraHeight;
                },
                className: function () {
                    var className = "thumb";
                    if (this.data.index === 0) {
                        className += " first";
                    }
                    if (!this.data.uri) {
                        className += " placeholder";
                    }
                    var viewingDirection = that.extension.helper.getViewingDirection();
                    if (viewingDirection && (viewingDirection.toString() === manifesto.ViewingDirection.leftToRight().toString() || viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString())) {
                        className += " twoCol";
                    }
                    else if (that.extension.helper.isPaged()) {
                        className += " twoCol";
                    }
                    else {
                        className += " oneCol";
                    }
                    return className;
                },
                searchResultsTitle: function () {
                    var searchResults = Number(this.data.data.searchResults);
                    if (searchResults) {
                        if (searchResults > 1) {
                            return Utils.Strings.format(that.content.searchResults, searchResults.toString());
                        }
                        return Utils.Strings.format(that.content.searchResult, searchResults.toString());
                    }
                    return '';
                }
            });
            // use unevent to detect scroll stop.
            this.$element.on('scroll', function () {
                _this.scrollStop();
            }, 100);
            this.resize();
        };
        ThumbsView.prototype.databind = function () {
            if (!this.thumbs)
                return;
            this._$thumbsCache = null; // delete cache
            this.createThumbs();
            // do initial load to show padlocks
            this.loadThumbs(0);
            this.selectIndex(this.extension.helper.canvasIndex);
        };
        ThumbsView.prototype.createThumbs = function () {
            var that = this;
            if (!this.thumbs)
                return;
            // get median height
            var heights = [];
            for (var i = 0; i < this.thumbs.length; i++) {
                var thumb = this.thumbs[i];
                heights.push(thumb.height);
            }
            var medianHeight = Utils.Maths.median(heights);
            for (var i = 0; i < this.thumbs.length; i++) {
                var thumb = this.thumbs[i];
                thumb.height = medianHeight;
            }
            this.$thumbs.link($.templates.thumbsTemplate, this.thumbs);
            this.$thumbs.undelegate('.thumb', 'click');
            this.$thumbs.delegate(".thumb", "click", function (e) {
                e.preventDefault();
                var data = $.view(this).data;
                that.lastThumbClickedIndex = data.index;
                $.publish(BaseEvents_1.BaseEvents.THUMB_SELECTED, [data]);
            });
            this.setLabel();
            this.isCreated = true;
        };
        ThumbsView.prototype.scrollStop = function () {
            var scrollPos = 1 / ((this.$thumbs.height() - this.$element.height()) / this.$element.scrollTop());
            if (scrollPos > 1)
                scrollPos = 1;
            var thumbRangeMid = Math.floor((this.thumbs.length - 1) * scrollPos);
            this.loadThumbs(thumbRangeMid);
        };
        ThumbsView.prototype.loadThumbs = function (index) {
            if (index === void 0) { index = this.extension.helper.canvasIndex; }
            if (!this.thumbs || !this.thumbs.length)
                return;
            var thumbType;
            // get the type of the canvas content
            var canvas = this.extension.helper.getCanvasByIndex(index);
            var annotations = canvas.getContent();
            if (annotations.length) {
                var annotation = annotations[0];
                var body = annotation.getBody();
                if (body.length) {
                    var type = body[0].getType();
                    if (type) {
                        thumbType = type.toString().toLowerCase();
                    }
                }
            }
            var thumbRangeMid = index;
            var thumbLoadRange = this.options.thumbsLoadRange;
            var thumbRange = {
                start: (thumbRangeMid > thumbLoadRange) ? thumbRangeMid - thumbLoadRange : 0,
                end: (thumbRangeMid < (this.thumbs.length - 1) - thumbLoadRange) ? thumbRangeMid + thumbLoadRange : this.thumbs.length - 1
            };
            var fadeDuration = this.options.thumbsImageFadeInDuration;
            var that = this;
            for (var i = thumbRange.start; i <= thumbRange.end; i++) {
                var $thumb = this.getThumbByIndex(i);
                var $wrap = $thumb.find('.wrap');
                // if no img has been added yet
                if (!$wrap.hasClass('loading') && !$wrap.hasClass('loaded')) {
                    var visible = $thumb.attr('data-visible');
                    if (visible !== "false") {
                        $wrap.removeClass('loadingFailed');
                        $wrap.addClass('loading');
                        if (thumbType) {
                            $wrap.addClass(thumbType);
                        }
                        var src = $thumb.attr('data-src');
                        if (that.config.options.thumbsCacheInvalidation && that.config.options.thumbsCacheInvalidation.enabled) {
                            src += that.config.options.thumbsCacheInvalidation.paramType + "t=" + Utils.Dates.getTimeStamp();
                        }
                        var $img = $('<img src="' + src + '" alt=""/>');
                        // fade in on load.
                        $img.hide();
                        $img.on('load', function () {
                            $(this).fadeIn(fadeDuration, function () {
                                $(this).parent().switchClass('loading', 'loaded');
                            });
                        });
                        $img.on('error', function () {
                            $(this).parent().switchClass('loading', 'loadingFailed');
                        });
                        $wrap.append($img);
                    }
                    else {
                        $wrap.addClass('hidden');
                    }
                }
            }
        };
        ThumbsView.prototype.show = function () {
            var _this = this;
            this.isOpen = true;
            this.$element.show();
            setTimeout(function () {
                _this.selectIndex(_this.extension.helper.canvasIndex);
            }, 1);
        };
        ThumbsView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };
        ThumbsView.prototype.isPDF = function () {
            var canvas = this.extension.helper.getCurrentCanvas();
            var type = canvas.getType();
            if (type) {
                return (type.toString().includes("pdf"));
            }
            return false;
        };
        ThumbsView.prototype.setLabel = function () {
            $(this.$thumbs).find('span.index').hide();
            $(this.$thumbs).find('span.label').show();
        };
        ThumbsView.prototype.addSelectedClassToThumbs = function (index) {
            this.getThumbByIndex(index).addClass('selected');
        };
        ThumbsView.prototype.selectIndex = function (index) {
            // may be authenticating
            if (index === -1)
                return;
            if (!this.thumbs || !this.thumbs.length)
                return;
            this.getAllThumbs().removeClass('selected');
            this.$selectedThumb = this.getThumbByIndex(index);
            this.addSelectedClassToThumbs(index);
            var indices = this.extension.getPagedIndices(index);
            // scroll to thumb if the index change didn't originate
            // within the thumbs view.
            if (!~indices.indexOf(this.lastThumbClickedIndex)) {
                this.$element.scrollTop(this.$selectedThumb.position().top);
            }
            // make sure visible images are loaded.
            this.loadThumbs(index);
        };
        ThumbsView.prototype.getAllThumbs = function () {
            if (!this._$thumbsCache) {
                this._$thumbsCache = this.$thumbs.find('.thumb');
            }
            return this._$thumbsCache;
        };
        ThumbsView.prototype.getThumbByIndex = function (canvasIndex) {
            return this.$thumbs.find('[data-index="' + canvasIndex + '"]');
        };
        ThumbsView.prototype.scrollToThumb = function (canvasIndex) {
            var $thumb = this.getThumbByIndex(canvasIndex);
            this.$element.scrollTop($thumb.position().top);
        };
        ThumbsView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return ThumbsView;
    }(BaseView_1.BaseView));
    exports.ThumbsView = ThumbsView;
});
