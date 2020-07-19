"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsType = exports.IsIntent = void 0;
var constants_1 = require("./constants");
/**
 * Checks if the request matches any of the given intents.
 *
 * @param handlerInput
 * @param intents
 */
function IsIntent(handlerInput) {
    var intents = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        intents[_i - 1] = arguments[_i];
    }
    if (handlerInput.requestEnvelope.request.type === constants_1.RequestTypes.Intent) {
        for (var i = 0; i < intents.length; i++) {
            if (handlerInput.requestEnvelope.request.intent.name === intents[i]) {
                return true;
            }
        }
    }
    return false;
}
exports.IsIntent = IsIntent;
/**
 * Checks if the request matches any of the given types.
 *
 * @param handlerInput
 * @param types
 */
function IsType(handlerInput) {
    var types = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < types.length; i++) {
        if (handlerInput.requestEnvelope.request.type === types[i]) {
            return true;
        }
    }
    return false;
}
exports.IsType = IsType;
//# sourceMappingURL=helpers.js.map