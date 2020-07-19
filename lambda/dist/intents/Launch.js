"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Launch = void 0;
var constants_1 = require("../utilities/constants");
var helpers_1 = require("../utilities/helpers");
var i18next_1 = __importDefault(require("i18next"));
exports.Launch = {
    canHandle: function (handlerInput) {
        return helpers_1.IsType(handlerInput, constants_1.RequestTypes.Launch);
    },
    handle: function (handlerInput) {
        var speechText = i18next_1.default.t(constants_1.Strings.WELCOME_MSG);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(i18next_1.default.t(constants_1.Strings.SKILL_NAME), speechText)
            .getResponse();
    },
};
//# sourceMappingURL=Launch.js.map