import { HandlerInput } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';

export let storage: any;
export let session: any;

// PersistentAttributesとSessionAttributesはHandlerが処理される前に必ずあるようにしたいので、
// Interceptor に実装
export const RequestInterceptor = {
	async process(handlerInput: HandlerInput): Promise<void> {
		console.log((handlerInput.requestEnvelope.request as IntentRequest).intent);
		const { attributesManager } = handlerInput;
		try {
			storage = (await attributesManager.getPersistentAttributes()) || {};
		} catch (e) {
			storage = {};
		}
		// eslint-disable-next-line prefer-const
		session = attributesManager.getSessionAttributes();

		try {
			if (Object.keys(session).length === 0) {
				attributesManager.setSessionAttributes(session);
			}
		} catch (error) {
			console.log(error);
			attributesManager.setSessionAttributes(session);
		}
	},
};
