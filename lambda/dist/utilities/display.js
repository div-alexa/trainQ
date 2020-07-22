"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsDisplay = void 0;
// スキルが画面付きデバイスで動作している時は true を返す。
function supportsDisplay(handlerInput) {
    var hasDisplay = handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'];
    console.log(hasDisplay);
    return hasDisplay;
}
exports.supportsDisplay = supportsDisplay;
//# sourceMappingURL=display.js.map