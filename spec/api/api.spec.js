describe('Api', function() {

  var
    proxyquire = require('proxyquire'),
    Promise = require('bluebird'),
    Api,
    requestStub,
    requestOptions,
    mockErr = null,
    mockRes = { statusCode: 200 },
    mockBody = '"foobar"';

  beforeEach(function() {

    requestStub = function(options, cb) {
      requestOptions = options;
      cb(mockErr, mockRes, mockBody);
    };

    Api = proxyquire('../../lib/api', {
      'request': requestStub
    });
  });

  it('should exist', function() {
    expect(Api).to.not.be.undefined;
  });

  describe('constructor', function() {
    it('should store the headers', function() {
      var
        head = { 'foo': 'bar' },
        api = new Api({ headers: head });

      expect(api.headers).to.equal(head);
    });
  });

  describe('rest methods', function() {
    var
      api;

    beforeEach(function() {
      api = new Api();
      api.req = sinon.spy();
    });

    describe('post()', function() {
      it('should make a post request', function() {
        api.post('foo/bar', {foo: 'bar'});

        expect(api.req.calledWith('POST', 'foo/bar', {foo: 'bar'})).to.be.true;
      });
    });

    describe('get()', function() {
      it('should make a get request', function() {
        api.get('foo/bar');

        expect(api.req.calledWith('GET', 'foo/bar')).to.be.true;
      });
    });

    describe('put()', function() {
      it('should make a put request', function() {
        api.put('foo/bar', {foo: 'bar'});

        expect(api.req.calledWith('PUT', 'foo/bar', {foo: 'bar'})).to.be.true;
      });
    });

    describe('del()', function() {
      it('should make a del request', function() {
        api.del('foo/bar');

        expect(api.req.calledWith('DELETE', 'foo/bar')).to.be.true;
      });
    });
  });

  describe('req()', function() {
    var
      api;

    beforeEach(function() {
      api = new Api({headers: { foo: 'bar' }});
    });

    it('should return a promise', function() {
      expect(api.req('GET', 'foo/bar') instanceof Promise).to.be.true;
    });

    it('should set the correct request options', function() {
      api.req('POST', 'foo/bar', { foo: 'bar' });

      expect(requestOptions.method).to.equal('POST');
      expect(requestOptions.url).to.equal('foo/bar');
      expect(requestOptions.headers.foo).to.equal('bar');
      expect(requestOptions.headers['Content-Type']).to.equal('application/json');
      expect(requestOptions.body).to.equal('{"foo":"bar"}');
    });

    it('should resolve the body on success', function() {
      var
        res = api.req('GET', 'foo/bar');

      expect(res).to.become('foobar');
    });

    it('should reject the body on failure', function() {
      var
        res;

      mockRes.statusCode = 500;
      mockBody = '"error"';

      res = api.req('GET', 'foo/bar');

      expect(res).to.be.rejected;
    });
  });

  describe('err()', function() {
    it('should return a function', function() {
      expect(typeof Api.err()).to.equal('function');
    });

    it('should send an error response', function() {
      var
        res = {
          header: sinon.spy(),
          send: sinon.spy()
        };

      Api.err(res)('error');

      expect(res.send.calledWith(500, 'error')).to.be.true;
    });
  });

});