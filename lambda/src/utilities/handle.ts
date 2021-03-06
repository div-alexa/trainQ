import { HandlerInput } from 'ask-sdk-core';
import * as Model from 'ask-sdk-model';
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
import * as cons from '../utilities/constants';
import i18n from 'i18next';
import { supportsDisplay } from './display';
import apltemplate from './apl_template_export.json';
import { populateRoundAnswers } from './game';
import moment from 'moment';
import { session } from '../interceptors/RequestInterceptor';
import { getQuiz } from '../utilities/s3';

function isAnswerSlotValid(intent: any) {
	const answerSlotFilled =
		intent && intent.slots && intent.slots.Answer && intent.slots.Answer.value;
	const answerSlotIsInt =
		answerSlotFilled && !Number.isNaN(parseInt(intent.slots.Answer.value, 10));
	return (
		answerSlotIsInt &&
		parseInt(intent.slots.Answer.value, 10) < cons.ANSWER_COUNT + 1 &&
		parseInt(intent.slots.Answer.value, 10) > 0
	);
}

export async function handleUserGuess(userGaveUp, handlerInput: HandlerInput) {
	console.log('handleUserGuess');
	const { requestEnvelope, responseBuilder } = handlerInput;
	const { intent } = requestEnvelope.request as Model.IntentRequest;

	const answerSlotValid = isAnswerSlotValid(intent);
	console.log('answerSlotValid:' + answerSlotValid);

	let speechOutput = '';
	let speechOutputAnalysis = '';
	let speechOutputAnalysisSpeech = '';

	//const sessionAttributes = attributesManager.getSessionAttributes();
	const gameQuestions = session.questions;
	let correctAnswerIndex = parseInt(session.correctAnswerIndex, 10);
	let currentScore = parseInt(session.score, 10);
	let currentQuestionIndex = parseInt(session.currentQuestionIndex, 10);
	const answerRecord = session.answerRecord;
	const { correctAnswerText } = session;
	const { correctAnswerSpeech } = session;
	let isCorrect = 0;
	const questions = JSON.parse(await getQuiz());
	//const translatedQuestions = i18n.t('QUESTIONS');
	const translatedQuestions = questions.QUESTIONS_BASE_JA_JP;

	if (
		answerSlotValid &&
		parseInt(intent.slots.Answer.value, 10) === session.correctAnswerIndex
	) {
		currentScore += 1;
		const correctMsgIndex = Math.floor(Math.random() * 3);
		const message = ['すごい', 'やったね', 'さすがですね'];
		const messagewithem = `<amazon:emotion name="excited" intensity="low">${message[correctMsgIndex]}</amazon:emotion>`;
		speechOutputAnalysisSpeech = i18n.t('ANSWER_CORRECT_MESSAGE', {
			audio: cons.correctSnd,
			text: messagewithem,
		});
		speechOutputAnalysisSpeech = `<audio src="${cons.correctSnd}"/>${messagewithem}、正解です。`;
		speechOutputAnalysis = i18n.t('ANSWER_CORRECT_MESSAGE', {
			audio: cons.correctSnd,
			text: message[correctMsgIndex],
		});
		isCorrect = 1;
	} else {
		if (!userGaveUp) {
			speechOutputAnalysis = i18n.t('ANSWER_WRONG_MESSAGE', {
				audio: cons.incorrectSnd,
			});
		}

		speechOutputAnalysisSpeech =
			speechOutputAnalysis +
			`正解は ${correctAnswerIndex} 番の。 ${correctAnswerSpeech}。<phoneme alphabet="x-amazon-pron-kana" ph="デ'シタ">でした</phoneme>。<break time="1s"/> `;

		speechOutputAnalysis += i18n.t('CORRECT_ANSWER_MESSAGE', {
			num: correctAnswerIndex,
			answer: correctAnswerText,
		});
		isCorrect = 0;
	}

	// 回答履歴をsessionに持たせる
	console.log('currentQuestionIndex:' + currentQuestionIndex);
	console.log('gameQuestions:' + gameQuestions);
	console.log('translatedQuestions:' + translatedQuestions);

	const answeredQuestion =
		translatedQuestions[gameQuestions[currentQuestionIndex]];

	const answeredCode = answeredQuestion[Object.keys(answeredQuestion)[3]];

	console.log('answeredCode:' + answeredCode);
	const record = { code: answeredCode, correct: isCorrect };
	answerRecord.push(record);

	// Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
	if (session.currentQuestionIndex === cons.GAME_LENGTH - 1) {
		speechOutput = userGaveUp ? '' : i18n.t('ANSWER_IS_MESSAGE');
		speechOutput += speechOutputAnalysisSpeech;
		let fullMessage = '';
		if (cons.GAME_LENGTH.toString() == currentScore.toString()) {
			fullMessage = 'all';
		}
		const appealMssage = session.soon
			? ''
			: 'がんばって問題を増やしていきますので、';
		const endSpeech = i18n
			.t('GAME_OVER_MESSAGE', {
				numAll: cons.GAME_LENGTH.toString(),
				numCorrect: currentScore.toString(),
				text: fullMessage,
				appeal: appealMssage,
			})
			.replace('all', '<br>お見事！全問正解です！');
		const endSpeechem = i18n
			.t('GAME_OVER_MESSAGE', {
				numAll: cons.GAME_LENGTH.toString(),
				numCorrect: currentScore.toString(),
				text: fullMessage,
				appeal: appealMssage,
			})
			.replace(
				'all',
				'<br><amazon:emotion name="excited" intensity="low">お見事！全問正解です！</amazon:emotion><br>'
			);
		// ゲームの結果を永続保存
		//現在日付を取得
		const CURRENT_DATETIME = moment().format('YYYYMMDDHHmmssSS');
		const gameRecord = { time: CURRENT_DATETIME, record: answerRecord };
		const attributes = await handlerInput.attributesManager.getPersistentAttributes();
		// 初期化
		if (!attributes.gameRecord) {
			attributes.gameRecord = [];
		}
		attributes.gameRecord.push(gameRecord);

		handlerInput.attributesManager.setPersistentAttributes(attributes);
		await handlerInput.attributesManager.savePersistentAttributes();

		//speechOutput += endSpeech.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
		console.log(endSpeechem);
		speechOutput += endSpeechem.replace(/<br>/g, '');
		const displayEndText =
			speechOutputAnalysis + '<br><br>' + endSpeech.replace('？', '');

		// レスポンスの生成
		const builder = handlerInput.responseBuilder.withShouldEndSession(true);
		if (supportsDisplay(handlerInput)) {
			// device has display
			const aplSample = apltemplate;
			//  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
			aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult = displayEndText;
			//      aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml = '<speak>' + endSpeech + '</speak>';
			//      aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplay = endSpeech;
			builder.addDirective({
				type: 'Alexa.Presentation.APL.RenderDocument',
				version: '1.0',
				token: 'token',
				document: aplSample.document,
				datasources: aplSample.datasources,
			});
		} else {
			// speechOutput += endSpeech;
		}

		return (
			builder
				.speak(speechOutput)
				//    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
				.getResponse()
		);

		return responseBuilder.speak(speechOutput).getResponse();
	}
	currentQuestionIndex += 1;
	correctAnswerIndex = Math.floor(Math.random() * cons.ANSWER_COUNT);
	const spokenQuestion = Object.keys(
		translatedQuestions[gameQuestions[currentQuestionIndex]]
	)[0];
	const displayQuestion = Object.keys(
		translatedQuestions[gameQuestions[currentQuestionIndex]]
	)[1];
	const roundAnswersList = populateRoundAnswers(
		gameQuestions,
		currentQuestionIndex,
		correctAnswerIndex,
		translatedQuestions
	);
	const roundAnswers = roundAnswersList[0];
	const roundAnswersDisp = roundAnswersList[1];
	const questionIndexForSpeech = currentQuestionIndex + 1;
	let repromptText = spokenQuestion + '<break time="2s"/>';
	let displayText = i18n.t('DISPLAY_QUESTION_MESSAGE', {
		num: questionIndexForSpeech.toString(),
		displayQ: displayQuestion,
	});

	let displayChoice = '';
	for (let i = 0; i < cons.ANSWER_COUNT; i += 1) {
		repromptText += `${i + 1}番。 ${roundAnswers[i]}。<break time="1s"/>`;
		displayText += `<br>${i + 1}番：${roundAnswersDisp[i]} `;
		displayChoice += `<br>${i + 1}番：${roundAnswersDisp[i]} `;
	}
	repromptText += '答えは何番でしょう';

	speechOutput += userGaveUp ? '' : i18n.t('ANSWER_IS_MESSAGE');
	//speechOutput += speechOutputAnalysis;
	speechOutput += speechOutputAnalysisSpeech;
	// 第x門、ジャジャンまで含める。
	speechOutput += i18n.t('TELL_QUESTION_MESSAGE', {
		num: questionIndexForSpeech.toString(),
		audio: cons.questionSnd,
	});

	//      + requestAttributes.t('SCORE_IS_MESSAGE', currentScore.toString())
	//    + repromptText;

	const translatedQuestion =
		translatedQuestions[gameQuestions[currentQuestionIndex]];

	/*
	Object.assign(sessionAttributes, {
		speechOutput: repromptText,
		repromptText,
		currentQuestionIndex,
		correctAnswerIndex: correctAnswerIndex + 1,
		questions: gameQuestions,
		score: currentScore,
		correctAnswerText:
			translatedQuestion[Object.keys(translatedQuestion)[1]][0],
		answerRecord: answerRecord,
		displayText: displayText,
	});
	*/
	session.speechOutput = repromptText;
	session.reprmptText = repromptText;
	session.currentQuestionIndex = currentQuestionIndex;
	session.correctAnswerIndex = correctAnswerIndex + 1;
	session.questions = gameQuestions;
	session.score = currentScore;
	session.correctAnswerText =
		translatedQuestion[Object.keys(translatedQuestion)[1]][0];
	session.correctAnswerSpeech =
		translatedQuestion[Object.keys(translatedQuestion)[0]][0];
	session.answerRecord = answerRecord;
	session.displayText = displayText;
	session.displayChoice = displayChoice;

	// レスポンスの生成
	const builder = handlerInput.responseBuilder.withShouldEndSession(false);
	console.log('supportDisplay:' + supportsDisplay(handlerInput));
	if (supportsDisplay(handlerInput)) {
		// device has display
		const aplSample = apltemplate;
		//  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
		aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult = speechOutputAnalysis;
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
						componentId: 'quizResult',
					},
					{
						type: 'SpeakItem',
						componentId: 'trainQuiz',
					},
				],
			});
	} else {
		speechOutput += repromptText;
	}

	return builder.speak(speechOutput).reprompt(repromptText).getResponse();
}
