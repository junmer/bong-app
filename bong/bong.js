/**
 * @file apis
 */

var Promise = require('promise');
var request = require('request');
exports.BONG_HOST = BONG_HOST = 'http://open-test.bong.cn';

var defaluts = {
  uid: 'uid',
  access_token: 'access_token'
};


/**
 * 对象属性拷贝
 * 
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
function extend(target) {
    for ( var i = 1; i < arguments.length; i++ ) {
        var src = arguments[ i ];
        if ( src == null ) {
            continue;
        }
        for ( var key in src ) {
            if ( src.hasOwnProperty( key ) ) {
                target[ key ] = src[ key ];
            }
        }
    }
    return target;
};

/**
 * JSON 2 QUERY 
 * @param  {object} obj 目标对象
 * @return {string}     querystr
 */
function json2Query(obj) {
  var ret = [];
  for (var key in obj) {
    ret.push(key + '=' + obj[key]);
  }
  return ret.join('&');
}

function formatUrl(api, params) {

  return BONG_HOST 
    + api 
    + '?'
    + json2Query(params);
}

function get(api, params) {

  var params = extend({}, defaluts, params);
  var url = formatUrl(api, params);

  return new Promise(function (resolve, reject) {

    request(url, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        
        // try parse json
        try {
          var ret = JSON.parse(body);
        } catch (e) {
          reject(e);
        }

        // prase ok 
        if (+ret.code === 200) {
          resolve(ret.value);
        } else {
          reject(ret.message);
        }

      } else {
        reject(error);
      }

    });
  });

}

/**
 * config
 * @param  {Object} options config
 */
function config(options) {
  extend(defaluts, options);
}

module.exports.config = config;
module.exports.get = get;

//////////////////////////////
