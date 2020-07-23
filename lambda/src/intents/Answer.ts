import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes } from '../utilities/constants';
import { handleUserGuess } from '../utilities/handle';

export const Answer: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Answer);
	},
	handle(handlerInput: HandlerInput) {
		if (handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent') {
			return handleUserGuess(false, handlerInput);
		}
		return handleUserGuess(true, handlerInput);
	},
};