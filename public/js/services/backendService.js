
app.factory('backendService', ['$q', '$http','$state','$cookies','$cookieStore', function($q, $http, $state, $cookies, $cookieStore) {

  var APP_VERSION = 42;
  var APP_LANGUAGE = 'eng';
  var APP_URL_PARAMS = "";


  function serialize(obj, prefix) {
    if(!obj){
      return'';
    }
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return '?'+str.join("&");
}


  /* Standard ajax success function to be used when no callback is defined. */
  var standardSuccessFunction = function(data, status, headers, config) {
    // console.log("standard success")
  };

  /* Standard ajax fail function always executed when an error occured. */
  var standardFailFunction = function(data, status, headers, config) {
    console.error('Error occured: ' + status + '.');
    if(status == 401){
      $state.go('login');
    }
  };

  /* Standard ajaxRequest takes url to call, data to pass and callbacks to handle the response.
   * Returns a promise to the accessed data.
   * If you want to handle every result of the call use the deferred variable.
   * If you wont to differ actions from success and fail pass callbacks.
   */
  var ajaxPostRequest = function(url, data, successCallback, failCallback) {
    $http.defaults.headers.common.Authorization = 'Bearer '+ ($cookies.get('token') || '');

    successCallback = successCallback ? successCallback : standardSuccessFunction;

    var errorFunction = function(data, status, headers, config) {
      if (failCallback) {
        failCallback(data, status, headers, config);
      }
      standardFailFunction(data, status, headers, config);
    };

    var deferred = $q.defer();

    $http.post(url + APP_URL_PARAMS + '?XDEBUG_SESSION_START=99999', data, { withCredentials: false })
        .success(function(data) {
          successCallback(data);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          errorFunction(data, status, headers, config);
          deferred.reject(data);
        });

    return deferred.promise;
  };

  var ajaxGetRequest = function(url, data, successCallback, failCallback) {
    console.log($cookies)
    successCallback = successCallback ? successCallback : standardSuccessFunction;

    var errorFunction = function(data, status, headers, config) {
      if (failCallback) {
        failCallback(data, status, headers, config);
      }
      standardFailFunction(data, status, headers, config);
    };

    var deferred = $q.defer();

    $http.get(url + serialize(data), { withCredentials: false })
        .success(function(data) {
          successCallback(data);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          errorFunction(data, status, headers, config);
          deferred.reject(data);
        });

    return deferred.promise;
  };

    var ajaxPutRequest = function(url, data, successCallback, failCallback) {

    successCallback = successCallback ? successCallback : standardSuccessFunction;

    var errorFunction = function(data, status, headers, config) {
      if (failCallback) {
        failCallback(data, status, headers, config);
      }
      standardFailFunction(data, status, headers, config);
    };

    var deferred = $q.defer();

    $http.put(url, data, { withCredentials: true })
        .success(function(data) {
          successCallback(data);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          errorFunction(data, status, headers, config);
          deferred.reject(data);
        });

    return deferred.promise;
  };

  return {
    ajaxPostRequest: ajaxPostRequest,
    ajaxGetRequest: ajaxGetRequest,
    ajaxPutRequest: ajaxPutRequest,
  }
}])
