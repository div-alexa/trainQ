import { HandlerInput } from 'ask-sdk-core';
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
import * as cons from '../utilities/constants';
import i18n from 'i18next';
import { supportsDisplay } from './display';

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

function populateRoundAnswers(
	gameQuestionIndexes,
	currentQuestionIndex,
	correctAnswerTargetLocation,
	translatedQuestions
) {
	const answers = [];
	const answersDisp = [];
	const translatedQuestion =
		translatedQuestions[gameQuestionIndexes[currentQuestionIndex]];
	const answersCopy = translatedQuestion[
		Object.keys(translatedQuestion)[0]
	].slice();
	const answersCopyDisp = translatedQuestion[
		Object.keys(translatedQuestion)[1]
	].slice();
	let index = answersCopy.length;
	console.log('index:' + index);
	console.log('answersCopy:' + answersCopy);
	console.log('translateQuestion:' + Object.keys(translatedQuestion)[0]);
	if (index < cons.ANSWER_COUNT) {
		throw new Error('Not enough answers for question.');
	}

	// Shuffle the answers, excluding the first element which is the correct answer.
	for (let j = 1; j < answersCopy.length; j += 1) {
		const rand = Math.floor(Math.random() * (index - 1)) + 1;
		index -= 1;

		const swapTemp1 = answersCopy[index];
		answersCopy[index] = answersCopy[rand];
		answersCopy[rand] = swapTemp1;

		const swapTemp3 = answersCopyDisp[index];
		answersCopyDisp[index] = answersCopyDisp[rand];
		answersCopyDisp[rand] = swapTemp3;
	}

	// Swap the correct answer into the target location
	for (let i = 0; i < cons.ANSWER_COUNT; i += 1) {
		answers[i] = answersCopy[i];
		answersDisp[i] = answersCopyDisp[i];
	}
	const swapTemp2 = answers[0];
	answers[0] = answers[correctAnswerTargetLocation];
	answers[correctAnswerTargetLocation] = swapTemp2;

	const swapTemp4 = answersDisp[0];
	answersDisp[0] = answersDisp[correctAnswerTargetLocation];
	answersDisp[correctAnswerTargetLocation] = swapTemp4;

	return [answers, answersDisp];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function startGame(newGame: any, handlerInput: HandlerInput) {
	const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
	const attributes = handlerInput.attributesManager.getSessionAttributes();
	let speechOutput = newGame
		? i18n.t(cons.Strings.NEW_GAME_MSG, { skillName: 'テスト' }) +
		  i18n.t(cons.Strings.WELCOME_MSG, { num: cons.GAME_LENGTH })
		: '';

	const translatedQuestions = i18n.t('QUESTIONS');
	const gameQuestions = populateGameQuestions(translatedQuestions);
	const correctAnswerIndex = Math.floor(Math.random() * cons.ANSWER_COUNT);

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
	speechOutput += i18n.t('TELL_QUESTION_MESSAGE', {
		num: '1',
		audio: cons.questionSnd,
	});
	let repromptText = spokenQuestion + '<break time="2s"/>';
	let displayText = i18n.t('DISPLAY_QUESTION_MESSAGE', {
		num: '1',
		dispQ: displayQuestion,
	});
	for (let i = 0; i < cons.ANSWER_COUNT; i += 1) {
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
	const builder = handlerInput.responseBuilder.withShouldEndSession(false);
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
