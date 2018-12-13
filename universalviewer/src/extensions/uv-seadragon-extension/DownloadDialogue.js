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
define(["require", "exports", "../../modules/uv-shared-module/BaseEvents", "../../modules/uv-dialogues-module/DownloadDialogue", "../../modules/uv-shared-module/DownloadOption", "./DownloadType"], function (require, exports, BaseEvents_1, DownloadDialogue_1, DownloadOption_1, DownloadType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Size = Manifesto.Size;
    var DownloadDialogue = /** @class */ (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            return _super.call(this, $element) || this;
        }
        DownloadDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
            // create ui.
            this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + '</a>');
            this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + ' </div>');
            this.$pagingNote.append(this.$settingsButton);
            this.$content.append(this.$pagingNote);
            this.$imageOptionsContainer = $('<li class="group image"></li>');
            this.$downloadOptions.append(this.$imageOptionsContainer);
            this.$imageOptions = $('<ul></ul>');
            this.$imageOptionsContainer.append(this.$imageOptions);
            this.$currentViewAsJpgButton = $('<li class="option single"><input id="' + DownloadOption_1.DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption_1.DownloadOption.currentViewAsJpg.toString() + '"></label></li>');
            this.$imageOptions.append(this.$currentViewAsJpgButton);
            this.$currentViewAsJpgButton.hide();
            this.$wholeImageHighResButton = $('<li class="option single"><input id="' + DownloadOption_1.DownloadOption.wholeImageHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption_1.DownloadOption.wholeImageHighRes.toString() + 'label" for="' + DownloadOption_1.DownloadOption.wholeImageHighRes.toString() + '"></label></li>');
            this.$imageOptions.append(this.$wholeImageHighResButton);
            this.$wholeImageHighResButton.hide();
            this.$wholeImagesHighResButton = $('<li class="option multiple"><input id="' + DownloadOption_1.DownloadOption.wholeImagesHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption_1.DownloadOption.wholeImagesHighRes.toString() + 'label" for="' + DownloadOption_1.DownloadOption.wholeImagesHighRes.toString() + '"></label></li>');
            this.$imageOptions.append(this.$wholeImagesHighResButton);
            this.$wholeImageHighResButton.hide();
            this.$wholeImageLowResAsJpgButton = $('<li class="option single"><input id="' + DownloadOption_1.DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption_1.DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
            this.$imageOptions.append(this.$wholeImageLowResAsJpgButton);
            this.$wholeImageLowResAsJpgButton.hide();
            this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
            this.$downloadOptions.append(this.$canvasOptionsContainer);
            this.$canvasOptions = $('<ul></ul>');
            this.$canvasOptionsContainer.append(this.$canvasOptions);
            this.$sequenceOptionsContainer = $('<li class="group sequence"></li>');
            this.$downloadOptions.append(this.$sequenceOptionsContainer);
            this.$sequenceOptions = $('<ul></ul>');
            this.$sequenceOptionsContainer.append(this.$sequenceOptions);
            this.$selectionButton = $('<li class="option"><input id="' + DownloadOption_1.DownloadOption.selection.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption_1.DownloadOption.selection.toString() + 'label" for="' + DownloadOption_1.DownloadOption.selection.toString() + '"></label></li>');
            this.$sequenceOptions.append(this.$selectionButton);
            this.$selectionButton.hide();
            this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
            this.$buttons.prepend(this.$downloadButton);
            this.$explanatoryTextTemplate = $('<span class="explanatory"></span>');
            var that = this;
            // what happens on download is specific to the extension (except for renderings which need to be moved to the base download dialogue)
            // todo: we need to make everything a list of radio button options in the base class, then we can unify everything into a single render method
            this.$downloadButton.on('click', function (e) {
                e.preventDefault();
                var $selectedOption = that.getSelectedOption();
                var id = $selectedOption.attr('id');
                var label = $selectedOption.attr('title');
                var mime = $selectedOption.data('mime');
                var type = DownloadType_1.DownloadType.UNKNOWN;
                var canvas = _this.extension.helper.getCurrentCanvas();
                if (_this.renderingUrls[id]) {
                    if (mime) {
                        if (mime.toLowerCase().indexOf('pdf') !== -1) {
                            type = DownloadType_1.DownloadType.ENTIREDOCUMENTASPDF;
                        }
                        else if (mime.toLowerCase().indexOf('txt') !== -1) {
                            type = DownloadType_1.DownloadType.ENTIREDOCUMENTASTEXT;
                        }
                    }
                    if (type = DownloadType_1.DownloadType.ENTIREDOCUMENTASPDF) {
                        //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
                        // if downloading a pdf - if there's a print service, generate an event instead of opening a new window.
                        // if (printService && this.extension.isOnHomeDomain()){
                        //     $.publish(Events.PRINT);
                        // } else {
                        window.open(_this.renderingUrls[id]);
                        //}
                    }
                }
                else {
                    switch (id) {
                        case DownloadOption_1.DownloadOption.currentViewAsJpg.toString():
                            var viewer = that.extension.getViewer();
                            window.open(that.extension.getCroppedImageUri(canvas, viewer));
                            type = DownloadType_1.DownloadType.CURRENTVIEW;
                            break;
                        case DownloadOption_1.DownloadOption.selection.toString():
                            Utils.Async.waitFor(function () {
                                return !_this.isActive;
                            }, function () {
                                $.publish(BaseEvents_1.BaseEvents.SHOW_MULTISELECT_DIALOGUE);
                            });
                            break;
                        case DownloadOption_1.DownloadOption.wholeImageHighRes.toString():
                            window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCurrentCanvas()));
                            type = DownloadType_1.DownloadType.WHOLEIMAGEHIGHRES;
                            break;
                        case DownloadOption_1.DownloadOption.wholeImagesHighRes.toString():
                            var indices = _this.extension.getPagedIndices();
                            for (var i = 0; i < indices.length; i++) {
                                window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCanvasByIndex(indices[i])));
                            }
                            type = DownloadType_1.DownloadType.WHOLEIMAGESHIGHRES;
                            break;
                        case DownloadOption_1.DownloadOption.wholeImageLowResAsJpg.toString():
                            var imageUri = that.extension.getConfinedImageUri(canvas, that.options.confinedImageSize);
                            if (imageUri) {
                                window.open(imageUri);
                            }
                            type = DownloadType_1.DownloadType.WHOLEIMAGELOWRES;
                            break;
                    }
                }
                $.publish(BaseEvents_1.BaseEvents.DOWNLOAD, [{
                        "type": type,
                        "label": label
                    }]);
                _this.close();
            });
            this.$settingsButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.HIDE_DOWNLOAD_DIALOGUE);
                $.publish(BaseEvents_1.BaseEvents.SHOW_SETTINGS_DIALOGUE);
            });
        };
        DownloadDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            var canvas = this.extension.helper.getCurrentCanvas();
            var rotation = this.extension.getViewerRotation();
            var hasNormalDimensions = rotation % 180 == 0;
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.currentViewAsJpg)) {
                var $input = this.$currentViewAsJpgButton.find('input');
                var $label = this.$currentViewAsJpgButton.find('label');
                var label = this.content.currentViewAsJpg;
                var viewer = this.extension.getViewer();
                var dimensions = this.extension.getCroppedImageDimensions(canvas, viewer);
                // dimensions
                if (dimensions) {
                    label = hasNormalDimensions ?
                        Utils.Strings.format(label, dimensions.size.width.toString(), dimensions.size.height.toString()) :
                        Utils.Strings.format(label, dimensions.size.height.toString(), dimensions.size.width.toString());
                    $label.text(label);
                    $input.prop('title', label);
                    this.$currentViewAsJpgButton.data('width', dimensions.size.width);
                    this.$currentViewAsJpgButton.data('height', dimensions.size.height);
                    this.$currentViewAsJpgButton.show();
                }
                else {
                    this.$currentViewAsJpgButton.hide();
                }
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.currentViewAsJpgExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$currentViewAsJpgButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.wholeImageHighRes)) {
                var $input = this.$wholeImageHighResButton.find('input');
                var $label = this.$wholeImageHighResButton.find('label');
                var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
                if (mime) {
                    mime = Utils.Files.simplifyMimeType(mime);
                }
                else {
                    mime = '?';
                }
                // dimensions
                var size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());
                if (!size) {
                    // if there is no image service, allow the image to be downloaded directly.
                    if (canvas.externalResource && !canvas.externalResource.hasServiceDescriptor()) {
                        var label = Utils.Strings.format(this.content.wholeImageHighRes, '?', '?', mime);
                        $label.text(label);
                        $input.prop('title', label);
                        this.$wholeImageHighResButton.show();
                    }
                    else {
                        this.$wholeImageHighResButton.hide();
                    }
                }
                else {
                    var label = hasNormalDimensions ?
                        Utils.Strings.format(this.content.wholeImageHighRes, size.width.toString(), size.height.toString(), mime) :
                        Utils.Strings.format(this.content.wholeImageHighRes, size.height.toString(), size.width.toString(), mime);
                    $label.text(label);
                    $input.prop('title', label);
                    this.$wholeImageHighResButton.data('width', size.width);
                    this.$wholeImageHighResButton.data('height', size.height);
                    this.$wholeImageHighResButton.show();
                }
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImageHighResExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImageHighResButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.wholeImagesHighRes)) {
                var $input = this.$wholeImagesHighResButton.find('input');
                var $label = this.$wholeImagesHighResButton.find('label');
                var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
                if (mime) {
                    mime = Utils.Files.simplifyMimeType(mime);
                }
                else {
                    mime = '?';
                }
                var label = Utils.Strings.format(this.content.wholeImagesHighRes, mime);
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImagesHighResButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImagesHighResExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImagesHighResButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.wholeImageLowResAsJpg)) {
                var $input = this.$wholeImageLowResAsJpgButton.find('input');
                var $label = this.$wholeImageLowResAsJpgButton.find('label');
                var size = this.extension.getConfinedImageDimensions(canvas, this.options.confinedImageSize);
                var label = hasNormalDimensions ?
                    Utils.Strings.format(this.content.wholeImageLowResAsJpg, size.width.toString(), size.height.toString()) :
                    Utils.Strings.format(this.content.wholeImageLowResAsJpg, size.height.toString(), size.width.toString());
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImageLowResAsJpgButton.data('width', size.width);
                this.$wholeImageLowResAsJpgButton.data('height', size.height);
                this.$wholeImageLowResAsJpgButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImageLowResAsJpgExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImageLowResAsJpgButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.selection)) {
                var $input = this.$selectionButton.find('input');
                var $label = this.$selectionButton.find('label');
                $label.text(this.content.downloadSelection);
                $input.prop('title', this.content.downloadSelection);
                this.$selectionButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.selectionExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$selectionButton.hide();
            }
            this.resetDynamicDownloadOptions();
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.rangeRendering)) {
                if (canvas.ranges && canvas.ranges.length) {
                    for (var i = 0; i < canvas.ranges.length; i++) {
                        var range = canvas.ranges[i];
                        var renderingOptions = this.getDownloadOptionsForRenderings(range, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.dynamicCanvasRenderings);
                        this.addDownloadOptionsForRenderings(renderingOptions);
                    }
                }
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.dynamicImageRenderings)) {
                var images = canvas.getImages();
                for (var i = 0; i < images.length; i++) {
                    var renderingOptions = this.getDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.dynamicImageRenderings);
                    this.addDownloadOptionsForRenderings(renderingOptions);
                }
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.dynamicCanvasRenderings)) {
                var renderingOptions = this.getDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.dynamicCanvasRenderings);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.dynamicSequenceRenderings)) {
                var renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption_1.DownloadOption.dynamicSequenceRenderings);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
            // hide the current view option if it's equivalent to whole image.
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.currentViewAsJpg)) {
                var currentWidth = parseInt(this.$currentViewAsJpgButton.data('width').toString());
                var currentHeight = parseInt(this.$currentViewAsJpgButton.data('height').toString());
                var wholeWidth = parseInt(this.$wholeImageHighResButton.data('width').toString());
                var wholeHeight = parseInt(this.$wholeImageHighResButton.data('height').toString());
                var percentageWidth = (currentWidth / wholeWidth) * 100;
                var percentageHeight = (currentHeight / wholeHeight) * 100;
                var disabledPercentage = this.options.currentViewDisabledPercentage;
                // if over disabledPercentage of the size of whole image
                if (percentageWidth >= disabledPercentage && percentageHeight >= disabledPercentage) {
                    this.$currentViewAsJpgButton.hide();
                }
                else {
                    this.$currentViewAsJpgButton.show();
                }
            }
            // order by image area
            var $options = this.$imageOptions.find('li.single');
            $options = $options.sort(function (a, b) {
                var aWidth = $(a).data('width');
                aWidth ? aWidth = parseInt(aWidth.toString()) : 0;
                var aHeight = $(a).data('height');
                aHeight ? aHeight = parseInt(aHeight.toString()) : 0;
                var bWidth = $(b).data('width');
                bWidth ? bWidth = parseInt(bWidth.toString()) : 0;
                var bHeight = $(b).data('height');
                bHeight ? bHeight = parseInt(bHeight.toString()) : 0;
                var aArea = aWidth * aHeight;
                var bArea = bWidth * bHeight;
                if (aArea < bArea) {
                    return -1;
                }
                if (aArea > bArea) {
                    return 1;
                }
                return 0;
            });
            $options.detach().appendTo(this.$imageOptions);
            // hide empty groups
            var $groups = this.$downloadOptions.find('li.group');
            $groups.each(function (index, group) {
                var $group = $(group);
                $group.show();
                if ($group.find('li.option:hidden').length === $group.find('li.option').length) {
                    // all options are hidden, hide group.
                    $group.hide();
                }
            });
            this.$downloadOptions.find('li.group:visible').last().addClass('lastVisible');
            if (this.extension.isPagingSettingEnabled() && (this.config.options.downloadPagingNoteEnabled)) {
                this.$pagingNote.show();
            }
            else {
                this.$pagingNote.hide();
            }
            if (!this.$downloadOptions.find('li.option:visible').length) {
                this.$noneAvailable.show();
                this.$downloadButton.hide();
            }
            else {
                // select first option.
                this.$downloadOptions.find('li.option input:visible:first').prop("checked", true);
                this.$noneAvailable.hide();
                this.$downloadButton.show();
            }
            this.resize();
        };
        DownloadDialogue.prototype.addDownloadOptionsForRenderings = function (renderingOptions) {
            var _this = this;
            renderingOptions.forEach(function (option) {
                switch (option.type) {
                    case DownloadOption_1.DownloadOption.dynamicImageRenderings:
                        _this.$imageOptions.append(option.button);
                        break;
                    case DownloadOption_1.DownloadOption.dynamicCanvasRenderings:
                        _this.$canvasOptions.append(option.button);
                        break;
                    case DownloadOption_1.DownloadOption.dynamicSequenceRenderings:
                        _this.$sequenceOptions.append(option.button);
                        break;
                }
            });
        };
        DownloadDialogue.prototype.getCanvasImageResource = function (canvas) {
            var images = canvas.getImages();
            if (images[0]) {
                return images[0].getResource();
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasHighResImageUri = function (canvas) {
            var size = this.getCanvasComputedDimensions(canvas);
            if (size) {
                var width = size.width;
                var uri = canvas.getCanonicalImageUri(width);
                if (canvas.externalResource && canvas.externalResource.hasServiceDescriptor()) {
                    var uri_parts = uri.split('/');
                    var rotation = this.extension.getViewerRotation();
                    uri_parts[uri_parts.length - 2] = String(rotation);
                    uri = uri_parts.join('/');
                }
                return uri;
            }
            else if (canvas.externalResource && !canvas.externalResource.hasServiceDescriptor()) {
                // if there is no image service, return the dataUri.
                return canvas.externalResource.dataUri;
            }
            return '';
        };
        DownloadDialogue.prototype.getCanvasMimeType = function (canvas) {
            var resource = this.getCanvasImageResource(canvas);
            if (resource) {
                var format = resource.getFormat();
                if (format) {
                    return format.toString();
                }
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasDimensions = function (canvas) {
            // externalResource may not have loaded yet
            if (canvas.externalResource.data) {
                var width = canvas.externalResource.data.width;
                var height = canvas.externalResource.data.height;
                if (width && height) {
                    return new Size(width, height);
                }
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasComputedDimensions = function (canvas) {
            var imageSize = this.getCanvasDimensions(canvas);
            var requiredSize = canvas.getMaxDimensions();
            if (!imageSize) {
                return null;
            }
            if (!requiredSize) {
                return imageSize;
            }
            if (imageSize.width <= requiredSize.width && imageSize.height <= requiredSize.height) {
                return imageSize;
            }
            var scaleW = requiredSize.width / imageSize.width;
            var scaleH = requiredSize.height / imageSize.height;
            var scale = Math.min(scaleW, scaleH);
            return new Size(Math.floor(imageSize.width * scale), Math.floor(imageSize.height * scale));
        };
        DownloadDialogue.prototype._isLevel0 = function (profile) {
            if (!profile || !profile.length)
                return false;
            return manifesto.Utils.isLevel0ImageProfile(profile[0]);
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            if (!this.extension.resources) {
                return false;
            }
            var canvas = this.extension.helper.getCurrentCanvas();
            // if the external resource doesn't have a service descriptor or is level 0
            // only allow wholeImageHighRes
            if (!canvas.externalResource.hasServiceDescriptor() || this._isLevel0(canvas.externalResource.data.profile)) {
                if (option === DownloadOption_1.DownloadOption.wholeImageHighRes) {
                    // if in one-up mode, or in two-up mode with a single page being shown
                    if (!this.extension.isPagingSettingEnabled() ||
                        this.extension.isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {
                        return true;
                    }
                }
                return false;
            }
            switch (option) {
                case DownloadOption_1.DownloadOption.currentViewAsJpg:
                case DownloadOption_1.DownloadOption.dynamicCanvasRenderings:
                case DownloadOption_1.DownloadOption.dynamicImageRenderings:
                case DownloadOption_1.DownloadOption.wholeImageHighRes:
                    // if in one-up mode, or in two-up mode with a single page being shown
                    if (!this.extension.isPagingSettingEnabled() ||
                        this.extension.isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {
                        var maxDimensions = canvas.getMaxDimensions();
                        if (maxDimensions) {
                            if (maxDimensions.width <= this.options.maxImageWidth) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                case DownloadOption_1.DownloadOption.wholeImagesHighRes:
                    if (this.extension.isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length > 1) {
                        return true;
                    }
                    return false;
                case DownloadOption_1.DownloadOption.wholeImageLowResAsJpg:
                    // hide low-res option if hi-res width is smaller than constraint
                    var size = this.getCanvasComputedDimensions(canvas);
                    if (!size) {
                        return false;
                    }
                    return (!this.extension.isPagingSettingEnabled() && (size.width > this.options.confinedImageSize));
                case DownloadOption_1.DownloadOption.selection:
                    return this.options.selectionEnabled;
                case DownloadOption_1.DownloadOption.rangeRendering:
                    if (canvas.ranges && canvas.ranges.length) {
                        var range = canvas.ranges[0];
                        return range.getRenderings().length > 0;
                    }
                    return false;
                default:
                    return _super.prototype.isDownloadOptionAvailable.call(this, option);
            }
        };
        return DownloadDialogue;
    }(DownloadDialogue_1.DownloadDialogue));
    exports.DownloadDialogue = DownloadDialogue;
});
