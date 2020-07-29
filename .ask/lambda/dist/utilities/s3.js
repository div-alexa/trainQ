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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuiz = void 0;
var aws = __importStar(require("aws-sdk"));
var s3 = new aws.S3();
var bucketName = 'train-quiz';
var fileName = 'quizList/q.json';
aws.config.region = 'ap-northeast-1';
function getQuiz() {
    var getParams = {
        Bucket: bucketName,
        Key: fileName,
    };
    return new Promise(function (resolve, reject) {
        var resultJson;
        s3.getObject(getParams, function (err, data) {
            if (err) {
                resultJson = '{"status": false}';
            }
            else {
                resultJson = data.Body ? data.Body.toString() : '';
            }
            console.log('err:' + err + 'reject:' + reject);
            resolve(resultJson);
        });
    });
}
exports.getQuiz = getQuiz;
//# sourceMappingURL=s3.js.map