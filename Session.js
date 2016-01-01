/*
User/Session.js
4-oct-2015
m25lazi
*/

var requestHelper = require('./RequestHelper.js');

/*
Properties
    objectId    : String
    token       : String <session token>
    user        : String <user id>
*/
function Session() {
  
  this.objectId = null;
  this.token = null;
  this.user = null;
  
}

/*
@params token : object of type String
@params callback : function with signature (success)
*/
Session.prototype.verify = function(token, callback){
    this.token = token;
    
    var sessionUrl = "https://api.parse.com/1/sessions/me"
    var header = {
        "X-Parse-Application-Id"    : "RpkqLwNpdW138pbu7MYX8RnxFiSrmVO5al297Af3",
        "X-Parse-REST-API-Key"      : "9lKpmt9g9jLOJgv1HXljwKtRcMbe5PdAnnGpOMEs",
        "X-Parse-Session-Token"     :  this.token
    };
    
    var requestCallback = function(error, response, body){
        if (body) {
            var bodyDictionary = JSON.parse(body);
            if (bodyDictionary.error) {
                callback(false);
            } else {
                if(bodyDictionary.user && bodyDictionary.user.objectId){
                    this.user = bodyDictionary.user.objectId;
                    callback(true);
                }
                else{
                    callback(false);
                }
            }
        }
        else{
            callback(false);
        }
    }.bind(this);
    
    requestHelper.getDataFromUrl(sessionUrl, header, requestCallback);
};

module.exports = Session;