var frisby = require('frisby');

frisby.create('Get Todo Files')
	.get('http://localhost:3000/api')
	.addHeader('Accept', 'application/json')
	.expectStatus(200)
	.expectHeaderContains('content-type', 'application/json')
	.expectJSONTypes('0', Array)
	.toss();