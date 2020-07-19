"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fallback = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var i18next_1 = __importDefault(require("i18next"));
exports.Fallback = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Fallback);
    },
    handle: function (handlerInput) {
        var speechText = i18next_1.default.t(constants_1.Strings.ERROR_MSG);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(i18next_1.default.t(constants_1.Strings.HELP_MSG))
            .getResponse();
    },
};
//# sourceMappingURL=Fallback.js.map