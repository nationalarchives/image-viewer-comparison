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
define(["require", "exports", "../uv-shared-module/BaseEvents", "../uv-shared-module/Dialogue", "../uv-shared-module/DownloadOption"], function (require, exports, BaseEvents_1, Dialogue_1, DownloadOption_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DownloadDialogue = /** @class */ (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            return _super.call(this, $element) || this;
        }
        DownloadDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseEvents_1.BaseEvents.SHOW_DOWNLOAD_DIALOGUE;
            this.closeCommand = BaseEvents_1.BaseEvents.HIDE_DOWNLOAD_DIALOGUE;
            $.subscribe(this.openCommand, function (e, $triggerButton) {
                _this.open($triggerButton);
            });
            $.subscribe(this.closeCommand, function () {
                _this.close();
            });
            // create ui.
            this.$title = $('<h1>' + this.content.title + '</h1>');
            this.$content.append(this.$title);
            this.$noneAvailable = $('<div class="noneAvailable">' + this.content.noneAvailable + '</div>');
            this.$content.append(this.$noneAvailable);
            this.$downloadOptions = $('<ol class="options"></ol>');
            this.$content.append(this.$downloadOptions);
            this.$footer = $('<div class="footer"></div>');
            this.$content.append(this.$footer);
            this.$termsOfUseButton = $('<a href="#">' + this.extension.data.config.content.termsOfUse + '</a>');
            this.$footer.append(this.$termsOfUseButton);
            this.$termsOfUseButton.onPressed(function () {
                $.publish(BaseEvents_1.BaseEvents.SHOW_TERMS_OF_USE);
            });
            // hide
            this.$element.hide();
            this.updateTermsOfUseButton();
        };
        DownloadDialogue.prototype.addEntireFileDownloadOptions = function () {
            if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.entireFileAsOriginal)) {
                this.$downloadOptions.empty();
                // add each file src
                var canvas = this.extension.helper.getCurrentCanvas();
                var renderingFound = false;
                var renderings = canvas.getRenderings();
                for (var i = 0; i < renderings.length; i++) {
                    var rendering = renderings[i];
                    var renderingFormat = rendering.getFormat();
                    var format = '';
                    if (renderingFormat) {
                        format = renderingFormat.toString();
                    }
                    this.addEntireFileDownloadOption(rendering.id, Manifesto.LanguageMap.getValue(rendering.getLabel()), format);
                    renderingFound = true;
                }
                if (!renderingFound) {
                    var annotationFound = false;
                    var annotations = canvas.getContent();
                    for (var i = 0; i < annotations.length; i++) {
                        var annotation = annotations[i];
                        var body = annotation.getBody();
                        if (body.length) {
                            var format = body[0].getFormat();
                            if (format) {
                                this.addEntireFileDownloadOption(body[0].id, '', format.toString());
                                annotationFound = true;
                            }
                        }
                    }
                    if (!annotationFound) {
                        this.addEntireFileDownloadOption(canvas.id, '', '');
                    }
                }
            }
        };
        DownloadDialogue.prototype.addEntireFileDownloadOption = function (uri, label, format) {
            var fileType;
            if (format) {
                fileType = Utils.Files.simplifyMimeType(format);
            }
            else {
                fileType = this.getFileExtension(uri);
            }
            if (!label) {
                label = this.content.entireFileAsOriginal;
            }
            if (fileType) {
                label += " (" + fileType + ")";
            }
            this.$downloadOptions.append('<li><a href="' + uri + '" target="_blank" download tabindex="0">' + label + '</li>');
        };
        DownloadDialogue.prototype.resetDynamicDownloadOptions = function () {
            this.renderingUrls = [];
            this.renderingUrlsCount = 0;
            this.$downloadOptions.find('li.dynamic').remove();
        };
        DownloadDialogue.prototype.getDownloadOptionsForRenderings = function (resource, defaultLabel, type) {
            var renderings = resource.getRenderings();
            var downloadOptions = [];
            for (var i = 0; i < renderings.length; i++) {
                var rendering = renderings[i];
                if (rendering) {
                    var label = Manifesto.LanguageMap.getValue(rendering.getLabel(), this.extension.getLocale());
                    var currentId = "downloadOption" + ++this.renderingUrlsCount;
                    if (label) {
                        label += " ({0})";
                    }
                    else {
                        label = defaultLabel;
                    }
                    var mime = Utils.Files.simplifyMimeType(rendering.getFormat().toString());
                    label = Utils.Strings.format(label, mime);
                    this.renderingUrls[currentId] = rendering.id;
                    var $button = $('<li class="option dynamic"><input id="' + currentId + '" data-mime="' + mime + '" title="' + label + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + currentId + '">' + label + '</label></li>');
                    downloadOptions.push({
                        type: type,
                        button: $button
                    });
                }
            }
            return downloadOptions;
        };
        DownloadDialogue.prototype.getSelectedOption = function () {
            return this.$downloadOptions.find("li.option input:checked");
        };
        DownloadDialogue.prototype.getCurrentResourceId = function () {
            var canvas = this.extension.helper.getCurrentCanvas();
            return canvas.externalResource.data.id;
        };
        DownloadDialogue.prototype.getCurrentResourceFormat = function () {
            var id = this.getCurrentResourceId();
            return id.substr(id.lastIndexOf('.') + 1).toLowerCase();
        };
        DownloadDialogue.prototype.updateNoneAvailable = function () {
            if (!this.$downloadOptions.find('li:visible').length) {
                this.$noneAvailable.show();
            }
            else {
                // select first option.
                this.$noneAvailable.hide();
            }
        };
        DownloadDialogue.prototype.updateTermsOfUseButton = function () {
            var requiredStatement = this.extension.helper.getRequiredStatement();
            if (Utils.Bools.getBool(this.extension.data.config.options.termsOfUseEnabled, false) && requiredStatement && requiredStatement.value) {
                this.$termsOfUseButton.show();
            }
            else {
                this.$termsOfUseButton.hide();
            }
        };
        DownloadDialogue.prototype.getFileExtension = function (fileUri) {
            var extension = fileUri.split('.').pop();
            // if it's not a valid file extension
            if (extension.length > 5 || extension.indexOf('/') !== -1) {
                return null;
            }
            return extension;
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            switch (option) {
                case DownloadOption_1.DownloadOption.entireFileAsOriginal:
                    // check if ui-extensions disable it
                    var uiExtensions = this.extension.helper.manifest.getService(manifesto.ServiceProfile.uiExtensions());
                    if (uiExtensions && !this.extension.helper.isUIEnabled('mediaDownload')) {
                        return false;
                    }
            }
            return true;
        };
        DownloadDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        DownloadDialogue.prototype.resize = function () {
            this.setDockedPosition();
        };
        return DownloadDialogue;
    }(Dialogue_1.Dialogue));
    exports.DownloadDialogue = DownloadDialogue;
});
