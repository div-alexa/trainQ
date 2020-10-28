import { HandlerInput } from 'ask-sdk-core';
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
import * as cons from '../utilities/constants';
import i18n from 'i18next';
import { supportsDisplay } from './display';
import apltemplate from './apl_template_export.json';
import { storage, session } from '../interceptors/RequestInterceptor';
import { getQuiz } from '../utilities/s3';
import * as moment from 'moment-timezone';

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

export function populateRoundAnswers(
	gameQuestionIndexes,
	currentQuestionIndex: number,
	correctAnswerTargetLocation: number,
	translatedQuestions: string
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
	//console.log('index:' + index);
	//console.log('answersCopy:' + answersCopy);
	//console.log('translateQuestion:' + Object.keys(translatedQuestion)[0]);
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
export async function startGame(newGame: any, handlerInput: HandlerInput) {
	const attributes = handlerInput.attributesManager.getSessionAttributes();

	//現在日付を取得
	const CURRENT_DATETIME = moment.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm');
	console.log('CDTIME: %s', CURRENT_DATETIME);
	if (!storage.lastPlayTime) {
		storage.lastPlayTime = CURRENT_DATETIME;
	}
	const lastTime = moment.parseZone(storage.lastPlayTime);
	const nowTime = moment.parseZone(CURRENT_DATETIME);
	//前回のクイズからの時間を計算
	const timeDiff = nowTime.diff(lastTime, 'hours', true);
	storage.lastPlayTime = CURRENT_DATETIME;

	const questions = JSON.parse(await getQuiz());
	//const translatedQuestions = i18n.t('QUESTIONS');
	const translatedQuestions = questions.QUESTIONS_BASE_JA_JP;

	if (!storage.totalQuiz) {
		storage.totalQuiz = translatedQuestions.length;
	}
	const addedQuiz = translatedQuestions.length - storage.totalQuiz;
	if (addedQuiz > 0) {
		console.log('追加したクイズ' + addedQuiz);
	}
	storage.totalQuiz = translatedQuestions.length;

	// 初回のみ
	// 前回から1時間以上あく
	// 前回から1時間以内
	let speechOutput = '';

	console.log('newG:' + newGame);
	console.log('addedQ:' + addedQuiz);
	console.log('timeDiff:' + timeDiff);
	if (newGame) {
		session.soon = 0;
		if (storage.playCount == 1) {
			speechOutput =
				i18n.t(cons.Strings.NEW_GAME_MSG, { skillName: '鉄道クイズ' }) +
				i18n.t(cons.Strings.WELCOME_MSG, { num: cons.GAME_LENGTH });
		} else if (storage.playCount > 1 && timeDiff >= 1) {
			speechOutput = i18n.t(cons.Strings.WELCOME_BACK_MSG);
			// 前回からクイズが増えている
			if (addedQuiz > 0) {
				speechOutput += i18n.t(cons.Strings.ADD_QUIZ_MSG, { num: addedQuiz });
			}
			speechOutput += i18n.t(cons.Strings.SOON_MSG);
		} else if (storage.playCount > 1 && timeDiff < 1) {
			if (addedQuiz > 0) {
				speechOutput = i18n.t(cons.Strings.ADD_QUIZ_MSG, { num: addedQuiz });
			}
			speechOutput += i18n.t(cons.Strings.SOON_MSG);
			session.soon = 1;
		}
	}
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
		displayQ: displayQuestion,
	});
	let displayChoice = '';
	for (let i = 0; i < cons.ANSWER_COUNT; i += 1) {
		repromptText += `${i + 1}番、 ${roundAnswers[i]}。<break time="1s"/>`;
		displayText += `<br>${i + 1}番：${roundAnswersDisp[i]} `;
		displayChoice += `<br>${i + 1}番：${roundAnswersDisp[i]} `;
	}
	repromptText += '答えは何番でしょう';

	//const sessionAttributes = {};

	const translatedQuestion =
		translatedQuestions[gameQuestions[currentQuestionIndex]];

	/*
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
	*/
	session.speechOutput = repromptText;
	session.reprmptText = repromptText;
	session.currentQuestionIndex = currentQuestionIndex;
	session.correctAnswerIndex = correctAnswerIndex + 1;
	session.questions = gameQuestions;
	session.score = 0;
	session.correctAnswerText =
		translatedQuestion[Object.keys(translatedQuestion)[1]][0];
	session.correctAnswerSpeech =
		translatedQuestion[Object.keys(translatedQuestion)[0]][0];
	session.quizName = attributes.quizName;
	session.answerRecord = [];
	session.displayText = displayText;
	session.displayChoice = displayChoice;
	//	handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

	console.log('displayText:' + displayText);

	// レスポンスの生成
	const builder = handlerInput.responseBuilder.withShouldEndSession(false);
	//console.log('supportDisplay:' + supportsDisplay(handlerInput));
	if (supportsDisplay(handlerInput)) {
		// device has display
		//const aplSample = require('./apl_template_export.json');
		const aplSample = apltemplate;
		//  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult =
			'鉄道クイズ';
		aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml =
			'<speak>' + repromptText + '</speak>';
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplay = displayText;
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplayChoice = displayChoice;
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
