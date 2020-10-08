import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsIntent } from '../utilities/helpers';
import { IntentTypes, Strings } from '../utilities/constants';
import { session } from '../interceptors/RequestInterceptor';
import { supportsDisplay } from '../utilities/display';
import apltemplate from '..//utilities/apl_template_export2.json';
import i18n from 'i18next';

export const Yes: RequestHandler = {
	canHandle(handlerInput: HandlerInput) {
		return IsIntent(handlerInput, IntentTypes.Yes);
	},
	handle(handlerInput: HandlerInput) {
		const speechText = i18n.t(Strings.UNHANDLE_MSG);
		const repromptText = i18n.t(Strings.ONE_MORE_MSG);

		if (session.questions) {
			// レスポンスの生成
			const builder = handlerInput.responseBuilder.withShouldEndSession(false);
			console.log('supportDisplay:' + supportsDisplay(handlerInput));
			if (supportsDisplay(handlerInput)) {
				// device has display
				const aplSample = apltemplate;
				//  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
				aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml =
					'<speak></speak>';
				aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplay =
					session.displayText;
				aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplayChoice =
					session.displayChoice;
				console.log(
					'speak:' +
						aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml
				);
				builder
					.addDirective({
						type: 'Alexa.Presentation.APL.RenderDocument',
						version: '1.0',
						token: 'token',
						document: aplSample.document,
						datasources: aplSample.datasources,
					})
					.addDirective({
						type: 'Alexa.Presentation.APL.ExecuteCommands',
						token: 'token',
						commands: [
							{
								type: 'SpeakItem',
								componentId: 'trainQuiz',
							},
						],
					});
			} else {
				return handlerInput.responseBuilder
					.speak(session.speechOutput)
					.reprompt(session.repromptText)
					.getResponse();
			}
			return builder
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
