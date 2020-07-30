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
exports.startGame = exports.populateRoundAnswers = void 0;
//import { RequestTypes, Strings, ANSWER_COUNT, GAME_LENGTH } from '../utilities/constants';
var cons = __importStar(require("../utilities/constants"));
var i18next_1 = __importDefault(require("i18next"));
var display_1 = require("./display");
var apl_template_export_json_1 = __importDefault(require("./apl_template_export.json"));
var RequestInterceptor_1 = require("../interceptors/RequestInterceptor");
var s3_1 = require("../utilities/s3");
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
    return __awaiter(this, void 0, void 0, function () {
        var attributes, speechOutput, questions, _a, _b, translatedQuestions, gameQuestions, correctAnswerIndex, roundAnswersList, roundAnswers, roundAnswersDisp, currentQuestionIndex, spokenQuestion, displayQuestion, repromptText, displayText, i, sessionAttributes, translatedQuestion, builder, aplSample;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    attributes = handlerInput.attributesManager.getSessionAttributes();
                    speechOutput = newGame
                        ? i18next_1.default.t(cons.Strings.NEW_GAME_MSG, { skillName: '鉄道クイズ' }) +
                            i18next_1.default.t(cons.Strings.WELCOME_MSG, { num: cons.GAME_LENGTH })
                        : '';
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, s3_1.getQuiz()];
                case 1:
                    questions = _b.apply(_a, [_c.sent()]);
                    translatedQuestions = questions.QUESTIONS_BASE_JA_JP;
                    gameQuestions = populateGameQuestions(translatedQuestions);
                    correctAnswerIndex = Math.floor(Math.random() * cons.ANSWER_COUNT);
                    roundAnswersList = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
                    roundAnswers = roundAnswersList[0];
                    roundAnswersDisp = roundAnswersList[1];
                    currentQuestionIndex = 0;
                    spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
                    displayQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[1];
                    // 第x門、ジャジャンまで含める。
                    speechOutput += i18next_1.default.t('TELL_QUESTION_MESSAGE', {
                        num: '1',
                        audio: cons.questionSnd,
                    });
                    repromptText = spokenQuestion + '<break time="2s"/>';
                    displayText = i18next_1.default.t('DISPLAY_QUESTION_MESSAGE', {
                        num: '1',
                        displayQ: displayQuestion,
                    });
                    for (i = 0; i < cons.ANSWER_COUNT; i += 1) {
                        repromptText += i + 1 + "\u756A\u3001 " + roundAnswers[i] + "\u3002<break time=\"1s\"/>";
                        displayText += "<br>" + (i + 1) + "\u756A\uFF1A" + roundAnswersDisp[i] + " ";
                    }
                    repromptText += '答えは何番でしょう';
                    sessionAttributes = {};
                    translatedQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];
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
                    builder = handlerInput.responseBuilder.withShouldEndSession(false);
                    //console.log('supportDisplay:' + supportsDisplay(handlerInput));
                    if (display_1.supportsDisplay(handlerInput)) {
                        aplSample = apl_template_export_json_1.default;
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
                    return [2 /*return*/, (builder
                            .speak(speechOutput)
                            .reprompt(repromptText)
                            //    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
                            .getResponse())];
            }
        });
    });
}
exports.startGame = startGame;
//# sourceMappingURL=game.js.map