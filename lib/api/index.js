var
  Promise = require('bluebird'),
  request = require('request'),
  _ = require('lodash');

module.exports = Api;

function Api(config) {
  config = config || {};

  this.headers = config.headers;
}

Api.METHODS = {
  post: 'POST',
  POST: 'POST',
  get: 'GET',
  GET: 'GET',
  put: 'PUT',
  PUT: 'PUT',
  DEL: 'DELETE',
  del: 'DELETE'
};

Api.err = handleError;

Api.prototype.post = post;
Api.prototype.put = put;
Api.prototype.get = get;
Api.prototype.del = del;
Api.prototype.req = req;

function handleError(res, status) {
  return sendErrorResponse;

  function sendErrorResponse(err) {
    err = err || 'There was an error processing your request. Please try again';
    err = err.message || err;

    res.header('Content-Type', 'application/json');
    res.send(status || 500, err);
  }
}

function post(url, body) {
  return this.req(Api.METHODS.POST, url, body);
}

function put(url, body) {
  return this.req(Api.METHODS.PUT, url, body);
}

function get(url) {
  return this.req(Api.METHODS.GET, url);
}

function del(url) {
  return this.req(Api.METHODS.DEL, url);
}

function req(method, url, data) {
  var
    headers = this.headers;

  method = Api.METHODS[method] || 'GET';

  return new Promise(deferred);

  function deferred(resolve, reject) {
    var
      options = {};

    options.method = method;
    options.url = url || '';
    options.headers = _.extend({ 'Content-Type': 'application/json' }, headers);

    if (!_.isNull(data) && !_.isUndefined(data) && method !== Api.METHODS.GET) {
      options.body = tryJsonStringify(data) || data;
    }

    request(options, onRequestComplete);

    function onRequestComplete(err, res, body) {
      if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
        resolve(tryJsonParse(body) || body);
      }
      else {
        reject(err || tryJsonParse(body) || body);
      }
    }
  }
}

function tryJsonParse(json) {
  try {
    return JSON.parse(json);
  }
  catch (e) {
    return false;
  }
}

function tryJsonStringify(obj) {
  try {
    return JSON.stringify(obj);
  }
  catch (e) {
    return false;
  }
}


