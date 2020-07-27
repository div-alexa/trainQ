import * as aws from 'aws-sdk';

const s3 = new aws.S3();
const bucketName = 'train-quiz';
const fileName = 'quizList/q.json';
aws.config.region = 'ap-northeast-1';

export function getQuiz(): Promise<string> {
	const getParams = {
		Bucket: bucketName,
		Key: fileName,
	};

	return new Promise(function (resolve, reject) {
		let resultJson;
		s3.getObject(getParams, function (err, data) {
			if (err) {
				resultJson = '{"status": false}';
			} else {
				resultJson = data.Body ? data.Body.toString() : '';
			}
			console.log('err:' + err + 'reject:' + reject);
			resolve(resultJson);
		});
	});
}
