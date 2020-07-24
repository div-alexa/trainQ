import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes } from '../utilities/constants';
import { handleUserGuess } from '../utilities/handle';
import * as Model from 'ask-sdk-model';

export const Answer: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Answer);
	},
	handle(handlerInput: HandlerInput) {
		const name = (handlerInput.requestEnvelope.request as Model.IntentRequest)
			.intent.name;
		if (name === 'AnswerIntent') {
			return handleUserGuess(false, handlerInput);
		}
		return handleUserGuess(true, handlerInput);
	},
};
