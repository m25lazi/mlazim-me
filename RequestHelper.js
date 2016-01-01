/*
Requests/RequestHelper.js
26-sep-2015
m25lazi
*/

var request = require('request');

// Public RequestHelper APIs
var RequestHelper = {
    
};


//callback(error, response, body)
RequestHelper.postDataToUrl = function(url, dataDictionary, headers, callback){
    
     var options = {
        url     : url,
        method  : "POST",
        body    : JSON.stringify(dataDictionary),
        headers : headers
    };
    
    if(!callBackVerifier(callback)){
        callback = null;
    }
    
    request(options, callback);
    
};

RequestHelper.getDataFromUrl = function(url, headers, callback){
    
     var options = {
        url     : url,
        method  : "GET",
        body    : JSON.stringify({}),
        headers : headers
    };
    
    if(!callBackVerifier(callback)){
        callback = null;
    }
    
    request(options, callback);
    
};

RequestHelper.putDataToUrl = function(url, dataDictionary, headers, callback){
    console.log('===========REQUEST HANDLER LOGS========');
    console.log('url : '+ url);
    console.log('headers : '+ JSON.stringify(headers));
    console.log('data : '+ JSON.stringify(dataDictionary));
     var options = {
        url     : url,
        method  : "PUT",
        body    : JSON.stringify(dataDictionary),
        headers : headers
    };
    
    if(!callBackVerifier(callback)){
        callback = null;
    }
    
    request(options, callback);
    
};





//Helpers

var callBackVerifier = function(callback){
    if (callback && typeof callback == "function")
        return true;
    else
        return false;
};


module.exports = RequestHelper;