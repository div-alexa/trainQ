"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
var helpers_1 = require("../utilities/helpers");
var constants_1 = require("../utilities/constants");
var handle_1 = require("../utilities/handle");
exports.Answer = {
    canHandle: function (handlerInput) {
        return helpers_1.IsIntent(handlerInput, constants_1.IntentTypes.Answer);
    },
    handle: function (handlerInput) {
        if (handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent') {
            return handle_1.handleUserGuess(false, handlerInput);
        }
        return handle_1.handleUserGuess(true, handlerInput);
    },
};
//# sourceMappingURL=Answer.js.map