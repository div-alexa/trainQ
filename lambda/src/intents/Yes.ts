import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes, Strings } from '../utilities/constants';
import { session } from '../interceptors/RequestInterceptor';
import i18n from 'i18next';

export const Yes: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Yes);
	},
	handle(handlerInput: HandlerInput) {
		const speechText = i18n.t(Strings.UNHANDLE_MSG);
		const repromptText = i18n.t(Strings.ONE_MORE_MSG);

		if (session.questions) {
			return handlerInput.responseBuilder
				.speak(session.speechOutput)
				.reprompt(session.repromptText)
				.getResponse();
		} else {
			return handlerInput.responseBuilder
				.speak(speechText + repromptText)
				.reprompt(repromptText)
				.getResponse();
		}
	},
};
