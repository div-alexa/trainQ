"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Launch = void 0;
var constants_1 = require("../utilities/constants");
var helpers_1 = require("../utilities/helpers");
var game_1 = require("../utilities/game");
exports.Launch = {
    canHandle: function (handlerInput) {
        return helpers_1.IsType(handlerInput, constants_1.RequestTypes.Launch);
    },
    handle: function (handlerInput) {
        //const speechText = i18n.t(Strings.WELCOME_MSG);
        return game_1.startGame(true, handlerInput);
        /*
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(i18n.t(Strings.SKILL_NAME), speechText)
      .getResponse();
      */
    },
};
//# sourceMappingURL=Launch.js.map