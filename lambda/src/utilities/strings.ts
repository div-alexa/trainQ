import { Strings, LocaleTypes } from './constants';

interface IStrings {
  [Strings.SKILL_NAME]: string;
  [Strings.WELCOME_MSG]: string;
  [Strings.GOODBYE_MSG]: string;
  [Strings.HELLO_MSG]: string;
  [Strings.HELP_MSG]: string;
  [Strings.ERROR_MSG]: string;
  [Strings.REFLECTOR_MSG]: string;
  [Strings.FALLBACK_MSG]: string;
}

export const strings = {
  [LocaleTypes.jaJP]: {
    translation: {
      SKILL_NAME: 'スキルテンプレート',
      WELCOME_MSG: 'ようこそハローワールドへ',
      HELLO_MSG: 'こんにちは',
      HELP_MSG: 'ヘルプメッセージ',
      GOODBYE_MSG: 'さようなら',
      REFLECTOR_MSG: '次のインテントが呼ばれました {{intentName}}',
      FALLBACK_MSG:
        'フォールバックメッセージ',
      ERROR_MSG: 'エラーメッセージ',
    } as IStrings,
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
