"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repeat = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
exports.Repeat = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Repeat);
    },
    handle: function (handlerInput) {
        return handlerInput.responseBuilder
            .speak(RequestInterceptor_1.session.speechOutput)
            .reprompt(RequestInterceptor_1.session.repromptText)
            .getResponse();
    },
};
//# sourceMappingURL=Repeat.js.map