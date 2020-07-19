"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var i18next_1 = __importDefault(require("i18next"));
exports.Help = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Help);
    },
    handle: function (handlerInput) {
        var speechText = i18next_1.default.t(constants_1.Strings.HELP_MSG);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(i18next_1.default.t(constants_1.Strings.SKILL_NAME), speechText)
            .getResponse();
    },
};
//# sourceMappingURL=Help.js.map