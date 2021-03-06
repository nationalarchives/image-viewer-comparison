define(["require", "exports", "./BaseEvents", "./Information", "./InformationAction", "./InformationType"], function (require, exports, BaseEvents_1, Information_1, InformationAction_1, InformationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InformationFactory = /** @class */ (function () {
        function InformationFactory(extension) {
            this.extension = extension;
        }
        InformationFactory.prototype.Get = function (args) {
            switch (args.informationType) {
                case (InformationType_1.InformationType.AUTH_CORS_ERROR):
                    return new Information_1.Information(this.extension.data.config.content.authCORSError, []);
                case (InformationType_1.InformationType.DEGRADED_RESOURCE):
                    var actions = [];
                    var loginAction = new InformationAction_1.InformationAction();
                    var label = args.param.loginService.getConfirmLabel();
                    if (!label) {
                        label = this.extension.data.config.content.fallbackDegradedLabel;
                    }
                    loginAction.label = label;
                    var resource_1 = args.param;
                    loginAction.action = function () {
                        resource_1.authHoldingPage = window.open("", "_blank");
                        $.publish(BaseEvents_1.BaseEvents.HIDE_INFORMATION);
                        $.publish(BaseEvents_1.BaseEvents.OPEN_EXTERNAL_RESOURCE, [[resource_1]]);
                    };
                    actions.push(loginAction);
                    var message = args.param.loginService.getServiceLabel();
                    if (!message) {
                        message = this.extension.data.config.content.fallbackDegradedMessage;
                    }
                    return new Information_1.Information(message, actions);
            }
        };
        return InformationFactory;
    }());
    exports.InformationFactory = InformationFactory;
});
