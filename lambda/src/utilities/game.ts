import { ErrorHandler, HandlerInput } from 'ask-sdk-core';
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
import * as cons from '../utilities/constants';
import i18n from 'i18next';

function populateGameQuestions(translatedQuestions) {
	const gameQuestions = [];
	const indexList = [];
	let index = translatedQuestions.length;
	if (cons.GAME_LENGTH > index) {
		throw new Error('Invalid Game Length.');
	}

	for (let i = 0; i < translatedQuestions.length; i += 1) {
		indexList.push(i);
	}

	for (let j = 0; j < cons.GAME_LENGTH; j += 1) {
		const rand = Math.floor(Math.random() * index);
		index -= 1;

		const temp: unknown = indexList[index];
		indexList[index] = indexList[rand];
		indexList[rand] = temp;
		gameQuestions.push(indexList[index]);
	}
	return gameQuestions;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function startGame(newGame: any, handlerInput: HandlerInput) {
	const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
	const attributes = handlerInput.attributesManager.getSessionAttributes();
	let speechOutput = newGame
		? i18n.t(cons.Strings.NEW_GAME_MSG, { skillName: 'テスト' }) +
		  i18n.t(cons.Strings.WELCOME_MSG, { num: cons.GAME_LENGTH })
		: '';

	return handlerInput.responseBuilder
		.speak(speechOutput)
		.reprompt(speechOutput)
		.withSimpleCard(i18n.t(cons.Strings.SKILL_NAME), speechOutput)
		.getResponse();

	let translatedQuestions;
	//セッションアトリビュートの値で出題するクイズを切り替え
	switch (attributes.quizName) {
		case 'localBeer':
			translatedQuestions = requestAttributes.t('QUESTIONS_LB');
			break;
		case 'cocktail':
			translatedQuestions = requestAttributes.t('QUESTIONS_CT');
			break;
		default:
			translatedQuestions = requestAttributes.t('QUESTIONS');
	}
	const gameQuestions = populateGameQuestions(translatedQuestions);
	const correctAnswerIndex = Math.floor(Math.random() * ANSWER_COUNT);

	const roundAnswersList = populateRoundAnswers(
		gameQuestions,
		0,
		correctAnswerIndex,
		translatedQuestions
	);
	const roundAnswers = roundAnswersList[0];
	const roundAnswersDisp = roundAnswersList[1];
	const currentQuestionIndex = 0;
	const spokenQuestion = Object.keys(
		translatedQuestions[gameQuestions[currentQuestionIndex]]
	)[0];
	const displayQuestion = Object.keys(
		translatedQuestions[gameQuestions[currentQuestionIndex]]
	)[1];
	// 第x門、ジャジャンまで含める。
	speechOutput += requestAttributes.t(
		'TELL_QUESTION_MESSAGE',
		'1',
		questionSnd
	);
	let repromptText = spokenQuestion + '<break time="2s"/>';
	let displayText = requestAttributes.t(
		'DISPLAY_QUESTION_MESSAGE',
		'1',
		displayQuestion
	);
	for (let i = 0; i < ANSWER_COUNT; i += 1) {
		repromptText += `${i + 1}番、 ${roundAnswers[i]}。<break time="1s"/>`;
		displayText += `<br>${i + 1}番：${roundAnswersDisp[i]} `;
	}
	repromptText += '答えは何番でしょう';

	const sessionAttributes = {};

	const translatedQuestion =
		translatedQuestions[gameQuestions[currentQuestionIndex]];

	Object.assign(sessionAttributes, {
		speechOutput: repromptText,
		repromptText,
		currentQuestionIndex,
		correctAnswerIndex: correctAnswerIndex + 1,
		questions: gameQuestions,
		score: 0,
		correctAnswerText:
			translatedQuestion[Object.keys(translatedQuestion)[1]][0],
		entitledProducts: attributes.entitledProducts,
		quizName: attributes.quizName,
		answerRecord: [],
	});

	handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

	// レスポンスの生成
	let builder = handlerInput.responseBuilder.withShouldEndSession(false);
	console.log('supportDisplay:' + supportsDisplay(handlerInput));
	if (supportsDisplay(handlerInput)) {
		// device has display
		const aplSample = require('./apl_template_export.json');
		//  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult =
			'鉄道クイズ';
		aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml =
			'<speak>' + repromptText + '</speak>';
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplay = displayText;
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
		speechOutput += repromptText;
	}

	return (
		builder
			.speak(speechOutput)
			.reprompt(repromptText)
			//    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
			.getResponse()
	);
}
