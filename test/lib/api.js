var _ = require('underscore'),
  should = require('should'),
  http = require('http'),
  config = require('../config/test.json'),
  server = require('../bin/todo.txt-server');

describe('Todo.txt API Test', function() {
  'use strict';

  before(function() {
    server.start(config.port);
  });

  after(function() {
    server.stop();
  });

  describe('#file', function() {

    var path = '/api';

    it('get list', function(done) {
      get(path, function(error, payload) {
        should.not.exist(error);

        payload.should.have.property('files');
        payload.files.should.be.an.Array;

        done();
      });
    });

    it('create', function(done) {
      var params = {
        file_name: 'test'
      };

      post(path, params, function(error, payload) {
        should.not.exist(error);

        // validate schema
        payload.should.have.property('file');
        payload.file.should.have.property('created');
        payload.file.should.have.property('exists');
        payload.file.should.have.property('name');

        // validate types
        payload.file.created.should.be.a.Boolean;
        payload.file.exists.should.be.a.Boolean;
        payload.file.name.should.be.a.String;

        // validate response
        payload.file.created.should.be.true;
        payload.file.exists.should.be.false;

        done();
      });
    });
  });


});

/**
 * Net Functions
 */
function request(method, path, callback) {
  'use strict';

  var options = build_options(method, path);

  return http.request(options, function(response) {
    var body = '';

    response.should.be.json;
    response.on('data', storeData).on('end', done);

    function storeData(chunk) {
      body += chunk;
    }

    function done() {
      var payload = JSON.parse(body);
      callback(undefined, payload, response);
    }
  }).on('error', function(error) {
    callback(error, undefined, undefined);
  });
}

function get(path, callback) {
  'use strict';

  request('get', path, callback).end();
}

function post(path, payload, callback) {
  'use strict';

  var req = request('post', path, callback);

  var body = JSON.stringify(payload);
  req.write(body);
  req.end();
}

/**
 * Utilities
 */
function build_options(method, path) {
  'use strict';

  var options = _.clone(config);

  options.path = path;
  options.method = method;

  return options;
}