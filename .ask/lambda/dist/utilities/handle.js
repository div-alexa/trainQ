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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserGuess = void 0;
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
var cons = __importStar(require("../utilities/constants"));
var i18next_1 = __importDefault(require("i18next"));
var display_1 = require("./display");
var apl_template_export_json_1 = __importDefault(require("./apl_template_export.json"));
var game_1 = require("./game");
var moment_1 = __importDefault(require("moment"));
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
function isAnswerSlotValid(intent) {
    var answerSlotFilled = intent && intent.slots && intent.slots.Answer && intent.slots.Answer.value;
    var answerSlotIsInt = answerSlotFilled && !Number.isNaN(parseInt(intent.slots.Answer.value, 10));
    return (answerSlotIsInt &&
        parseInt(intent.slots.Answer.value, 10) < cons.ANSWER_COUNT + 1 &&
        parseInt(intent.slots.Answer.value, 10) > 0);
}
function handleUserGuess(userGaveUp, handlerInput) {
    return __awaiter(this, void 0, void 0, function () {
        var requestEnvelope, attributesManager, responseBuilder, intent, answerSlotValid, speechOutput, speechOutputAnalysis, sessionAttributes, gameQuestions, correctAnswerIndex, currentScore, currentQuestionIndex, answerRecord, correctAnswerText, isCorrect, translatedQuestions, correctMsgIndex, message, answeredQuestion, answeredCode, record, fullMessage, endSpeech, CURRENT_DATETIME, gameRecord, attributes, displayEndText, builder_1, aplSample, spokenQuestion, displayQuestion, roundAnswersList, roundAnswers, roundAnswersDisp, questionIndexForSpeech, repromptText, displayText, i, translatedQuestion, builder, aplSample;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('handleUserGuess');
                    requestEnvelope = handlerInput.requestEnvelope, attributesManager = handlerInput.attributesManager, responseBuilder = handlerInput.responseBuilder;
                    intent = requestEnvelope.request.intent;
                    answerSlotValid = isAnswerSlotValid(intent);
                    console.log('answerSlotValid:' + answerSlotValid);
                    speechOutput = '';
                    speechOutputAnalysis = '';
                    sessionAttributes = attributesManager.getSessionAttributes();
                    gameQuestions = sessionAttributes.questions;
                    correctAnswerIndex = parseInt(sessionAttributes.correctAnswerIndex, 10);
                    currentScore = parseInt(sessionAttributes.score, 10);
                    currentQuestionIndex = parseInt(sessionAttributes.currentQuestionIndex, 10);
                    answerRecord = sessionAttributes.answerRecord;
                    correctAnswerText = sessionAttributes.correctAnswerText;
                    isCorrect = 0;
                    translatedQuestions = i18next_1.default.t('QUESTIONS');
                    if (answerSlotValid &&
                        parseInt(intent.slots.Answer.value, 10) ===
                            sessionAttributes.correctAnswerIndex) {
                        currentScore += 1;
                        correctMsgIndex = Math.floor(Math.random() * 3);
                        message = ['すごい', 'やったね', 'さすがですね'];
                        speechOutputAnalysis = i18next_1.default.t('ANSWER_CORRECT_MESSAGE', {
                            audio: cons.correctSnd,
                            text: message[correctMsgIndex],
                        });
                        isCorrect = 1;
                    }
                    else {
                        if (!userGaveUp) {
                            speechOutputAnalysis = i18next_1.default.t('ANSWER_WRONG_MESSAGE', {
                                audio: cons.incorrectSnd,
                            });
                        }
                        speechOutputAnalysis += i18next_1.default.t('CORRECT_ANSWER_MESSAGE', {
                            num: correctAnswerIndex,
                            answer: correctAnswerText,
                        });
                        isCorrect = 0;
                    }
                    // 回答履歴をsessionに持たせる
                    console.log('currentQuestionIndex:' + currentQuestionIndex);
                    console.log('gameQuestions:' + gameQuestions);
                    console.log('translatedQuestions:' + translatedQuestions);
                    answeredQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];
                    answeredCode = answeredQuestion[Object.keys(answeredQuestion)[3]];
                    console.log('answeredCode:' + answeredCode);
                    record = { code: answeredCode, correct: isCorrect };
                    answerRecord.push(record);
                    if (!(sessionAttributes.currentQuestionIndex === cons.GAME_LENGTH - 1)) return [3 /*break*/, 3];
                    speechOutput = userGaveUp ? '' : i18next_1.default.t('ANSWER_IS_MESSAGE');
                    speechOutput += speechOutputAnalysis;
                    fullMessage = '';
                    if (cons.GAME_LENGTH.toString() == currentScore.toString()) {
                        fullMessage = '<br>お見事！全問正解です！<br>';
                    }
                    endSpeech = i18next_1.default.t('GAME_OVER_MESSAGE', {
                        numAll: cons.GAME_LENGTH.toString(),
                        numCorrect: currentScore.toString(),
                        text: fullMessage,
                    });
                    CURRENT_DATETIME = moment_1.default().format('YYYYMMDDHHmmssSS');
                    gameRecord = { time: CURRENT_DATETIME, record: answerRecord };
                    return [4 /*yield*/, handlerInput.attributesManager.getPersistentAttributes()];
                case 1:
                    attributes = _a.sent();
                    // 初期化
                    if (!attributes.gameRecord) {
                        attributes.gameRecord = [];
                    }
                    attributes.gameRecord.push(gameRecord);
                    handlerInput.attributesManager.setPersistentAttributes(attributes);
                    return [4 /*yield*/, handlerInput.attributesManager.savePersistentAttributes()];
                case 2:
                    _a.sent();
                    speechOutput += endSpeech.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                    displayEndText = speechOutputAnalysis + '<br><br>' + endSpeech.replace('？', '');
                    builder_1 = handlerInput.responseBuilder.withShouldEndSession(true);
                    if (display_1.supportsDisplay(handlerInput)) {
                        aplSample = apl_template_export_json_1.default;
                        //  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
                        aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult = displayEndText;
                        //      aplSample.datasources.bodyTemplate6Data.properties.trainQuizSsml = '<speak>' + endSpeech + '</speak>';
                        //      aplSample.datasources.bodyTemplate6Data.textContent.primaryText.trainQuizDisplay = endSpeech;
                        builder_1.addDirective({
                            type: 'Alexa.Presentation.APL.RenderDocument',
                            version: '1.0',
                            token: 'token',
                            document: aplSample.document,
                            datasources: aplSample.datasources,
                        });
                    }
                    else {
                        // speechOutput += endSpeech;
                    }
                    return [2 /*return*/, (builder_1
                            .speak(speechOutput)
                            //    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
                            .getResponse())];
                case 3:
                    currentQuestionIndex += 1;
                    correctAnswerIndex = Math.floor(Math.random() * cons.ANSWER_COUNT);
                    spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
                    displayQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[1];
                    roundAnswersList = game_1.populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
                    roundAnswers = roundAnswersList[0];
                    roundAnswersDisp = roundAnswersList[1];
                    questionIndexForSpeech = currentQuestionIndex + 1;
                    repromptText = spokenQuestion + '<break time="2s"/>';
                    displayText = i18next_1.default.t('DISPLAY_QUESTION_MESSAGE', {
                        num: questionIndexForSpeech.toString(),
                        displayQ: displayQuestion,
                    });
                    for (i = 0; i < cons.ANSWER_COUNT; i += 1) {
                        repromptText += i + 1 + "\u756A\u3001 " + roundAnswers[i] + "\u3002<break time=\"1s\"/>";
                        displayText += "<br>" + (i + 1) + "\u756A\uFF1A" + roundAnswersDisp[i] + " ";
                    }
                    repromptText += '答えは何番でしょう';
                    speechOutput += userGaveUp ? '' : i18next_1.default.t('ANSWER_IS_MESSAGE');
                    speechOutput += speechOutputAnalysis;
                    // 第x門、ジャジャンまで含める。
                    speechOutput += i18next_1.default.t('TELL_QUESTION_MESSAGE', {
                        num: questionIndexForSpeech.toString(),
                        audio: cons.questionSnd,
                    });
                    translatedQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];
                    Object.assign(sessionAttributes, {
                        speechOutput: repromptText,
                        repromptText: repromptText,
                        currentQuestionIndex: currentQuestionIndex,
                        correctAnswerIndex: correctAnswerIndex + 1,
                        questions: gameQuestions,
                        score: currentScore,
                        correctAnswerText: translatedQuestion[Object.keys(translatedQuestion)[1]][0],
                        answerRecord: answerRecord,
                    });
                    RequestInterceptor_1.session.speechOutput = repromptText;
                    RequestInterceptor_1.session.reprmptText = repromptText;
                    RequestInterceptor_1.session.currentQuestionIndex = currentQuestionIndex;
                    RequestInterceptor_1.session.correctAnswerIndex = correctAnswerIndex + 1;
                    RequestInterceptor_1.session.questions = gameQuestions;
                    RequestInterceptor_1.session.score = currentScore;
                    RequestInterceptor_1.session.correctAnswerText =
                        translatedQuestion[Object.keys(translatedQuestion)[1]][0];
                    RequestInterceptor_1.session.answerRecord = answerRecord;
                    builder = handlerInput.responseBuilder.withShouldEndSession(false);
                    console.log('supportDisplay:' + display_1.supportsDisplay(handlerInput));
                    if (display_1.supportsDisplay(handlerInput)) {
                        aplSample = apl_template_export_json_1.default;
                        //  aplSample.datasources.bodyTemplate6Data.textContent.primaryText.text = repromptText;
                        aplSample.datasources.bodyTemplate6Data.textContent.primaryText.quizResult = speechOutputAnalysis;
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
                                    componentId: 'quizResult',
                                },
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
                    return [2 /*return*/, builder.speak(speechOutput).reprompt(repromptText).getResponse()];
            }
        });
    });
}
exports.handleUserGuess = handleUserGuess;
//# sourceMappingURL=handle.js.map