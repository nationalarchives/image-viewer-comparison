define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DownloadOption = /** @class */ (function () {
        function DownloadOption(value) {
            this.value = value;
        }
        DownloadOption.prototype.toString = function () {
            return this.value;
        };
        DownloadOption.currentViewAsJpg = new DownloadOption("currentViewAsJpg");
        DownloadOption.dynamicCanvasRenderings = new DownloadOption("dynamicCanvasRenderings");
        DownloadOption.dynamicImageRenderings = new DownloadOption("dynamicImageRenderings");
        DownloadOption.dynamicSequenceRenderings = new DownloadOption("dynamicSequenceRenderings");
        DownloadOption.entireFileAsOriginal = new DownloadOption("entireFileAsOriginal");
        DownloadOption.rangeRendering = new DownloadOption("rangeRendering");
        DownloadOption.selection = new DownloadOption("selection");
        DownloadOption.wholeImageHighRes = new DownloadOption("wholeImageHighRes");
        DownloadOption.wholeImageLowResAsJpg = new DownloadOption("wholeImageLowResAsJpg");
        DownloadOption.wholeImagesHighRes = new DownloadOption("wholeImagesHighRes");
        return DownloadOption;
    }());
    exports.DownloadOption = DownloadOption;
});
