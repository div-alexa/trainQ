import * as Alexa from 'ask-sdk-core';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import express from 'express';
import { Launch } from './intents/Launch';
import { Help } from './intents/Help';
import { Stop } from './intents/Stop';
import { Reflector } from './intents/Reflector';
import { Fallback } from './intents/Fallback';
import { HelloWorld } from './intents/HelloWorld';
import { ErrorProcessor } from './errors/ErrorProcessor';
import { SessionEnded } from './intents/SessionEnded';
import { LocalizationRequestInterceptor } from './interceptors/LocalizationRequestInterceptor';
import { RequestEnvelope } from 'ask-sdk-model';
import { RequestInterceptor } from './interceptors/RequestInterceptor';
import { ResponseInterceptor } from './interceptors/ResponseInterceptor';
import * as ddbAdapter from 'ask-sdk-dynamodb-persistence-adapter';

const tableName = 'trainQ-db';

function getPersistenceAdapter(tableName: string) {
	// Not in Alexa Hosted Environment
	return new ddbAdapter.DynamoDbPersistenceAdapter({
		tableName: tableName,
		createTable: true,
	});
}

let	skill = Alexa.SkillBuilders.custom()
		.addRequestHandlers(
			// Default intents
			Launch,
			Help,
			Stop,
			SessionEnded,
			Reflector,
			Fallback
		)
		.addErrorHandlers(ErrorProcessor)
		.addRequestInterceptors(LocalizationRequestInterceptor, RequestInterceptor)
		.addResponseInterceptors(ResponseInterceptor)
		.withPersistenceAdapter(getPersistenceAdapter(tableName))
		.withApiClient(new Alexa.DefaultApiClient())
		.create();

exports.handler = async (event: RequestEnvelope, context: any) => {
	const response = await skill.invoke(event, context);
	return response;
};

  //////////////////////////////// App ////////////////////////////////

// サーバー情報
const PORT = 3000;
const ENDPOINT = '/';

const adapter = new ExpressAdapter(skill, false, false);
express().post(ENDPOINT, adapter.getRequestHandlers()).listen(PORT);

console.log('start!');
