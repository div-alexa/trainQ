import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes, Strings } from '../utilities/constants';
import { session } from '../interceptors/RequestInterceptor';
import i18n from 'i18next';

export const Help: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Help);
	},
	handle(handlerInput: HandlerInput) {
		const askMessage = session.questions
			? i18n.t(Strings.HELP_GOING_MSG)
			: i18n.t(Strings.HELP_START_MSG);
		const speechOutput = i18n.t(Strings.HELP_MSG) + askMessage;
		const repromptText = askMessage;

		return handlerInput.responseBuilder
			.speak(speechOutput)
			.reprompt(repromptText)
			.getResponse();

		// const newGame = !(sessionAttributes.questions);
		// return helpTheUser(newGame, handlerInput);
	},
};
