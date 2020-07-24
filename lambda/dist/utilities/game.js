"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.populateRoundAnswers = void 0;
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
var cons = __importStar(require("../utilities/constants"));
var i18next_1 = __importDefault(require("i18next"));
var display_1 = require("./display");
var apl_template_export_json_1 = __importDefault(require("./apl_template_export.json"));
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
function populateGameQuestions(translatedQuestions) {
    var gameQuestions = [];
    var indexList = [];
    var index = translatedQuestions.length;
    if (cons.GAME_LENGTH > index) {
        throw new Error('Invalid Game Length.');
    }
    for (var i = 0; i < translatedQuestions.length; i += 1) {
        indexList.push(i);
    }
    for (var j = 0; j < cons.GAME_LENGTH; j += 1) {
        var rand = Math.floor(Math.random() * index);
        index -= 1;
        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }
    return gameQuestions;
}
function populateRoundAnswers(gameQuestionIndexes, currentQuestionIndex, correctAnswerTargetLocation, translatedQuestions) {
    var answers = [];
    var answersDisp = [];
    var translatedQuestion = translatedQuestions[gameQuestionIndexes[currentQuestionIndex]];
    var answersCopy = translatedQuestion[Object.keys(translatedQuestion)[0]].slice();
    var answersCopyDisp = translatedQuestion[Object.keys(translatedQuestion)[1]].slice();
    var index = answersCopy.length;
    //console.log('index:' + index);
    //console.log('answersCopy:' + answersCopy);
    //console.log('translateQuestion:' + Object.keys(translatedQuestion)[0]);
    if (index < cons.ANSWER_COUNT) {
        throw new Error('Not enough answers for question.');
    }
    // Shuffle the answers, excluding the first element which is the correct answer.
    for (var j = 1; j < answersCopy.length; j += 1) {
        var rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;
        var swapTemp1 = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = swapTemp1;
        var swapTemp3 = answersCopyDisp[index];
        answersCopyDisp[index] = answersCopyDisp[rand];
        answersCopyDisp[rand] = swapTemp3;
    }
    // Swap the correct answer into the target location
    for (var i = 0; i < cons.ANSWER_COUNT; i += 1) {
        answers[i] = answersCopy[i];
        answersDisp[i] = answersCopyDisp[i];
    }
    var swapTemp2 = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = swapTemp2;
    var swapTemp4 = answersDisp[0];
    answersDisp[0] = answersDisp[correctAnswerTargetLocation];
    answersDisp[correctAnswerTargetLocation] = swapTemp4;
    return [answers, answersDisp];
}
exports.populateRoundAnswers = populateRoundAnswers;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function startGame(newGame, handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechOutput = newGame
        ? i18next_1.default.t(cons.Strings.NEW_GAME_MSG, { skillName: 'テスト' }) +
            i18next_1.default.t(cons.Strings.WELCOME_MSG, { num: cons.GAME_LENGTH })
        : '';
    var translatedQuestions = i18next_1.default.t('QUESTIONS');
    var gameQuestions = populateGameQuestions(translatedQuestions);
    var correctAnswerIndex = Math.floor(Math.random() * cons.ANSWER_COUNT);
    var roundAnswersList = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
    var roundAnswers = roundAnswersList[0];
    var roundAnswersDisp = roundAnswersList[1];
    var currentQuestionIndex = 0;
    var spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
    var displayQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[1];
    // 第x門、ジャジャンまで含める。
    speechOutput += i18next_1.default.t('TELL_QUESTION_MESSAGE', {
        num: '1',
        audio: cons.questionSnd,
    });
    var repromptText = spokenQuestion + '<break time="2s"/>';
    var displayText = i18next_1.default.t('DISPLAY_QUESTION_MESSAGE', {
        num: '1',
        displayQ: displayQuestion,
    });
    for (var i = 0; i < cons.ANSWER_COUNT; i += 1) {
        repromptText += i + 1 + "\u756A\u3001 " + roundAnswers[i] + "\u3002<break time=\"1s\"/>";
        displayText += "<br>" + (i + 1) + "\u756A\uFF1A" + roundAnswersDisp[i] + " ";
    }
    repromptText += '答えは何番でしょう';
    var sessionAttributes = {};
    var translatedQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];
    Object.assign(sessionAttributes, {
        speechOutput: repromptText,
        repromptText: repromptText,
        currentQuestionIndex: currentQuestionIndex,
        correctAnswerIndex: correctAnswerIndex + 1,
        questions: gameQuestions,
        score: 0,
        correctAnswerText: translatedQuestion[Object.keys(translatedQuestion)[1]][0],
        entitledProducts: attributes.entitledProducts,
        quizName: attributes.quizName,
        answerRecord: [],
    });
    RequestInterceptor_1.session.speechOutput = repromptText;
    RequestInterceptor_1.session.reprmptText = repromptText;
    RequestInterceptor_1.session.currentQuestionIndex = currentQuestionIndex;
    RequestInterceptor_1.session.correctAnswerIndex = correctAnswerIndex + 1;
    RequestInterceptor_1.session.questions = gameQuestions;
    RequestInterceptor_1.session.score = 0;
    RequestInterceptor_1.session.correctAnswerText =
        translatedQuestion[Object.keys(translatedQuestion)[1]][0];
    RequestInterceptor_1.session.quizName = attributes.quizName;
    RequestInterceptor_1.session.answerRecord = [];
    //	handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log('displayText:' + displayText);
    // レスポンスの生成
    var builder = handlerInput.responseBuilder.withShouldEndSession(false);
    console.log('supportDisplay:' + display_1.supportsDisplay(handlerInput));
    if (display_1.supportsDisplay(handlerInput)) {
        // device has display
        //const aplSample = require('./apl_template_export.json');
        var aplSample = apl_template_export_json_1.default;
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
    }
    else {
        speechOutput += repromptText;
    }
    return (builder
        .speak(speechOutput)
        .reprompt(repromptText)
        //    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
        .getResponse());
}
exports.startGame = startGame;
//# sourceMappingURL=game.js.map