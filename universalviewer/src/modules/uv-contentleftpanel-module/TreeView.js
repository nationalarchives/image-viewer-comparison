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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/BaseView"], function (require, exports, BaseEvents_1, BaseView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TreeView = /** @class */ (function (_super) {
        __extends(TreeView, _super);
        function TreeView($element) {
            var _this = _super.call(this, $element, true, true) || this;
            _this.isOpen = false;
            return _this;
        }
        TreeView.prototype.create = function () {
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            this.$tree = $('<div class="iiif-tree-component"></div>');
            this.$element.append(this.$tree);
        };
        TreeView.prototype.setup = function () {
            this.treeComponent = new IIIFComponents.TreeComponent({
                target: this.$tree[0],
                data: this.treeData
            });
            this.treeComponent.on('treeNodeSelected', function (node) {
                $.publish(BaseEvents_1.BaseEvents.TREE_NODE_SELECTED, [node]);
            }, false);
            this.treeComponent.on('treeNodeMultiSelected', function (node) {
                $.publish(BaseEvents_1.BaseEvents.TREE_NODE_MULTISELECTED, [node]);
            }, false);
        };
        TreeView.prototype.databind = function () {
            this.treeComponent.set(this.treeData);
            this.resize();
        };
        TreeView.prototype.show = function () {
            this.isOpen = true;
            this.$element.show();
        };
        TreeView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };
        TreeView.prototype.selectNode = function (node) {
            this.treeComponent.selectNode(node);
        };
        TreeView.prototype.deselectCurrentNode = function () {
            this.treeComponent.deselectCurrentNode();
        };
        TreeView.prototype.getNodeById = function (id) {
            return this.treeComponent.getNodeById(id);
        };
        TreeView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return TreeView;
    }(BaseView_1.BaseView));
    exports.TreeView = TreeView;
});
