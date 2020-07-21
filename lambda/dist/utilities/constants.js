"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_LENGTH = exports.ANSWER_COUNT = exports.Strings = exports.LocaleTypes = exports.IntentTypes = exports.RequestTypes = void 0;
var RequestTypes;
(function (RequestTypes) {
    RequestTypes["Launch"] = "LaunchRequest";
    RequestTypes["Intent"] = "IntentRequest";
    RequestTypes["SessionEnded"] = "SessionEndedRequest";
    RequestTypes["SystemExceptionEncountered"] = "System.ExceptionEncountered";
})(RequestTypes = exports.RequestTypes || (exports.RequestTypes = {}));
var IntentTypes;
(function (IntentTypes) {
    IntentTypes["Help"] = "AMAZON.HelpIntent";
    IntentTypes["Stop"] = "AMAZON.StopIntent";
    IntentTypes["Cancel"] = "AMAZON.CancelIntent";
    IntentTypes["Fallback"] = "AMAZON.FallbackIntent";
    IntentTypes["HelloWorld"] = "HelloWorldIntent";
})(IntentTypes = exports.IntentTypes || (exports.IntentTypes = {}));
var LocaleTypes;
(function (LocaleTypes) {
    LocaleTypes["esES"] = "es-ES";
    LocaleTypes["jaJP"] = "ja-JP";
})(LocaleTypes = exports.LocaleTypes || (exports.LocaleTypes = {}));
var Strings;
(function (Strings) {
    Strings["QUESTIONS"] = "QUESTIONS";
    Strings["SKILL_NAME"] = "SKILL_NAME";
    Strings["WELCOME_MSG"] = "WELCOME_MSG";
    Strings["GOODBYE_MSG"] = "GOODBYE_MSG";
    Strings["HELLO_MSG"] = "HELLO_MSG";
    Strings["HELP_MSG"] = "HELP_MSG";
    Strings["ERROR_MSG"] = "ERROR_MSG";
    Strings["REFLECTOR_MSG"] = "REFLECTOR_MSG";
    Strings["FALLBACK_MSG"] = "FALLBACK_MSG";
    Strings["NEW_GAME_MSG"] = "NEW_GAME_MSG";
})(Strings = exports.Strings || (exports.Strings = {}));
exports.ANSWER_COUNT = 3;
exports.GAME_LENGTH = 5;
//# sourceMappingURL=constants.js.map