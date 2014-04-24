var should = require('should'),
  config = require('../config/test.json'),
  server = require('../bin/todo.txt-server'),
  request = require('./lib/SuperSimpleRequest.js')(config),
  path = require('path');

describe('Todo.txt API Test', function() {
  'use strict';

  before(function() {
    server.start(config.port);
  });

  after(function() {
    server.stop();

    // tmp for now
    var fs = require('fs');
    fs.unlink('/home/rsullivan/Git/todo.txt-server/data/test.txt');
  });

  describe('#files', function() {

    var uri = '/api';

    it('should get files', function(done) {
      request.get(uri, function(error, payload) {
        should.not.exist(error);

        payload.should.have.property('files');
        payload.files.should.be.an.Array;

        done();
      });
    });

    it('should create file', function(done) {
      var params = {
        file_name: 'test'
      };

      request.post(uri, params, function(error, payload) {
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
        payload.file.name.should.equal(params.file_name);

        done();
      });
    });

    it('should not create', function(done) {
      var params = {};

      request.post(uri, params, function(error, payload) {
        should.not.exist(error);

        // validate schema
        payload.should.have.property('file');
        payload.file.should.have.property('created');
        payload.file.should.have.property('exists');
        payload.file.should.not.have.property('name');

        // validate types
        payload.file.created.should.be.a.Boolean;
        payload.file.exists.should.be.a.Boolean;

        // validate response
        payload.file.created.should.be.false;
        payload.file.exists.should.be.false;

        done();
      });
    });
  });

  describe('#task', function() {
    var uri = '/api/todo';
    var task_number = 0;

    it('should get list', function(done) {
      request.get(uri, function(error, payload) {
        should.not.exist(error);

        payload.should.have.property('tasks');
        payload.tasks.should.be.an.Array;

        done();
      });
    });

    it('should create a task', function(done) {
      var params = {
        task: 'Test Task @test +testing'
      };

      request.post(uri, params, function(error, payload) {
        should.not.exist(error);

        // validate schema
        payload.should.have.property('task');
        payload.task.should.have.property('created');
        payload.task.should.have.property('text');
        payload.task.should.have.property('line_number');

        // validate types
        payload.task.created.should.be.a.Boolean;
        payload.task.text.should.be.a.String;
        payload.task.line_number.should.be.a.Number;

        // validate content
        payload.task.created.should.be.true;
        payload.task.text.should.equal(params.task);
        payload.task.line_number.should.be.greaterThan(0);

        task_number = payload.task.line_number;

        done();
      });
    });

    it('should not create a task', function(done) {
      var params = {};

      request.post(uri, params, function(error, payload) {
        should.not.exist(error);

        // validate schema
        payload.should.have.property('task');
        payload.task.should.have.property('created');

        // validate types
        payload.task.created.should.be.a.Boolean;

        // validate content
        payload.task.created.should.be.false;

        done();
      });
    });

    it('should update a task', function(done) {
      var params = {
        task: 'Test2 Task2 @test +testing',
      };

      var task_uri = path.join(uri, String(task_number));

      request.put(task_uri, params, function(error, payload) {
        should.not.exist(error);

        // validate schema
        payload.should.have.property('task');
        payload.task.should.have.property('updated');
        payload.task.should.have.property('text');
        payload.task.should.have.property('old_text');

        // validate types
        payload.task.updated.should.be.a.Boolean;
        payload.task.text.should.be.a.String;
        payload.task.old_text.should.be.a.String;

        // validate content
        payload.task.updated.should.be.true;
        payload.task.text.should.equal(params.task);
        payload.task.old_text.should.not.equal(params.task);

        done();
      });
    });

  });
});