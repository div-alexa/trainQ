import { HandlerInput } from 'ask-sdk-core';
import { storage, session } from '../interceptors/RequestInterceptor';

// Attributesの保存は、handlerが呼ばれたあとの共通処理で実装(=ResponseInterceptorss)
export const ResponseInterceptor = {
	async process(handlerInput: HandlerInput): Promise<void> {
		storage.visit = '1';
		console.log(storage);
		const { attributesManager } = handlerInput;
		await attributesManager.savePersistentAttributes();
		attributesManager.setSessionAttributes(session);
	},
};
