'use strict';

var response;
response = {

  successResponse: function successResponse(res, data, statusCode) {

    return res.json(statusCode || 200, {
      isError: false,
      success: {
        data: data,
        message: 'Successfully Done!!'
      }
    });
  },

  success: function success(res) {

    res.status_code = 200;

    return res.json(200, {
      isError: false,
      success: {
        message: 'Successfully Done!!'
      }
    });
  },

  // fromHandleError: use case
  // since handledResponse also calling errorResponse function this
  // causes duplication of error log on EFK

  errorResponse: function errorResponse(res, err, statusCode, message, fromHandleError) {

    if (!err || typeof(err)!='object') err = {};
    if (!fromHandleError) {
      if (message) {
        err.message = err.message || message.message || null;
      } else {
        err.message = err.message || null;
      }
      Logger.api_error(res, {}, err);
    }
    return res.json(statusCode, {
      isError: true,
      error: message || err.message
    });
  },

  apiErrorResponse: function apiErrorResponse(res, err){
    return res.json(200, {
      isError: true,
      error: err
    });
  },
  handledResponse: function (res, code, responseData, responseType) {
    return res.json(code, {
      isError: !responseType,
      data: responseData,
      time:new Date()
    });
  },


  handleError: function handleError(res, err) {
    var error = {};
    var code;
    error.err = err;

    if(err && err.stack)
      error.stack = err.stack
    else
      error.stack = new Error().stack;

    if ( !err ) {
      error.message = 'null error';
      code = 422;
    }
    else if ( err.name ) {

      //moongoose error, mail us
      error.message = 'System Err';
      code = 433;
    }
    else if ( err.code ) {
      if( err.code instanceof Object ) {

        //our custom error
        var message = '';
        if (err.code.message == '') {
          if (err.field != '') message = err.field;
        } else {
          if (err.field != '') message = err.field + " " + err.code.message;
          else message = err.code.message;
        }
        error.message = message;
        error.name = err.code.name || '';
        code = err.code.code;
      }
      else {
        error.message = err.message || 'unclassified error';
        code = 500;
      }

    }
    else {

      //time to add something new
      error.message = 'unhandled error';
      code = 455;
    }

    if (code) error.code = code;
    Logger.api_error(res, {}, error);
    Logger.debug('\x1b[36m The error is :: ' + JSON.stringify(error) + '\x1b[0m');
    return response.errorResponse( res, '', code, error, true )
  }
};

module.exports = response;
