define(["require", "exports", "./BaseEvents", "./InformationArgs", "./InformationType", "./LoginWarningMessages"], function (require, exports, BaseEvents_1, InformationArgs_1, InformationType_1, LoginWarningMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Auth09 = /** @class */ (function () {
        function Auth09() {
        }
        Auth09.loadExternalResources = function (resourcesToLoad, storageStrategy) {
            return new Promise(function (resolve) {
                manifesto.Utils.loadExternalResourcesAuth09(resourcesToLoad, storageStrategy, Auth09.clickThrough, Auth09.restricted, Auth09.login, Auth09.getAccessToken, Auth09.storeAccessToken, Auth09.getStoredAccessToken, Auth09.handleExternalResourceResponse).then(function (r) {
                    resolve(r);
                })['catch'](function (error) {
                    switch (error.name) {
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseEvents_1.BaseEvents.LOGIN_FAILED);
                            break;
                        case manifesto.StatusCodes.FORBIDDEN.toString():
                            $.publish(BaseEvents_1.BaseEvents.FORBIDDEN);
                            break;
                        case manifesto.StatusCodes.RESTRICTED.toString():
                            // do nothing
                            break;
                        default:
                            $.publish(BaseEvents_1.BaseEvents.SHOW_MESSAGE, [error.message || error]);
                    }
                });
            });
        };
        Auth09.clickThrough = function (resource) {
            return new Promise(function (resolve) {
                $.publish(BaseEvents_1.BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE, [{
                        resource: resource,
                        acceptCallback: function () {
                            if (resource.clickThroughService) {
                                var win_1 = window.open(resource.clickThroughService.id);
                                var pollTimer_1 = window.setInterval(function () {
                                    if (win_1 && win_1.closed) {
                                        window.clearInterval(pollTimer_1);
                                        $.publish(BaseEvents_1.BaseEvents.CLICKTHROUGH);
                                        resolve();
                                    }
                                }, 500);
                            }
                        }
                    }]);
            });
        };
        Auth09.restricted = function (resource) {
            return new Promise(function (resolve, reject) {
                $.publish(BaseEvents_1.BaseEvents.SHOW_RESTRICTED_DIALOGUE, [{
                        resource: resource,
                        acceptCallback: function () {
                            $.publish(BaseEvents_1.BaseEvents.LOAD_FAILED);
                            reject(resource);
                        }
                    }]);
            });
        };
        Auth09.login = function (resource) {
            return new Promise(function (resolve) {
                var options = {};
                if (resource.status === HTTPStatusCode.FORBIDDEN) {
                    options.warningMessage = LoginWarningMessages_1.LoginWarningMessages.FORBIDDEN;
                    options.showCancelButton = true;
                }
                $.publish(BaseEvents_1.BaseEvents.SHOW_LOGIN_DIALOGUE, [{
                        resource: resource,
                        loginCallback: function () {
                            if (resource.loginService) {
                                var win_2 = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                                var pollTimer_2 = window.setInterval(function () {
                                    if (win_2 && win_2.closed) {
                                        window.clearInterval(pollTimer_2);
                                        $.publish(BaseEvents_1.BaseEvents.LOGIN);
                                        resolve();
                                    }
                                }, 500);
                            }
                        },
                        logoutCallback: function () {
                            if (resource.logoutService) {
                                var win_3 = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                                var pollTimer_3 = window.setInterval(function () {
                                    if (win_3 && win_3.closed) {
                                        window.clearInterval(pollTimer_3);
                                        $.publish(BaseEvents_1.BaseEvents.LOGOUT);
                                        resolve();
                                    }
                                }, 500);
                            }
                        },
                        options: options
                    }]);
            });
        };
        Auth09.getAccessToken = function (resource, rejectOnError) {
            return new Promise(function (resolve, reject) {
                if (resource.tokenService) {
                    var serviceUri = resource.tokenService.id;
                    // pick an identifier for this message. We might want to keep track of sent messages
                    var msgId = serviceUri + "|" + new Date().getTime();
                    var receiveAccessToken_1 = function (e) {
                        window.removeEventListener("message", receiveAccessToken_1);
                        var token = e.data;
                        if (token.error) {
                            if (rejectOnError) {
                                reject(token.errorDescription);
                            }
                            else {
                                resolve(undefined);
                            }
                        }
                        else {
                            resolve(token);
                        }
                    };
                    window.addEventListener("message", receiveAccessToken_1, false);
                    var tokenUri = serviceUri + "?messageId=" + msgId;
                    $('#commsFrame').prop('src', tokenUri);
                }
                else {
                    reject('Token service not found');
                }
            });
        };
        Auth09.storeAccessToken = function (resource, token, storageStrategy) {
            return new Promise(function (resolve, reject) {
                if (resource.tokenService) {
                    Utils.Storage.set(resource.tokenService.id, token, token.expiresIn, new Utils.StorageType(storageStrategy));
                    resolve();
                }
                else {
                    reject('Token service not found');
                }
            });
        };
        Auth09.getStoredAccessToken = function (resource, storageStrategy) {
            return new Promise(function (resolve, reject) {
                var foundItems = [];
                var item = null;
                // try to match on the tokenService, if the resource has one:
                if (resource.tokenService) {
                    item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
                }
                if (item) {
                    foundItems.push(item);
                }
                else {
                    // find an access token for the domain
                    var domain = Utils.Urls.getUrlParts(resource.dataUri).hostname;
                    var items = Utils.Storage.getItems(new Utils.StorageType(storageStrategy));
                    for (var i = 0; i < items.length; i++) {
                        item = items[i];
                        if (item.key.includes(domain)) {
                            foundItems.push(item);
                        }
                    }
                }
                // sort by expiresAt, earliest to most recent.
                foundItems = foundItems.sort(function (a, b) {
                    return a.expiresAt - b.expiresAt;
                });
                var foundToken;
                if (foundItems.length) {
                    foundToken = foundItems[foundItems.length - 1].value;
                }
                resolve(foundToken);
            });
        };
        Auth09.handleExternalResourceResponse = function (resource) {
            return new Promise(function (resolve, reject) {
                resource.isResponseHandled = true;
                if (resource.status === HTTPStatusCode.OK) {
                    resolve(resource);
                }
                else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                    resolve(resource);
                    $.publish(BaseEvents_1.BaseEvents.RESOURCE_DEGRADED, [resource]);
                }
                else {
                    if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                        resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                        // if the browser doesn't support CORS
                        if (!Modernizr.cors) {
                            var informationArgs = new InformationArgs_1.InformationArgs(InformationType_1.InformationType.AUTH_CORS_ERROR, null);
                            $.publish(BaseEvents_1.BaseEvents.SHOW_INFORMATION, [informationArgs]);
                            resolve(resource);
                        }
                        else {
                            reject(resource.error.statusText);
                        }
                    }
                    else if (resource.error.status === HTTPStatusCode.FORBIDDEN) {
                        var error = new Error();
                        error.message = "Forbidden";
                        error.name = manifesto.StatusCodes.FORBIDDEN.toString();
                        reject(error);
                    }
                    else {
                        reject(resource.error.statusText);
                    }
                }
            });
        };
        Auth09.handleDegraded = function (resource) {
            var informationArgs = new InformationArgs_1.InformationArgs(InformationType_1.InformationType.DEGRADED_RESOURCE, resource);
            $.publish(BaseEvents_1.BaseEvents.SHOW_INFORMATION, [informationArgs]);
        };
        return Auth09;
    }());
    exports.Auth09 = Auth09;
});
