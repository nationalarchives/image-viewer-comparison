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
define(["require", "exports", "./StringValue"], function (require, exports, StringValue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MetricType = /** @class */ (function (_super) {
        __extends(MetricType, _super);
        function MetricType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MetricType.DESKTOP = new MetricType("desktop");
        MetricType.MOBILELANDSCAPE = new MetricType("mobilelandscape");
        MetricType.MOBILEPORTRAIT = new MetricType("mobileportrait");
        MetricType.NONE = new MetricType("none");
        MetricType.WATCH = new MetricType("watch");
        return MetricType;
    }(StringValue_1.StringValue));
    exports.MetricType = MetricType;
});
