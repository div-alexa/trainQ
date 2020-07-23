import { HandlerInput } from 'ask-sdk-core';

// スキルが画面付きデバイスで動作している時は true を返す。
export function supportsDisplay(handlerInput: HandlerInput): boolean {
	const hasDisplay =
		handlerInput.requestEnvelope.context &&
		handlerInput.requestEnvelope.context.System &&
		handlerInput.requestEnvelope.context.System.device &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
			'Alexa.Presentation.APL'
		];
	return !!hasDisplay;
}
