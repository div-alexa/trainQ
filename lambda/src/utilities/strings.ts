import { Strings, LocaleTypes } from './constants';
import { questions } from './questions';

interface IStrings {
	[Strings.QUESTIONS]: string;
	[Strings.SKILL_NAME]: string;
	[Strings.WELCOME_MSG]: string;
	[Strings.GOODBYE_MSG]: string;
	[Strings.HELLO_MSG]: string;
	[Strings.HELP_MSG]: string;
	[Strings.ERROR_MSG]: string;
	[Strings.REFLECTOR_MSG]: string;
	[Strings.FALLBACK_MSG]: string;
	[Strings.NEW_GAME_MSG]: string;
	[Strings.TELL_QUESTION_MESSAGE]: string;
	[Strings.DISPLAY_QUESTION_MESSAGE]: string;
}

export const strings = {
	[LocaleTypes.jaJP]: {
		translation: ({
			QUESTIONS: questions.QUESTIONS_BASE_JA_JP,
			SKILL_NAME: '鉄道クイズ',
			WELCOME_MSG:
				'鉄道のさんたくクイズを {{num}} 問だします。番号で答えてくださいね？',
			HELLO_MSG: 'こんにちは',
			HELP_MSG: 'ヘルプメッセージ',
			GOODBYE_MSG: 'さようなら',
			REFLECTOR_MSG: '次のインテントが呼ばれました {{intentName}}',
			FALLBACK_MSG: 'フォールバックメッセージ',
			ERROR_MSG: 'エラーメッセージ',
			NEW_GAME_MSG: ' {{skillName}} へようこそ。',
			TELL_QUESTION_MESSAGE: 'それでは第 {{num}}問。<audio src="{{audio}}"/>',
			DISPLAY_QUESTION_MESSAGE: '第 {{num}}問。 {{displayQ}} ',
		} as unknown) as IStrings,
	},
	[LocaleTypes.esES]: {
		translation: {
			SKILL_NAME: 'Hello world',
			WELCOME_MSG: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
			HELLO_MSG: 'Hola Mundo!',
			HELP_MSG: 'Puedes decirme hola. Cómo te puedo ayudar?',
			GOODBYE_MSG: 'Hasta luego!',
			REFLECTOR_MSG: 'Acabas de activar {{intentName}}',
			FALLBACK_MSG:
				'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
			ERROR_MSG: 'Lo siento, ha habido un error. Por favor inténtalo otra vez.',
		} as IStrings,
	},
};
