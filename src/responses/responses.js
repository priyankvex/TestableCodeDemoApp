'use strict';

var response;
response = {

  successResponse: function successResponse(res, data, statusCode) {
    return res.json(
        {
          data: data,
          statusCode: statusCode
        }
    )
  }
};

module.exports = response;
