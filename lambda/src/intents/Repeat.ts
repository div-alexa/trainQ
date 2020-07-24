import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes } from '../utilities/constants';
import { session } from '../interceptors/RequestInterceptor';

export const Repeat: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Repeat);
	},
	handle(handlerInput: HandlerInput) {
		return handlerInput.responseBuilder
			.speak(session.speechOutput)
			.reprompt(session.repromptText)
			.getResponse();
	},
};
