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
define(["require", "exports", "./modules/uv-shared-module/BaseEvents", "./extensions/uv-av-extension/Extension", "./extensions/uv-default-extension/Extension", "./extensions/uv-mediaelement-extension/Extension", "./extensions/uv-seadragon-extension/Extension", "./extensions/uv-pdf-extension/Extension", "./extensions/uv-virtex-extension/Extension", "./Utils"], function (require, exports, BaseEvents_1, Extension_1, Extension_2, Extension_3, Extension_4, Extension_5, Extension_6, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UVComponent = /** @class */ (function (_super) {
        __extends(UVComponent, _super);
        function UVComponent(options) {
            var _this = _super.call(this, options) || this;
            _this.isFullScreen = false;
            _this._init();
            _this._resize();
            return _this;
        }
        UVComponent.prototype._init = function () {
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("UV failed to initialise");
            }
            this._extensions = {};
            this._extensions[manifesto.ResourceType.canvas().toString()] = {
                type: Extension_4.Extension,
                name: 'uv-seadragon-extension'
            };
            this._extensions[manifesto.ResourceType.image().toString()] = {
                type: Extension_4.Extension,
                name: 'uv-seadragon-extension'
            };
            this._extensions[manifesto.ResourceType.movingimage().toString()] = {
                type: Extension_3.Extension,
                name: 'uv-mediaelement-extension'
            };
            this._extensions[manifesto.ResourceType.physicalobject().toString()] = {
                type: Extension_6.Extension,
                name: 'uv-virtex-extension'
            };
            this._extensions[manifesto.ResourceType.sound().toString()] = {
                type: Extension_3.Extension,
                name: 'uv-mediaelement-extension'
            };
            this._extensions[manifesto.RenderingFormat.pdf().toString()] = {
                type: Extension_5.Extension,
                name: 'uv-pdf-extension'
            };
            // presentation 3
            this._extensions[manifesto.MediaType.jpg().toString()] = {
                type: Extension_4.Extension,
                name: 'uv-seadragon-extension'
            };
            this._extensions[manifesto.MediaType.pdf().toString()] = {
                type: Extension_5.Extension,
                name: 'uv-pdf-extension'
            };
            this._extensions[manifesto.MediaType.mp4().toString()] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions[manifesto.MediaType.webm().toString()] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions[manifesto.MediaType.threejs().toString()] = {
                type: Extension_6.Extension,
                name: 'uv-virtex-extension'
            };
            this._extensions['av'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['video'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['audio/mp3'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['audio/mp4'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['application/vnd.apple.mpegurl'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['application/dash+xml'] = {
                type: Extension_1.Extension,
                name: 'uv-av-extension'
            };
            this._extensions['default'] = {
                type: Extension_2.Extension,
                name: 'uv-default-extension'
            };
            this.set(this.options.data);
            return success;
        };
        UVComponent.prototype.data = function () {
            return {
                annotations: undefined,
                root: "./uv",
                canvasIndex: 0,
                collectionIndex: 0,
                config: undefined,
                configUri: undefined,
                embedded: false,
                iiifResourceUri: '',
                isLightbox: false,
                isReload: false,
                limitLocales: false,
                locales: [
                    {
                        name: 'en-GB'
                    }
                ],
                manifestIndex: 0,
                rangeId: undefined,
                rotation: 0,
                sequenceIndex: 0,
                xywh: ''
            };
        };
        UVComponent.prototype.set = function (data) {
            // if this is the first set
            if (!this.extension) {
                if (!data.iiifResourceUri) {
                    this._error("iiifResourceUri is required.");
                    return;
                }
                // remove '/' from root
                if (data.root && data.root.endsWith('/')) {
                    data.root = data.root.substring(0, data.root.length - 1);
                }
                this._reload(data);
            }
            else {
                // changing any of these data properties forces the UV to reload.
                if (Utils_1.UVUtils.propertiesChanged(data, this.extension.data, ['collectionIndex', 'manifestIndex', 'config', 'configUri', 'domain', 'embedDomain', 'embedScriptUri', 'iiifResourceUri', 'isHomeDomain', 'isLightbox', 'isOnlyInstance', 'isReload', 'locales', 'root'])) {
                    this.extension.data = Object.assign({}, this.extension.data, data);
                    this._reload(this.extension.data);
                }
                else {
                    // no need to reload, just update.
                    this.extension.data = Object.assign({}, this.extension.data, data);
                    this.extension.render();
                }
            }
        };
        UVComponent.prototype.get = function (key) {
            if (this.extension) {
                return this.extension.data[key];
            }
        };
        UVComponent.prototype._reload = function (data) {
            var _this = this;
            $.disposePubSub(); // remove any existing event listeners
            $.subscribe(BaseEvents_1.BaseEvents.RELOAD, function (e, data) {
                _this.fire(BaseEvents_1.BaseEvents.RELOAD, data);
            });
            var $elem = $(this.options.target);
            // empty the containing element
            $elem.empty();
            // add loading class
            $elem.addClass('loading');
            jQuery.support.cors = true;
            var that = this;
            Manifold.loadManifest({
                iiifResourceUri: data.iiifResourceUri,
                collectionIndex: data.collectionIndex,
                manifestIndex: data.manifestIndex,
                sequenceIndex: data.sequenceIndex,
                canvasIndex: data.canvasIndex,
                rangeId: data.rangeId,
                locale: (data.locales) ? data.locales[0].name : undefined
            }).then(function (helper) {
                var trackingLabel = helper.getTrackingLabel();
                trackingLabel += ', URI: ' + (window.location !== window.parent.location) ? document.referrer : document.location;
                window.trackingLabel = trackingLabel;
                var sequence;
                if (data.sequenceIndex !== undefined) {
                    sequence = helper.getSequenceByIndex(data.sequenceIndex);
                    if (!sequence) {
                        that._error("Sequence " + data.sequenceIndex + " not found.");
                        return;
                    }
                }
                var canvas;
                if (data.canvasIndex !== undefined) {
                    canvas = helper.getCanvasByIndex(data.canvasIndex);
                }
                if (!canvas) {
                    that._error("Canvas " + data.canvasIndex + " not found.");
                    return;
                }
                var extension = undefined;
                // if the canvas has a duration, use the uv-av-extension
                // const duration: number | null = canvas.getDuration();
                // if (typeof(duration) !== 'undefined') {
                //     extension = that._extensions["av"];
                // } else {
                // canvasType will always be "canvas" in IIIF presentation 3.0
                // to determine the correct extension to use, we need to inspect canvas.content.items[0].format
                // which is an iana media type: http://www.iana.org/assignments/media-types/media-types.xhtml
                var content = canvas.getContent();
                if (content.length) {
                    var annotation = content[0];
                    var body = annotation.getBody();
                    if (body && body.length) {
                        var format = body[0].getFormat();
                        if (format) {
                            extension = that._extensions[format.toString()];
                            if (!extension) {
                                // try type
                                var type = body[0].getType();
                                if (type) {
                                    extension = that._extensions[type.toString()];
                                }
                            }
                        }
                        else {
                            var type = body[0].getType();
                            if (type) {
                                extension = that._extensions[type.toString()];
                            }
                        }
                    }
                }
                else {
                    var canvasType = canvas.getType();
                    if (canvasType) {
                        // try using canvasType
                        extension = that._extensions[canvasType.toString()];
                    }
                    // if there isn't an extension for the canvasType, try the format
                    if (!extension) {
                        var format = canvas.getProperty('format');
                        extension = that._extensions[format];
                    }
                }
                //}
                // if there still isn't a matching extension, use the default extension.
                if (!extension) {
                    extension = that._extensions['default'];
                }
                that._configure(data, extension, function (config) {
                    data.config = config;
                    that._injectCss(data, extension, function () {
                        that._createExtension(extension, data, helper);
                    });
                });
            }).catch(function () {
                that._error('Failed to load manifest.');
            });
        };
        UVComponent.prototype._isCORSEnabled = function () {
            return Modernizr.cors;
        };
        UVComponent.prototype._error = function (message) {
            this.fire(BaseEvents_1.BaseEvents.ERROR, message);
        };
        UVComponent.prototype._configure = function (data, extension, cb) {
            var _this = this;
            this._getConfigExtension(data, extension, function (configExtension) {
                if (data.locales) {
                    var configPath = data.root + '/lib/' + extension.name + '.' + data.locales[0].name + '.config.json';
                    $.getJSON(configPath, function (config) {
                        _this._extendConfig(data, extension, config, configExtension, cb);
                    });
                }
            });
        };
        UVComponent.prototype._extendConfig = function (data, extension, config, configExtension, cb) {
            config.name = extension.name;
            // if configUri has been set, extend the existing config object.
            if (configExtension) {
                // save a reference to the config extension uri.
                config.uri = data.configUri;
                $.extend(true, config, configExtension);
                //$.extend(true, config, configExtension, data.config);
            }
            cb(config);
        };
        UVComponent.prototype._getConfigExtension = function (data, extension, cb) {
            if (!data.locales) {
                return;
            }
            var sessionConfig = sessionStorage.getItem(extension.name + '.' + data.locales[0].name);
            var configUri = data.configUri;
            if (sessionConfig) {
                cb(JSON.parse(sessionConfig));
            }
            else if (configUri) {
                if (this._isCORSEnabled()) {
                    $.getJSON(configUri, function (configExtension) {
                        cb(configExtension);
                    });
                }
                else {
                    // use jsonp
                    var settings = {
                        url: configUri,
                        type: 'GET',
                        dataType: 'jsonp',
                        jsonp: 'callback',
                        jsonpCallback: 'configExtensionCallback'
                    };
                    $.ajax(settings);
                    window.configExtensionCallback = function (configExtension) {
                        cb(configExtension);
                    };
                }
            }
            else {
                cb(null);
            }
        };
        UVComponent.prototype._injectCss = function (data, extension, cb) {
            if (!data.locales) {
                return;
            }
            var cssPath = data.root + '/themes/' + data.config.options.theme + '/css/' + extension.name + '/theme.css';
            var locale = data.locales[0].name;
            var themeName = extension.name.toLowerCase() + '-theme-' + locale.toLowerCase();
            var $existingCSS = $('#' + themeName.toLowerCase());
            if (!$existingCSS.length) {
                $('head').append('<link rel="stylesheet" id="' + themeName + '" href="' + cssPath.toLowerCase() + '" />');
                cb();
            }
            else {
                cb();
            }
        };
        UVComponent.prototype._createExtension = function (extension, data, helper) {
            this.extension = new extension.type();
            if (this.extension) {
                this.extension.component = this;
                this.extension.data = data;
                this.extension.helper = helper;
                this.extension.name = extension.name;
                this.extension.create();
            }
        };
        UVComponent.prototype.exitFullScreen = function () {
            if (this.extension) {
                this.extension.exitFullScreen();
            }
        };
        UVComponent.prototype.resize = function () {
            if (this.extension) {
                this.extension.resize();
            }
        };
        return UVComponent;
    }(_Components.BaseComponent));
    exports.default = UVComponent;
});
