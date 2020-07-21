"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorProcessor = void 0;
var constants_1 = require("../utilities/constants");
var i18next_1 = __importDefault(require("i18next"));
/**
 * Handles ErrorTypes.Unexpected errors which should be thrown when something
 * unexpected happens.
 */
exports.ErrorProcessor = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canHandle: function (handlerInput, error) {
        return true;
    },
    handle: function (handlerInput, error) {
        console.log("Error handled: " + error.message);
        return handlerInput.responseBuilder
            .speak(i18next_1.default.t(constants_1.Strings.ERROR_MSG))
            .getResponse();
    },
};
//# sourceMappingURL=ErrorProcessor.js.map