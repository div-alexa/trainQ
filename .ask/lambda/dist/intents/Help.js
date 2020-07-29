"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
var i18next_1 = __importDefault(require("i18next"));
exports.Help = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Help);
    },
    handle: function (handlerInput) {
        var askMessage = RequestInterceptor_1.session.questions
            ? i18next_1.default.t(constants_1.Strings.HELP_GOING_MSG)
            : i18next_1.default.t(constants_1.Strings.HELP_START_MSG);
        var speechOutput = i18next_1.default.t(constants_1.Strings.HELP_MSG) + askMessage;
        var repromptText = askMessage;
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptText)
            .getResponse();
        // const newGame = !(sessionAttributes.questions);
        // return helpTheUser(newGame, handlerInput);
    },
};
//# sourceMappingURL=Help.js.map