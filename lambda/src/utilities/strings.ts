import { Strings, LocaleTypes } from './constants';

interface IStrings {
	[Strings.QUESTIONS]: string;
	[Strings.SKILL_NAME]: string;
	[Strings.WELCOME_MSG]: string;
	[Strings.GOODBYE_MSG]: string;
	[Strings.HELLO_MSG]: string;
	[Strings.HELP_MSG]: string;
	[Strings.HELP_START_MSG]: string;
	[Strings.HELP_GOING_MSG]: string;
	[Strings.ERROR_MSG]: string;
	[Strings.REFLECTOR_MSG]: string;
	[Strings.FALLBACK_MSG]: string;
	[Strings.NEW_GAME_MSG]: string;
	[Strings.TELL_QUESTION_MESSAGE]: string;
	[Strings.DISPLAY_QUESTION_MESSAGE]: string;
	[Strings.ANSWER_CORRECT_MESSAGE]: string;
	[Strings.ANSWER_WRONG_MESSAGE]: string;
	[Strings.CORRECT_ANSWER_MESSAGE]: string;
	[Strings.ANSWER_IS_MESSAGE]: string;
	[Strings.GAME_OVER_MESSAGE]: string;
	[Strings.UNHANDLE_MSG]: string;
	[Strings.ONE_MORE_MSG]: string;
	[Strings.WELCOME_BACK_MSG]: string;
	[Strings.SOON_MSG]: string;
	[Strings.ADD_QUIZ_MSG]: string;
}

export const strings = {
	[LocaleTypes.jaJP]: {
		translation: ({
			QUESTIONS: '',
			SKILL_NAME: '鉄道クイズ',
			WELCOME_MSG:
				'鉄道のさんたくクイズを {{num}} 問だします。番号で答えてくださいね？',
			HELLO_MSG: 'こんにちは',
			HELP_MSG:
				'鉄道のさんたくクイズを出します。一番、二番、などの番号で答えてくださいね？問題を繰り返すには、もう一回、と言ってください。',
			HELP_START_MSG: "クイズを始めるには、'クイズスタート'と言ってください。",
			HELP_GOING_MSG:
				"クイズを続けるには'クイズを続けて'と言ってください。それでは何をしましょうか？",
			GOODBYE_MSG:
				'わかりました、クイズを終了します。がんばって問題を増やしていきますので、また遊んでくださいね？',
			REFLECTOR_MSG: '次のインテントが呼ばれました {{intentName}}',
			FALLBACK_MSG: 'フォールバックメッセージ',
			UNHANDLE_MSG: 'すみません、わかりませんでした。',
			ONE_MORE_MSG: 'もう一度お願いできますか？',
			ERROR_MSG: 'エラーが発生しました。',
			NEW_GAME_MSG:
				' はじめまして。鉄道クイズを選んでくれてありがとうございます。鉄道って、知れば知るほど面白いですよね？<break time="1s"/>このスキルでは',
			WELCOME_BACK_MSG:
				' また<phoneme alphabet="x-amazon-pron-kana" ph="アソンデクレテ">遊んでくれて</phoneme>ありがとうございます。',
			SOON_MSG: 'さっそくクイズを始めましょう。',
			ADD_QUIZ_MSG: '前より{{num}}問、増やしておきましたよ？',
			TELL_QUESTION_MESSAGE: 'それでは第 {{num}}問。<audio src="{{audio}}"/>',
			DISPLAY_QUESTION_MESSAGE: '第 {{num}}問。 {{displayQ}} ',
			ANSWER_CORRECT_MESSAGE: '<audio src="{{audio}}"/>{{text}}、正解です。',
			ANSWER_WRONG_MESSAGE: '<audio src="{{audio}}"/>残念、間違いです。',
			CORRECT_ANSWER_MESSAGE: '正解は {{num}} 番の {{answer}}でした。',
			ANSWER_IS_MESSAGE: '',
			GAME_OVER_MESSAGE:
				' {{numAll}} 門中 {{numCorrect}} 問正解でした。{{text}} {{appeal}}また遊んでくださいね？',
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
