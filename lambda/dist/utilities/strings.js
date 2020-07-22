"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.strings = void 0;
var constants_1 = require("./constants");
var questions_1 = require("./questions");
exports.strings = (_a = {},
    _a[constants_1.LocaleTypes.jaJP] = {
        translation: {
            QUESTIONS: questions_1.questions.QUESTIONS_BASE_JA_JP,
            SKILL_NAME: '鉄道クイズ',
            WELCOME_MSG: '鉄道のさんたくクイズを {{num}} 問だします。番号で答えてくださいね？',
            HELLO_MSG: 'こんにちは',
            HELP_MSG: 'ヘルプメッセージ',
            GOODBYE_MSG: 'さようなら',
            REFLECTOR_MSG: '次のインテントが呼ばれました {{intentName}}',
            FALLBACK_MSG: 'フォールバックメッセージ',
            ERROR_MSG: 'エラーメッセージ',
            NEW_GAME_MSG: ' {{skillName}} へようこそ。',
            TELL_QUESTION_MESSAGE: 'それでは第 {{num}}問。<audio src="{{audio}}"/>',
            DISPLAY_QUESTION_MESSAGE: '第 {{num}}問。 {{displayQ}} ',
        },
    },
    _a[constants_1.LocaleTypes.esES] = {
        translation: {
            SKILL_NAME: 'Hello world',
            WELCOME_MSG: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
            HELLO_MSG: 'Hola Mundo!',
            HELP_MSG: 'Puedes decirme hola. Cómo te puedo ayudar?',
            GOODBYE_MSG: 'Hasta luego!',
            REFLECTOR_MSG: 'Acabas de activar {{intentName}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
            ERROR_MSG: 'Lo siento, ha habido un error. Por favor inténtalo otra vez.',
        },
    },
    _a);
//# sourceMappingURL=strings.js.map