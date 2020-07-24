"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yes = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
var i18next_1 = __importDefault(require("i18next"));
exports.Yes = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Yes);
    },
    handle: function (handlerInput) {
        var speechText = i18next_1.default.t(constants_1.Strings.UNHANDLE_MSG);
        var repromptText = i18next_1.default.t(constants_1.Strings.ONE_MORE_MSG);
        if (RequestInterceptor_1.session.questions) {
            return handlerInput.responseBuilder
                .speak(RequestInterceptor_1.session.speechOutput)
                .reprompt(RequestInterceptor_1.session.repromptText)
                .getResponse();
        }
        else {
            return handlerInput.responseBuilder
                .speak(speechText + repromptText)
                .reprompt(repromptText)
                .getResponse();
        }
    },
};
//# sourceMappingURL=Yes.js.map