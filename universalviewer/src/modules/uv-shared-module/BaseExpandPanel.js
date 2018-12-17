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
define(["require", "exports", "./BaseView"], function (require, exports, BaseView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseExpandPanel = /** @class */ (function (_super) {
        __extends(BaseExpandPanel, _super);
        function BaseExpandPanel($element) {
            var _this = _super.call(this, $element, false, true) || this;
            _this.isExpanded = false;
            _this.isFullyExpanded = false;
            _this.isUnopened = true;
            _this.autoToggled = false;
            _this.expandFullEnabled = true;
            return _this;
        }
        BaseExpandPanel.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.$top = $('<div class="top"></div>');
            this.$element.append(this.$top);
            this.$title = $('<div class="title"></div>');
            this.$title.prop('title', this.content.title);
            this.$top.append(this.$title);
            this.$expandFullButton = $('<a class="expandFullButton" tabindex="0"></a>');
            this.$expandFullButton.prop('title', this.content.expandFull);
            this.$top.append(this.$expandFullButton);
            if (!Utils.Bools.getBool(this.config.options.expandFullEnabled, true)) {
                this.$expandFullButton.hide();
            }
            this.$collapseButton = $('<div class="collapseButton" tabindex="0"></div>');
            this.$collapseButton.prop('title', this.content.collapse);
            this.$top.append(this.$collapseButton);
            this.$closed = $('<div class="closed"></div>');
            this.$element.append(this.$closed);
            this.$expandButton = $('<a class="expandButton" tabindex="0"></a>');
            this.$expandButton.prop('title', this.content.expand);
            this.$closed.append(this.$expandButton);
            this.$closedTitle = $('<a class="title"></a>');
            this.$closedTitle.prop('title', this.content.title);
            this.$closed.append(this.$closedTitle);
            this.$main = $('<div class="main"></div>');
            this.$element.append(this.$main);
            this.$expandButton.onPressed(function () {
                _this.toggle();
            });
            this.$expandFullButton.onPressed(function () {
                _this.expandFull();
            });
            this.$closedTitle.onPressed(function () {
                _this.toggle();
            });
            this.$title.onPressed(function () {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                else {
                    _this.toggle();
                }
            });
            this.$collapseButton.onPressed(function () {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                else {
                    _this.toggle();
                }
            });
            this.$top.hide();
            this.$main.hide();
        };
        BaseExpandPanel.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        BaseExpandPanel.prototype.setTitle = function (title) {
            this.$title.text(title);
            this.$closedTitle.text(title);
        };
        BaseExpandPanel.prototype.toggle = function (autoToggled) {
            var _this = this;
            (autoToggled) ? this.autoToggled = true : this.autoToggled = false;
            // if collapsing, hide contents immediately.
            if (this.isExpanded) {
                this.$top.attr('aria-hidden', 'true');
                this.$main.attr('aria-hidden', 'true');
                this.$closed.attr('aria-hidden', 'false');
                this.$top.hide();
                this.$main.hide();
                this.$closed.show();
            }
            this.$element.stop().animate({
                width: this.getTargetWidth(),
                left: this.getTargetLeft()
            }, this.options.panelAnimationDuration, function () {
                _this.toggled();
            });
        };
        BaseExpandPanel.prototype.toggled = function () {
            this.toggleStart();
            this.isExpanded = !this.isExpanded;
            // if expanded show content when animation finished.
            if (this.isExpanded) {
                this.$top.attr('aria-hidden', 'false');
                this.$main.attr('aria-hidden', 'false');
                this.$closed.attr('aria-hidden', 'true');
                this.$closed.hide();
                this.$top.show();
                this.$main.show();
            }
            this.toggleFinish();
            this.isUnopened = false;
        };
        BaseExpandPanel.prototype.expandFull = function () {
            var _this = this;
            if (!this.isExpanded) {
                this.toggled();
            }
            var targetWidth = this.getFullTargetWidth();
            var targetLeft = this.getFullTargetLeft();
            this.expandFullStart();
            this.$element.stop().animate({
                width: targetWidth,
                left: targetLeft
            }, this.options.panelAnimationDuration, function () {
                _this.expandFullFinish();
            });
        };
        BaseExpandPanel.prototype.collapseFull = function () {
            var _this = this;
            var targetWidth = this.getTargetWidth();
            var targetLeft = this.getTargetLeft();
            this.collapseFullStart();
            this.$element.stop().animate({
                width: targetWidth,
                left: targetLeft
            }, this.options.panelAnimationDuration, function () {
                _this.collapseFullFinish();
            });
        };
        BaseExpandPanel.prototype.getTargetWidth = function () {
            return 0;
        };
        BaseExpandPanel.prototype.getTargetLeft = function () {
            return 0;
        };
        BaseExpandPanel.prototype.getFullTargetWidth = function () {
            return 0;
        };
        BaseExpandPanel.prototype.getFullTargetLeft = function () {
            return 0;
        };
        BaseExpandPanel.prototype.toggleStart = function () {
        };
        BaseExpandPanel.prototype.toggleFinish = function () {
            if (this.isExpanded && !this.autoToggled) {
                this.focusCollapseButton();
            }
            else {
                this.focusExpandButton();
            }
        };
        BaseExpandPanel.prototype.expandFullStart = function () {
        };
        BaseExpandPanel.prototype.expandFullFinish = function () {
            this.isFullyExpanded = true;
            this.$expandFullButton.hide();
            this.focusCollapseButton();
        };
        BaseExpandPanel.prototype.collapseFullStart = function () {
        };
        BaseExpandPanel.prototype.collapseFullFinish = function () {
            this.isFullyExpanded = false;
            if (this.expandFullEnabled) {
                this.$expandFullButton.show();
            }
            this.focusExpandFullButton();
        };
        BaseExpandPanel.prototype.focusExpandButton = function () {
            var _this = this;
            setTimeout(function () {
                _this.$expandButton.focus();
            }, 1);
        };
        BaseExpandPanel.prototype.focusExpandFullButton = function () {
            var _this = this;
            setTimeout(function () {
                _this.$expandFullButton.focus();
            }, 1);
        };
        BaseExpandPanel.prototype.focusCollapseButton = function () {
            var _this = this;
            setTimeout(function () {
                _this.$collapseButton.focus();
            }, 1);
        };
        BaseExpandPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$main.height(this.$element.parent().height() - this.$top.outerHeight(true));
        };
        return BaseExpandPanel;
    }(BaseView_1.BaseView));
    exports.BaseExpandPanel = BaseExpandPanel;
});
