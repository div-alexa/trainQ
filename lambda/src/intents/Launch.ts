import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { RequestTypes } from '../utilities/constants';
import { IsType } from '../utilities/helpers';
import { startGame } from '../utilities/game';

export const Launch: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsType(handlerInput, RequestTypes.Launch);
	},
	handle(handlerInput: HandlerInput) {
		//const speechText = i18n.t(Strings.WELCOME_MSG);
		return startGame(true, handlerInput);

		/*
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard(i18n.t(Strings.SKILL_NAME), speechText)
      .getResponse();
      */
	},
};
