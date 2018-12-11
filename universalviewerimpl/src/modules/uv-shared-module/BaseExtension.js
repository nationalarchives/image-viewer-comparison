define(["require", "exports", "../../Utils", "./Auth09", "./Auth1", "../../modules/uv-dialogues-module/AuthDialogue", "./BaseEvents", "../../modules/uv-dialogues-module/ClickThroughDialogue", "../../modules/uv-dialogues-module/LoginDialogue", "../../modules/uv-shared-module/MetricType", "../../modules/uv-dialogues-module/RestrictedDialogue", "./Shell", "../../SynchronousRequire"], function (require, exports, Utils_1, Auth09_1, Auth1_1, AuthDialogue_1, BaseEvents_1, ClickThroughDialogue_1, LoginDialogue_1, MetricType_1, RestrictedDialogue_1, Shell_1, SynchronousRequire_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseExtension = /** @class */ (function () {
        function BaseExtension() {
            this.isCreated = false;
            this.isLoggedIn = false;
            this.metric = MetricType_1.MetricType.NONE;
            this.metrics = [];
            this.shifted = false;
            this.tabbing = false;
            // auth
        }
        BaseExtension.prototype.create = function () {
            var _this = this;
            var that = this;
            this.$element = $(this.component.options.target);
            this.$element.data("component", this.component);
            this.fire(BaseEvents_1.BaseEvents.CREATE, {
                data: this.data,
                settings: this.getSettings(),
                preview: this.getSharePreview()
            });
            this._parseMetrics();
            this._initLocales();
            // add/remove classes.
            this.$element.empty();
            this.$element.removeClass();
            this.$element.addClass('uv');
            if (this.data.locales) {
                this.$element.addClass(this.data.locales[0].name.toLowerCase());
            }
            this.$element.addClass(this.name);
            this.$element.addClass('browser-' + window.browserDetect.browser);
            this.$element.addClass('browser-version-' + window.browserDetect.version);
            this.$element.prop('tabindex', 0);
            if (this.isMobile()) {
                this.$element.addClass('mobile');
            }
            if (this.data.isLightbox) {
                this.$element.addClass('lightbox');
            }
            if (Utils.Documents.supportsFullscreen()) {
                this.$element.addClass('fullscreen-supported');
            }
            this.$element.on('mousemove', function (e) {
                _this.mouseX = e.pageX;
                _this.mouseY = e.pageY;
            });
            // events
            if (!this.data.isReload) {
                var visibilityProp = Utils.Documents.getHiddenProp();
                if (visibilityProp) {
                    var event_1 = visibilityProp.replace(/[H|h]idden/, '') + 'visibilitychange';
                    document.addEventListener(event_1, function () {
                        // resize after a tab has been shown (fixes safari layout issue)
                        if (!Utils.Documents.isHidden()) {
                            _this.resize();
                        }
                    });
                }
                if (Utils.Bools.getBool(this.data.config.options.dropEnabled, true)) {
                    this.$element.on('drop', (function (e) {
                        e.preventDefault();
                        var dropUrl = e.originalEvent.dataTransfer.getData('URL');
                        var a = Utils.Urls.getUrlParts(dropUrl);
                        var iiifResourceUri = Utils.Urls.getQuerystringParameterFromString('manifest', a.search);
                        if (!iiifResourceUri) {
                            // look for collection param
                            iiifResourceUri = Utils.Urls.getQuerystringParameterFromString('collection', a.search);
                        }
                        //var canvasUri = Utils.Urls.getQuerystringParameterFromString('canvas', url.search);
                        if (iiifResourceUri) {
                            _this.fire(BaseEvents_1.BaseEvents.DROP, iiifResourceUri);
                            var data = {};
                            data.iiifResourceUri = iiifResourceUri;
                            _this.reload(data);
                        }
                    }));
                }
                this.$element.on('dragover', (function (e) {
                    // allow drop
                    e.preventDefault();
                }));
                // keyboard events.
                this.$element.on('keyup keydown', function (e) {
                    _this.shifted = e.shiftKey;
                    _this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
                });
                this.$element.on('keydown', function (e) {
                    var event = null;
                    var preventDefault = true;
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        if (e.keyCode === KeyCodes.KeyDown.Enter) {
                            event = BaseEvents_1.BaseEvents.RETURN;
                            preventDefault = false;
                        }
                        if (e.keyCode === KeyCodes.KeyDown.Escape)
                            event = BaseEvents_1.BaseEvents.ESCAPE;
                        if (e.keyCode === KeyCodes.KeyDown.PageUp)
                            event = BaseEvents_1.BaseEvents.PAGE_UP;
                        if (e.keyCode === KeyCodes.KeyDown.PageDown)
                            event = BaseEvents_1.BaseEvents.PAGE_DOWN;
                        if (e.keyCode === KeyCodes.KeyDown.End)
                            event = BaseEvents_1.BaseEvents.END;
                        if (e.keyCode === KeyCodes.KeyDown.Home)
                            event = BaseEvents_1.BaseEvents.HOME;
                        if (e.keyCode === KeyCodes.KeyDown.NumpadPlus || e.keyCode === 171 || e.keyCode === KeyCodes.KeyDown.Equals) {
                            event = BaseEvents_1.BaseEvents.PLUS;
                            preventDefault = false;
                        }
                        if (e.keyCode === KeyCodes.KeyDown.NumpadMinus || e.keyCode === 173 || e.keyCode === KeyCodes.KeyDown.Dash) {
                            event = BaseEvents_1.BaseEvents.MINUS;
                            preventDefault = false;
                        }
                        if (that.useArrowKeysToNavigate()) {
                            if (e.keyCode === KeyCodes.KeyDown.LeftArrow)
                                event = BaseEvents_1.BaseEvents.LEFT_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.UpArrow)
                                event = BaseEvents_1.BaseEvents.UP_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.RightArrow)
                                event = BaseEvents_1.BaseEvents.RIGHT_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.DownArrow)
                                event = BaseEvents_1.BaseEvents.DOWN_ARROW;
                        }
                    }
                    if (event) {
                        if (preventDefault) {
                            e.preventDefault();
                        }
                        $.publish(event);
                    }
                });
            }
            $.subscribe(BaseEvents_1.BaseEvents.EXIT_FULLSCREEN, function () {
                if (_this.isOverlayActive()) {
                    $.publish(BaseEvents_1.BaseEvents.ESCAPE);
                }
                $.publish(BaseEvents_1.BaseEvents.ESCAPE);
                $.publish(BaseEvents_1.BaseEvents.RESIZE);
            });
            this.$element.append('<a href="/" id="top"></a>');
            this.$element.append('<iframe id="commsFrame" style="display:none"></iframe>');
            this.$element.append('<div id="debug"><span id="watch">Watch</span><span id="mobile-portrait">Mobile Portrait</span><span id="mobile-landscape">Mobile Landscape</span><span id="desktop">Desktop</span></div>');
            $.subscribe(BaseEvents_1.BaseEvents.ACCEPT_TERMS, function () {
                _this.fire(BaseEvents_1.BaseEvents.ACCEPT_TERMS);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LOGIN_FAILED, function () {
                _this.fire(BaseEvents_1.BaseEvents.LOGIN_FAILED);
                _this.showMessage(_this.data.config.content.authorisationFailedMessage);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LOGIN, function () {
                _this.isLoggedIn = true;
                _this.fire(BaseEvents_1.BaseEvents.LOGIN);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LOGOUT, function () {
                _this.isLoggedIn = false;
                _this.fire(BaseEvents_1.BaseEvents.LOGOUT);
            });
            $.subscribe(BaseEvents_1.BaseEvents.BOOKMARK, function () {
                _this.bookmark();
                _this.fire(BaseEvents_1.BaseEvents.BOOKMARK);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED, function () {
                _this.fire(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.data.canvasIndex = canvasIndex;
                _this.lastCanvasIndex = _this.helper.canvasIndex;
                _this.helper.canvasIndex = canvasIndex;
                _this.fire(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, _this.data.canvasIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLICKTHROUGH, function () {
                _this.fire(BaseEvents_1.BaseEvents.CLICKTHROUGH);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLOSE_ACTIVE_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.CLOSE_ACTIVE_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLOSE_LEFT_PANEL, function () {
                _this.fire(BaseEvents_1.BaseEvents.CLOSE_LEFT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseEvents_1.BaseEvents.CLOSE_RIGHT_PANEL, function () {
                _this.fire(BaseEvents_1.BaseEvents.CLOSE_RIGHT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseEvents_1.BaseEvents.COLLECTION_INDEX_CHANGED, function (e, collectionIndex) {
                _this.data.collectionIndex = collectionIndex;
                _this.fire(BaseEvents_1.BaseEvents.COLLECTION_INDEX_CHANGED, _this.data.collectionIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.CREATED, function () {
                _this.isCreated = true;
                _this.fire(BaseEvents_1.BaseEvents.CREATED);
            });
            $.subscribe(BaseEvents_1.BaseEvents.DOWN_ARROW, function () {
                _this.fire(BaseEvents_1.BaseEvents.DOWN_ARROW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.DOWNLOAD, function (e, obj) {
                _this.fire(BaseEvents_1.BaseEvents.DOWNLOAD, obj);
            });
            $.subscribe(BaseEvents_1.BaseEvents.END, function () {
                _this.fire(BaseEvents_1.BaseEvents.END);
            });
            $.subscribe(BaseEvents_1.BaseEvents.ESCAPE, function () {
                _this.fire(BaseEvents_1.BaseEvents.ESCAPE);
                if (_this.isFullScreen() && !_this.isOverlayActive()) {
                    $.publish(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN);
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.EXTERNAL_LINK_CLICKED, function (e, url) {
                _this.fire(BaseEvents_1.BaseEvents.EXTERNAL_LINK_CLICKED, url);
            });
            $.subscribe(BaseEvents_1.BaseEvents.FEEDBACK, function () {
                _this.feedback();
            });
            $.subscribe(BaseEvents_1.BaseEvents.FORBIDDEN, function () {
                _this.fire(BaseEvents_1.BaseEvents.FORBIDDEN);
                $.publish(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_DOWNLOAD_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_DOWNLOAD_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_EMBED_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_EMBED_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_EXTERNALCONTENT_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_EXTERNALCONTENT_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_GENERIC_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_GENERIC_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_HELP_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_HELP_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_INFORMATION, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_INFORMATION);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_LOGIN_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_LOGIN_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_OVERLAY, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_OVERLAY);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_RESTRICTED_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_RESTRICTED_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HIDE_SETTINGS_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.HIDE_SETTINGS_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.HOME, function () {
                _this.fire(BaseEvents_1.BaseEvents.HOME);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFT_ARROW, function () {
                _this.fire(BaseEvents_1.BaseEvents.LEFT_ARROW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
                _this.fire(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START, function () {
                _this.fire(BaseEvents_1.BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH, function () {
                _this.fire(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START, function () {
                _this.fire(BaseEvents_1.BaseEvents.LEFTPANEL_EXPAND_FULL_START);
            });
            $.subscribe(BaseEvents_1.BaseEvents.LOAD_FAILED, function () {
                _this.fire(BaseEvents_1.BaseEvents.LOAD_FAILED);
                if (!that.lastCanvasIndex == null && that.lastCanvasIndex !== that.helper.canvasIndex) {
                    $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [that.lastCanvasIndex]);
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.MANIFEST_INDEX_CHANGED, function (e, manifestIndex) {
                _this.data.manifestIndex = manifestIndex;
                _this.fire(BaseEvents_1.BaseEvents.MANIFEST_INDEX_CHANGED, _this.data.manifestIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.NOT_FOUND, function () {
                _this.fire(BaseEvents_1.BaseEvents.NOT_FOUND);
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN);
                var openUri = Utils.Strings.format(_this.data.config.options.openTemplate, _this.helper.iiifResourceUri);
                window.open(openUri);
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_LEFT_PANEL, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN_LEFT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.OPEN_RIGHT_PANEL, function () {
                _this.fire(BaseEvents_1.BaseEvents.OPEN_RIGHT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseEvents_1.BaseEvents.PAGE_DOWN, function () {
                _this.fire(BaseEvents_1.BaseEvents.PAGE_DOWN);
            });
            $.subscribe(BaseEvents_1.BaseEvents.PAGE_UP, function () {
                _this.fire(BaseEvents_1.BaseEvents.PAGE_UP);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RANGE_CHANGED, function (e, range) {
                if (range) {
                    _this.data.rangeId = range.id;
                    _this.helper.rangeId = range.id;
                    _this.fire(BaseEvents_1.BaseEvents.RANGE_CHANGED, _this.data.rangeId);
                }
                else {
                    _this.data.rangeId = undefined;
                    _this.helper.rangeId = null;
                    _this.fire(BaseEvents_1.BaseEvents.RANGE_CHANGED, null);
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.RESOURCE_DEGRADED, function (e, resource) {
                _this.fire(BaseEvents_1.BaseEvents.RESOURCE_DEGRADED);
                Auth09_1.Auth09.handleDegraded(resource);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RETURN, function () {
                _this.fire(BaseEvents_1.BaseEvents.RETURN);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHT_ARROW, function () {
                _this.fire(BaseEvents_1.BaseEvents.RIGHT_ARROW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHTPANEL_COLLAPSE_FULL_FINISH, function () {
                _this.fire(BaseEvents_1.BaseEvents.RIGHTPANEL_COLLAPSE_FULL_FINISH);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHTPANEL_COLLAPSE_FULL_START, function () {
                _this.fire(BaseEvents_1.BaseEvents.RIGHTPANEL_COLLAPSE_FULL_START);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHTPANEL_EXPAND_FULL_FINISH, function () {
                _this.fire(BaseEvents_1.BaseEvents.RIGHTPANEL_EXPAND_FULL_FINISH);
            });
            $.subscribe(BaseEvents_1.BaseEvents.RIGHTPANEL_EXPAND_FULL_START, function () {
                _this.fire(BaseEvents_1.BaseEvents.RIGHTPANEL_EXPAND_FULL_START);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SEQUENCE_INDEX_CHANGED, function (e, sequenceIndex) {
                _this.data.sequenceIndex = sequenceIndex;
                _this.fire(BaseEvents_1.BaseEvents.SEQUENCE_INDEX_CHANGED, _this.data.sequenceIndex);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, function (e, args) {
                _this.fire(BaseEvents_1.BaseEvents.SETTINGS_CHANGED, args);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_DOWNLOAD_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_DOWNLOAD_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_EMBED_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_EMBED_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_EXTERNALCONTENT_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_EXTERNALCONTENT_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_GENERIC_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_GENERIC_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_HELP_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_HELP_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_INFORMATION, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_INFORMATION);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_LOGIN_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_LOGIN_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_MESSAGE, function (e, message) {
                _this.showMessage(message);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_RESTRICTED_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_RESTRICTED_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_OVERLAY, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_OVERLAY);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_SETTINGS_DIALOGUE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_SETTINGS_DIALOGUE);
            });
            $.subscribe(BaseEvents_1.BaseEvents.SHOW_TERMS_OF_USE, function () {
                _this.fire(BaseEvents_1.BaseEvents.SHOW_TERMS_OF_USE);
                var terms = _this.helper.getLicense();
                if (!terms) {
                    var requiredStatement = _this.helper.getRequiredStatement();
                    if (requiredStatement && requiredStatement.value) {
                        terms = requiredStatement.value;
                    }
                }
                if (terms) {
                    _this.showMessage(terms);
                }
            });
            $.subscribe(BaseEvents_1.BaseEvents.THUMB_SELECTED, function (e, thumb) {
                _this.fire(BaseEvents_1.BaseEvents.THUMB_SELECTED, thumb.index);
            });
            $.subscribe(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN, function () {
                $('#top').focus();
                _this.component.isFullScreen = !_this.component.isFullScreen;
                if (_this.component.isFullScreen) {
                    _this.$element.addClass('fullscreen');
                }
                else {
                    _this.$element.removeClass('fullscreen');
                }
                _this.fire(BaseEvents_1.BaseEvents.TOGGLE_FULLSCREEN, {
                    isFullScreen: _this.component.isFullScreen,
                    overrideFullScreen: _this.data.config.options.overrideFullScreen
                });
            });
            $.subscribe(BaseEvents_1.BaseEvents.UP_ARROW, function () {
                _this.fire(BaseEvents_1.BaseEvents.UP_ARROW);
            });
            $.subscribe(BaseEvents_1.BaseEvents.UPDATE_SETTINGS, function () {
                _this.fire(BaseEvents_1.BaseEvents.UPDATE_SETTINGS);
            });
            $.subscribe(BaseEvents_1.BaseEvents.VIEW_FULL_TERMS, function () {
                _this.fire(BaseEvents_1.BaseEvents.VIEW_FULL_TERMS);
            });
            $.subscribe(BaseEvents_1.BaseEvents.WINDOW_UNLOAD, function () {
                _this.fire(BaseEvents_1.BaseEvents.WINDOW_UNLOAD);
            });
            // create shell and shared views.
            this.shell = new Shell_1.Shell(this.$element);
            // dependencies
            this.getDependencies(function (deps) {
                _this.loadDependencies(deps);
            });
        };
        BaseExtension.prototype.createModules = function () {
            this.$authDialogue = $('<div class="overlay auth" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$authDialogue);
            this.authDialogue = new AuthDialogue_1.AuthDialogue(this.$authDialogue);
            this.$clickThroughDialogue = $('<div class="overlay clickthrough" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$clickThroughDialogue);
            this.clickThroughDialogue = new ClickThroughDialogue_1.ClickThroughDialogue(this.$clickThroughDialogue);
            this.$restrictedDialogue = $('<div class="overlay login" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$restrictedDialogue);
            this.restrictedDialogue = new RestrictedDialogue_1.RestrictedDialogue(this.$restrictedDialogue);
            this.$loginDialogue = $('<div class="overlay login" aria-hidden="true"></div>');
            Shell_1.Shell.$overlays.append(this.$loginDialogue);
            this.loginDialogue = new LoginDialogue_1.LoginDialogue(this.$loginDialogue);
        };
        BaseExtension.prototype.modulesCreated = function () {
        };
        BaseExtension.prototype.getDependencies = function (cb) {
            var that = this;
            var depsUri = this.data.root + '/lib/' + this.name + '-dependencies';
            // check if the deps are already loaded
            var scripts = $('script[data-requiremodule]')
                .filter(function () {
                var attr = $(this).attr('data-requiremodule');
                return (attr.indexOf(that.name) !== -1 && attr.indexOf('dependencies') !== -1);
            });
            if (!scripts.length) {
                requirejs([depsUri], function (getDeps) {
                    // getDeps is a function that accepts a file format.
                    // it uses this to determine which dependencies are appropriate
                    // for example, 'application/vnd.apple.mpegurl' for the AV extension
                    // would return hls.min.js, and not dash.all.min.js.
                    var canvas = that.helper.getCurrentCanvas();
                    var mediaFormats = that.getMediaFormats(canvas);
                    var formats = [];
                    if (mediaFormats && mediaFormats.length) {
                        formats = mediaFormats.map(function (f) {
                            return f.getFormat().toString();
                        });
                    }
                    var deps = getDeps(formats);
                    var baseUri = that.data.root + '/lib/';
                    // for each dependency, prepend baseUri unless it starts with a ! which indicates to ignore it.
                    // check for a requirejs.config that sets a specific path, such as the PDF extension
                    if (deps.sync) {
                        for (var i = 0; i < deps.sync.length; i++) {
                            var dep = deps.sync[i];
                            if (!dep.startsWith('!')) {
                                deps.sync[i] = baseUri + dep;
                            }
                        }
                    }
                    if (deps.async) {
                        for (var i = 0; i < deps.async.length; i++) {
                            var dep = deps.async[i];
                            if (!dep.startsWith('!')) {
                                deps.async[i] = baseUri + dep;
                            }
                        }
                    }
                    cb(deps);
                });
            }
            else {
                cb(null);
            }
        };
        BaseExtension.prototype.loadDependencies = function (deps) {
            var that = this;
            if (!deps) {
                that.dependenciesLoaded();
            }
            else if (deps.sync) {
                // load each sync script.
                // necessary for cases like this: https://github.com/mrdoob/three.js/issues/9602
                // then load the async scripts
                SynchronousRequire_1.SynchronousRequire.load(deps.sync, that.dependencyLoaded).then(function () {
                    if (deps.async) {
                        requirejs(deps.async, function () {
                            that.dependenciesLoaded(arguments);
                        });
                    }
                    else {
                        that.dependenciesLoaded();
                    }
                });
            }
            else if (deps.async) {
                requirejs(deps.async, function () {
                    that.dependenciesLoaded(arguments);
                });
            }
            else {
                that.dependenciesLoaded();
            }
        };
        BaseExtension.prototype.dependencyLoaded = function (index, dep) {
        };
        BaseExtension.prototype.dependenciesLoaded = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.createModules();
            this.modulesCreated();
            $.publish(BaseEvents_1.BaseEvents.RESIZE); // initial sizing
            setTimeout(function () {
                _this.render();
                $.publish(BaseEvents_1.BaseEvents.CREATED);
                _this._setDefaultFocus();
            }, 1);
        };
        BaseExtension.prototype.render = function () {
            if (!this.isCreated || (this.data.collectionIndex !== this.helper.collectionIndex)) {
                $.publish(BaseEvents_1.BaseEvents.COLLECTION_INDEX_CHANGED, [this.data.collectionIndex]);
            }
            if (!this.isCreated || (this.data.manifestIndex !== this.helper.manifestIndex)) {
                $.publish(BaseEvents_1.BaseEvents.MANIFEST_INDEX_CHANGED, [this.data.manifestIndex]);
            }
            if (!this.isCreated || (this.data.sequenceIndex !== this.helper.sequenceIndex)) {
                $.publish(BaseEvents_1.BaseEvents.SEQUENCE_INDEX_CHANGED, [this.data.sequenceIndex]);
            }
            if (!this.isCreated || (this.data.canvasIndex !== this.helper.canvasIndex)) {
                $.publish(BaseEvents_1.BaseEvents.CANVAS_INDEX_CHANGED, [this.data.canvasIndex]);
            }
            if (!this.isCreated || (this.data.rangeId !== this.helper.rangeId)) {
                if (this.data.rangeId) {
                    var range = this.helper.getRangeById(this.data.rangeId);
                    if (range) {
                        $.publish(BaseEvents_1.BaseEvents.RANGE_CHANGED, [range]);
                    }
                    else {
                        console.warn('range id not found:', this.data.rangeId);
                    }
                }
            }
        };
        BaseExtension.prototype._setDefaultFocus = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.data.config.options.allowStealFocus) {
                    $('[tabindex=0]').focus();
                }
            }, 1);
        };
        BaseExtension.prototype.width = function () {
            return this.$element.width();
        };
        BaseExtension.prototype.height = function () {
            return this.$element.height();
        };
        BaseExtension.prototype.exitFullScreen = function () {
            $.publish(BaseEvents_1.BaseEvents.EXIT_FULLSCREEN);
        };
        BaseExtension.prototype.fire = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.component.fire(name, arguments[1]);
        };
        BaseExtension.prototype.redirect = function (uri) {
            this.fire(BaseEvents_1.BaseEvents.REDIRECT, uri);
        };
        BaseExtension.prototype.refresh = function () {
            this.fire(BaseEvents_1.BaseEvents.REFRESH, null);
        };
        BaseExtension.prototype._initLocales = function () {
            var availableLocales = this.data.config.localisation.locales.slice(0);
            var configuredLocales = this.data.locales;
            var finalLocales = [];
            // loop through configuredLocales array (those passed in when initialising the UV component)
            // if availableLocales (those available in each extension's l10n directory) contains a configured locale, add it to finalLocales.
            // if the configured locale has a label, substitute it
            // mark locale as added.
            // if limitLocales is disabled,
            // loop through remaining availableLocales and add to finalLocales.
            if (configuredLocales) {
                configuredLocales.forEach(function (configuredLocale) {
                    var match = availableLocales.filter(function (item) { return item.name === configuredLocale.name; });
                    if (match.length) {
                        var m = match[0];
                        if (configuredLocale.label)
                            m.label = configuredLocale.label;
                        m.added = true;
                        finalLocales.push(m);
                    }
                });
                var limitLocales = Utils.Bools.getBool(this.data.config.options.limitLocales, false);
                if (!limitLocales) {
                    availableLocales.forEach(function (availableLocale) {
                        if (!availableLocale.added) {
                            finalLocales.push(availableLocale);
                        }
                        delete availableLocale.added;
                    });
                }
                this.data.locales = finalLocales;
            }
            else {
                console.warn("No locales configured");
            }
        };
        BaseExtension.prototype._parseMetrics = function () {
            var metrics = this.data.config.options.metrics;
            if (metrics) {
                for (var i = 0; i < metrics.length; i++) {
                    var m = metrics[i];
                    if (typeof (m.type) === "string") {
                        m.type = new MetricType_1.MetricType(m.type);
                    }
                    this.metrics.push(m);
                }
            }
        };
        BaseExtension.prototype._updateMetric = function () {
            var _this = this;
            setTimeout(function () {
                // loop through all metrics
                // find one that matches the current dimensions
                // if a metric is found, and it's not the current metric, set it to be the current metric and publish a METRIC_CHANGED event
                // if no metric is found, set MetricType.NONE to be the current metric and publish a METRIC_CHANGED event
                var metricFound = false;
                for (var i = 0; i < _this.metrics.length; i++) {
                    var metric = _this.metrics[i];
                    // if the current width and height is within this metric's defined range
                    if (_this.width() >= metric.minWidth && _this.width() <= metric.maxWidth &&
                        _this.height() >= metric.minHeight && _this.height() <= metric.maxHeight) {
                        metricFound = true;
                        if (_this.metric !== metric.type) {
                            _this.metric = metric.type;
                            $.publish(BaseEvents_1.BaseEvents.METRIC_CHANGED);
                        }
                    }
                }
                if (!metricFound) {
                    if (_this.metric !== MetricType_1.MetricType.NONE) {
                        _this.metric = MetricType_1.MetricType.NONE;
                        $.publish(BaseEvents_1.BaseEvents.METRIC_CHANGED);
                    }
                }
            }, 1);
        };
        BaseExtension.prototype.resize = function () {
            this._updateMetric();
            $.publish(BaseEvents_1.BaseEvents.RESIZE);
        };
        // re-bootstraps the application with new querystring params
        BaseExtension.prototype.reload = function (data) {
            $.publish(BaseEvents_1.BaseEvents.RELOAD, [data]);
        };
        BaseExtension.prototype.isSeeAlsoEnabled = function () {
            return this.data.config.options.seeAlsoEnabled !== false;
        };
        BaseExtension.prototype.getShareUrl = function () {
            // If not embedded on an external domain (this causes CORS errors when fetching parent url)
            if (!this.data.embedded) {
                // Use the current page URL with hash params
                if (Utils.Documents.isInIFrame()) {
                    return parent.document.location.href;
                }
                else {
                    return document.location.href;
                }
            }
            else {
                // If there's a `related` property of format `text/html` in the manifest
                if (this.helper.hasRelatedPage()) {
                    // Use the `related` property in the URL box
                    var related = this.helper.getRelated();
                    if (related && related.length) {
                        related = related[0];
                    }
                    return related['@id'];
                }
            }
            return null;
        };
        BaseExtension.prototype.getIIIFShareUrl = function () {
            return this.helper.iiifResourceUri + "?manifest=" + this.helper.iiifResourceUri;
        };
        BaseExtension.prototype.addTimestamp = function (uri) {
            return uri + "?t=" + Utils.Dates.getTimeStamp();
        };
        BaseExtension.prototype.getDomain = function () {
            var parts = Utils.Urls.getUrlParts(this.helper.iiifResourceUri);
            return parts.host;
        };
        BaseExtension.prototype.getAppUri = function () {
            var parts = Utils.Urls.getUrlParts(document.location.href);
            var origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            var pathname = parts.pathname;
            if (!pathname.startsWith('/')) {
                pathname = '/' + pathname;
            }
            pathname = pathname.substr(0, pathname.lastIndexOf('/') + 1); // remove the file name
            var appUri = origin + pathname;
            var root = '';
            if (!Utils.Documents.isInIFrame()) {
                root = this.data.root || '';
                if (root.startsWith('./')) {
                    root = root.substr(2);
                }
                if (root && !root.endsWith('/')) {
                    root += '/';
                }
            }
            // if root is a URL, use that instead of appUri.
            if (Utils_1.UVUtils.isValidUrl(root)) {
                return root + 'uv.html';
            }
            return appUri + root + 'uv.html';
        };
        BaseExtension.prototype.getSettings = function () {
            if (Utils.Bools.getBool(this.data.config.options.saveUserSettings, false)) {
                var settings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
                if (settings) {
                    return $.extend(this.data.config.options, settings.value);
                }
            }
            return this.data.config.options;
        };
        BaseExtension.prototype.updateSettings = function (settings) {
            if (Utils.Bools.getBool(this.data.config.options.saveUserSettings, false)) {
                var storedSettings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
                if (storedSettings) {
                    settings = $.extend(storedSettings.value, settings);
                }
                // store for ten years
                Utils.Storage.set("uv.settings", settings, 315360000, Utils.StorageType.local);
            }
            this.data.config.options = $.extend(this.data.config.options, settings);
        };
        BaseExtension.prototype.getLocale = function () {
            return this.helper.options.locale;
        };
        BaseExtension.prototype.getSharePreview = function () {
            var title = this.helper.getLabel();
            // todo: use getThumb (when implemented)
            var canvas = this.helper.getCurrentCanvas();
            var thumbnail = canvas.getProperty('thumbnail');
            if (!thumbnail || !(typeof (thumbnail) === 'string')) {
                thumbnail = canvas.getCanonicalImageUri(this.data.config.options.bookmarkThumbWidth);
            }
            return {
                title: title,
                image: thumbnail
            };
        };
        BaseExtension.prototype.getPagedIndices = function (canvasIndex) {
            if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
            return [canvasIndex];
        };
        BaseExtension.prototype.getCurrentCanvases = function () {
            var indices = this.getPagedIndices(this.helper.canvasIndex);
            var canvases = [];
            for (var i = 0; i < indices.length; i++) {
                var index = indices[i];
                var canvas = this.helper.getCanvasByIndex(index);
                canvases.push(canvas);
            }
            return canvases;
        };
        BaseExtension.prototype.getCanvasLabels = function (label) {
            var indices = this.getPagedIndices();
            var labels = "";
            if (indices.length === 1) {
                labels = label;
            }
            else {
                for (var i = 1; i <= indices.length; i++) {
                    if (labels.length)
                        labels += ",";
                    labels += label + " " + i;
                }
            }
            return labels;
        };
        BaseExtension.prototype.getCurrentCanvasRange = function () {
            //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
            //var range: Manifesto.IRange = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
            var range = this.helper.getCanvasRange(this.helper.getCurrentCanvas());
            return range;
        };
        // todo: move to manifold?
        BaseExtension.prototype.getExternalResources = function (resources) {
            var _this = this;
            var indices = this.getPagedIndices();
            var resourcesToLoad = [];
            indices.forEach(function (index) {
                var canvas = _this.helper.getCanvasByIndex(index);
                var r;
                if (!canvas.externalResource) {
                    r = new Manifold.ExternalResource(canvas, {
                        authApiVersion: _this.data.config.options.authAPIVersion
                    });
                }
                else {
                    r = canvas.externalResource;
                }
                // reload resources if passed
                if (resources) {
                    var found = resources.find(function (f) {
                        return f.dataUri === r.dataUri;
                    });
                    if (found) {
                        resourcesToLoad.push(found);
                    }
                    else {
                        resourcesToLoad.push(r);
                    }
                }
                else {
                    resourcesToLoad.push(r);
                }
            });
            var storageStrategy = this.data.config.options.tokenStorage;
            var authAPIVersion = this.data.config.options.authAPIVersion;
            // if using auth api v1
            if (authAPIVersion === 1) {
                return new Promise(function (resolve) {
                    var options = {
                        locale: _this.helper.options.locale
                    };
                    Auth1_1.Auth1.loadExternalResources(resourcesToLoad, storageStrategy, options).then(function (r) {
                        _this.resources = r.map(function (resource) {
                            return _this._prepareResourceData(resource);
                        });
                        resolve(_this.resources);
                    });
                });
            }
            else {
                return new Promise(function (resolve) {
                    Auth09_1.Auth09.loadExternalResources(resourcesToLoad, storageStrategy).then(function (r) {
                        _this.resources = r.map(function (resource) {
                            return _this._prepareResourceData(resource);
                        });
                        resolve(_this.resources);
                    });
                });
            }
        };
        // copy useful properties over to the data object to be opened in center panel's openMedia method
        // this is the info.json if there is one, which can be opened natively by openseadragon.
        BaseExtension.prototype._prepareResourceData = function (resource) {
            resource.data.hasServiceDescriptor = resource.hasServiceDescriptor();
            // if the data isn't an info.json, give it the necessary viewing properties
            if (!resource.hasServiceDescriptor()) {
                resource.data.id = resource.dataUri;
                resource.data.width = resource.width;
                resource.data.height = resource.height;
            }
            resource.data.index = resource.index;
            return Utils.Objects.toPlainObject(resource.data);
        };
        BaseExtension.prototype.getMediaFormats = function (canvas) {
            var annotations = canvas.getContent();
            if (annotations && annotations.length) {
                var annotation = annotations[0];
                return annotation.getBody();
            }
            else {
                // legacy IxIF compatibility
                var body = {
                    id: canvas.id,
                    type: canvas.getType(),
                    getFormat: function () {
                        return '';
                    }
                };
                return [body];
            }
        };
        BaseExtension.prototype.viewCanvas = function (canvasIndex) {
            if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
                this.showMessage(this.data.config.content.canvasIndexOutOfRange);
                return;
            }
            $.publish(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE);
        };
        BaseExtension.prototype.showMessage = function (message, acceptCallback, buttonText, allowClose) {
            this.closeActiveDialogue();
            $.publish(BaseEvents_1.BaseEvents.SHOW_GENERIC_DIALOGUE, [
                {
                    message: message,
                    acceptCallback: acceptCallback,
                    buttonText: buttonText,
                    allowClose: allowClose
                }
            ]);
        };
        BaseExtension.prototype.closeActiveDialogue = function () {
            $.publish(BaseEvents_1.BaseEvents.CLOSE_ACTIVE_DIALOGUE);
        };
        BaseExtension.prototype.isOverlayActive = function () {
            return Shell_1.Shell.$overlays.is(':visible');
        };
        BaseExtension.prototype.isDesktopMetric = function () {
            return this.metric.toString() === MetricType_1.MetricType.DESKTOP.toString();
        };
        BaseExtension.prototype.isWatchMetric = function () {
            return this.metric.toString() === MetricType_1.MetricType.WATCH.toString();
        };
        BaseExtension.prototype.isCatchAllMetric = function () {
            return this.metric.toString() === MetricType_1.MetricType.NONE.toString();
        };
        // todo: use redux in manifold to get reset state
        BaseExtension.prototype.viewManifest = function (manifest) {
            var data = {};
            data.iiifResourceUri = this.helper.iiifResourceUri;
            data.collectionIndex = this.helper.getCollectionIndex(manifest) || 0;
            data.manifestIndex = manifest.index;
            data.sequenceIndex = 0;
            data.canvasIndex = 0;
            this.reload(data);
        };
        // todo: use redux in manifold to get reset state
        BaseExtension.prototype.viewCollection = function (collection) {
            var data = {};
            data.iiifResourceUri = this.helper.iiifResourceUri;
            data.collectionIndex = collection.index;
            data.manifestIndex = 0;
            data.sequenceIndex = 0;
            data.canvasIndex = 0;
            this.reload(data);
        };
        BaseExtension.prototype.isFullScreen = function () {
            return this.component.isFullScreen;
        };
        BaseExtension.prototype.isHeaderPanelEnabled = function () {
            return Utils.Bools.getBool(this.data.config.options.headerPanelEnabled, true);
        };
        BaseExtension.prototype.isLeftPanelEnabled = function () {
            if (Utils.Bools.getBool(this.data.config.options.leftPanelEnabled, true)) {
                if (this.helper.hasParentCollection()) {
                    return true;
                }
                else if (this.helper.isMultiCanvas()) {
                    var viewingHint = this.helper.getViewingHint();
                    if (!viewingHint || (viewingHint && viewingHint.toString() !== manifesto.ViewingHint.continuous().toString())) {
                        return true;
                    }
                }
            }
            return false;
        };
        BaseExtension.prototype.isRightPanelEnabled = function () {
            return Utils.Bools.getBool(this.data.config.options.rightPanelEnabled, true);
        };
        BaseExtension.prototype.isFooterPanelEnabled = function () {
            return Utils.Bools.getBool(this.data.config.options.footerPanelEnabled, true);
        };
        BaseExtension.prototype.isMobile = function () {
            return $.browser.mobile;
        };
        BaseExtension.prototype.useArrowKeysToNavigate = function () {
            return Utils.Bools.getBool(this.data.config.options.useArrowKeysToNavigate, true);
        };
        BaseExtension.prototype.bookmark = function () {
            // override for each extension
        };
        BaseExtension.prototype.feedback = function () {
            this.fire(BaseEvents_1.BaseEvents.FEEDBACK, this.data);
        };
        BaseExtension.prototype.getAlternateLocale = function () {
            var alternateLocale = null;
            if (this.data.locales && this.data.locales.length > 1) {
                alternateLocale = this.data.locales[1];
            }
            return alternateLocale;
        };
        BaseExtension.prototype.getSerializedLocales = function () {
            if (this.data.locales) {
                return this.serializeLocales(this.data.locales);
            }
            return null;
        };
        BaseExtension.prototype.serializeLocales = function (locales) {
            var serializedLocales = '';
            for (var i = 0; i < locales.length; i++) {
                var l = locales[i];
                if (i > 0)
                    serializedLocales += ',';
                serializedLocales += l.name;
                if (l.label) {
                    serializedLocales += ':' + l.label;
                }
            }
            return serializedLocales;
        };
        BaseExtension.prototype.changeLocale = function (locale) {
            // re-order locales so the passed locale is first
            var data = {};
            if (this.data.locales) {
                data.locales = this.data.locales.slice(0);
                var fromIndex = data.locales.findIndex(function (l) {
                    return l.name === locale;
                });
                var toIndex = 0;
                data.locales.splice(toIndex, 0, data.locales.splice(fromIndex, 1)[0]);
                this.reload(data);
            }
        };
        return BaseExtension;
    }());
    exports.BaseExtension = BaseExtension;
});
