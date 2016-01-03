var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require("firebase");
var Parse = require('parse/node').Parse;
Parse.initialize("RpkqLwNpdW138pbu7MYX8RnxFiSrmVO5al297Af3", "BSjfDsbKKgzUGxImQLICwVf6qxpSa94WtWRxow1F");


var Session = require('./Session.js');


var app = express();
var port_number = process.env.PORT || 3000;
var crimsonDatabase = new firebase("https://connect-them-rnd.firebaseio.com/crimson-alpha/");
var server = app.listen(port_number, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log("API app listening at http://%s:%s", host, port);
    
});


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});

// CORS header securiy
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

app.get('/testpost', function (req, res) {
    console.log("GOT GET REQUEST FROM ARDUINO");
    res.end(JSON.stringify({'status': 1}));
});

app.get('/api/test/user', function (req, res) {
    console.log("======TEST REQUEST for ");
    var response = JSON.stringify({"status" : 1,"userId" : userid, "username" : "ABCD", "email": "testuser@iostreamh.com", "devices" : {"count" : 0, "secretkeys" : []} });
    console.log(response);            
    res.end(response);
});

app.post('/api/m25lazi/uno0025', function (req, res) {
    console.log("GOT DATA FROM ARDUINO : "+JSON.stringify(req.body));
    var epochTime = Math.floor((new Date).getTime()/1000); 
    var sensorData = req.body.value;
    crimsonDatabase.child('m25lazi/uno0025/'+epochTime).set(sensorData);
    res.status(202).end();
});

app.post('/api/alpha/:user/:devicesecretkey', function (req, res) {
    console.log("GOT DATA FROM ARDUINO : "+JSON.stringify(req.body));
    
    var username = req.params.user;
    var deviceSecretKey = req.params.devicesecretkey;
    
    var usernameRef = 'crimson/alpha/users/'+username;
    crimsonDatabase.child(usernameRef).once("value", function(snap) {
        console.log(snap.val());
        var data = snap.val();
        if(data){
            if(data.devices[deviceSecretKey]){
                var epochTime = Math.floor((new Date).getTime()/1000); 
                    var sensorData = req.body.value;
                    crimsonDatabase.child('crimson/alpha/devices/'+deviceSecretKey+'/data/'+epochTime).set(sensorData);
                    res.status(202).end();
            }
            else{
                res.status(403).end();
            }
            
        }
        else{
            res.status(403).end();
        }
    });
    
});

app.post('/api/alpha/user1', function (req, res) {
    console.log("GOT DATA FROM ARDUINO : "+JSON.stringify(req.body));
    
    var username = req.body.value;
    
    
    var username = req.params.user;
    var deviceSecretKey = req.params.devicesecretkey;
    
    var usernameRef = 'crimson/alpha/users/'+username;
    crimsonDatabase.child(usernameRef).once("value", function(snap) {
        console.log(snap.val());
        var data = snap.val();
        if(data){
            if(data.devices[deviceSecretKey]){
                var epochTime = Math.floor((new Date).getTime()/1000); 
                    var sensorData = req.body.value;
                    crimsonDatabase.child('crimson/alpha/devices/'+deviceSecretKey+'/data/'+epochTime).set(sensorData);
                    res.status(202).end();
            }
            else{
                res.status(403).end();
            }
            
        }
        else{
            res.status(403).end();
        }
    });
    
});

/*
App id : RpkqLwNpdW138pbu7MYX8RnxFiSrmVO5al297Af3
JS key : BSjfDsbKKgzUGxImQLICwVf6qxpSa94WtWRxow1F
*/



//===================== CRIMSON REQD==============
app.post('/api/alpha/user', function (req, res) {
    console.log("==== CREATE USER REQUEST : "+JSON.stringify(req.body));
    var username = req.body.username;
    var password = req.body.password;
    var emailid = req.body.email;
    var activationCode = req.body.code;
    
    res.cookie('new', "ABCTest");
    res.cookie('new1', "r:l1Isr3Fx40F61Cvpn5yfhVmU6");
    
    validateActivationCode(activationCode, emailid, function(success, errorCode){
        if(success){
            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("email", emailid);
        
            user.signUp(null, {
                success: function(user) {
                    /*{"username":"test2","email":"test2@test2.com","createdAt":"2015-12-30T14:47:55.497Z","sessionToken":"r:Gvx8NdTvqeoNF2ilOZCcZ00y8","updatedAt":"2015-12-30T14:47:55.497Z","objectId":"1hufUtjR7l"}*/
                    console.log(JSON.stringify(user));
                    console.log('USER ID : '+user.id);
                    console.log('SESSION TOKEN : '+user.getSessionToken());
                    
                    res.cookie('session', user.getSessionToken());
                    res.end(JSON.stringify({"status" : 1, "userid" : user.id, "session" : user.getSessionToken()}));
                    
                },
                error: function(user, error) {
                    res.end(JSON.stringify({"status" : 0, "error" : JSON.stringify(error)}));
                }
            });
        }
        else{
            res.end(JSON.stringify({"status" : 0, "error" : "Invalid Activation Code"}));
        }
    });
    
    
    
    
});

app.get('/api/alpha/me', function (req, res) {
    res.cookie('cookietest', 'value', { domain: 'm25lazi.herokuapp.com', secure: true });
    res.cookie('abc', 'new1');
    res.cookie('abcDoubleQuote', 'new1');
    res.cookie('name', 'tobi', {secure: true, httpOnly: false });
    console.log("======SESSION CHECK for "+JSON.stringify(req.cookies));
    var session = new Session();
    session.verify(req.cookies.session, function(success){
        if(success){
            console.log(JSON.stringify({ "userId" : session.user }));
            res.end(JSON.stringify({"status" : 1,"userId" : session.user }));
        }
        else{
            console.log("Session invalid");
            res.clearCookie('session');
            res.end(JSON.stringify({"status" : 0}));
        }
    });
});

app.get('/api/alpha/user/:userid', function (req, res) {
    var userid = req.params.userid;
    console.log("======PROFILE REQUEST for "+userid);
    var query = new Parse.Query(Parse.User);
    query.get(userid, {
        success: function(user) {
            console.log('Got profile from Parse : '+JSON.stringify(user));
            
            getDevicesForUser(userid, function(success, devices){
                console.log('Got device list from FireBase');
                console.log('status : '+success);
                console.log('devices count : '+ devices.length);
                console.log('devices : '+ devices);
                
                var response = JSON.stringify({"status" : 1,"userId" : userid, "username" : user.getUsername(), "email": user.getEmail(), "devices" : {"count" : devices.length, "secretkeys" : devices} });
                console.log(response);
                res.end(response);
            });
            
        },

        error: function(object, error) {
            var response = JSON.stringify({"status" : 0, "error" : error});
            console.log(response);
            res.end(response);
        }
    });
});

app.post('/api/alpha/devices', function (req, res) {
    console.log("==== CREATE DEVICE REQUEST : "+JSON.stringify(req.body));
    
    isSessionValidForToken(req.cookies.session, function(valid, userid){
        if(valid){
            getUserDetailsFromId(userid, function(success, user){
                if(success){
                    var username = user.getUsername();
                    canCreateDeviceForUser(username, function(canCreate){
                        if(canCreate){
                            var deviceSecret = req.body.devicesecret;
                            var syncInterval = req.body.syncinterval;
                            createDeviceForUser(username, deviceSecret, function(created, errorcode){
                                if(created){
                                    var response = JSON.stringify({"status" : 1});
                                    console.log(response);
                                    res.end(response);
                                }
                                else{
                                    var response = JSON.stringify({"status" : 0, "error" : errorcode});
                                    console.log(response);
                                    res.end(response);
                                }
                            });
                        }
                        else{
                            var response = JSON.stringify({"status" : 0, "error" : "All 3 devices created"});
                            console.log(response);
                            res.end(response);
                        }
                    });
                }
                else{
                    var response = JSON.stringify({"status" : 0, "error" : "Error getting user details"});
                    console.log(response);
                    res.end(response);
                }
                
            });
            
        }
        else{
            var response = JSON.stringify({"status" : 0, "error" : "Session invalid"});
            console.log(response);
            res.end(response);
        }
    });
    
    
    
});


///=======HELPERS

function validateActivationCode(code, email, callback){
    var ActivationCode = Parse.Object.extend("ActivationCode");
    var query = new Parse.Query(ActivationCode);
    query.equalTo("code", code);
    query.equalTo("email", email);
    query.equalTo("codeActivated", false);
    query.count({
        success: function(number) {
            if(number === 0){
                console.log("InValid");
                callback(false, 0);
            }
            else if(number === 1){
                console.log("Valid");
                callback(true, null);
            }
            else{
                console.log("COUNT >1 ???");
                callback(false, 1);
            }
            
        },
        error: function(error) {
            console.log("error : "+JSON.stringify(error));
            callback(false, -1);
        }
    });
};

function isSessionValidForToken(sessionToken, callback){
    var session = new Session();
    session.verify(sessionToken, function(success){
        if(success){
            var userid = session.user;
            callback(true, userid);
        }
        else{
            callback(false, null);
        }
    });
};

//user is Parse Object : "userId" : userid, "username" : user.getUsername(), "email": user.getEmail()
function getUserDetailsFromId(userid, callback){
    var query = new Parse.Query(Parse.User);
    query.get(userid, {
        success: function(user) {
            console.log('Got profile from Parse : '+JSON.stringify(user));
            callback(true, user);
        },

        error: function(object, error) {
            console.log('Error in getting profile : '+ JSON.stringify(error));
            callback(false, null);
        }
    });
}




///=======DEVICES
function canCreateDeviceForUser(username, callback){
    var maxDevicesForUser = 3;
    getDevicesForUser(username, function(success, deviceList){
        if(deviceList.length<=maxDevicesForUser)
            callback(true);
        else
            callback(false);
    });
};

function getDevicesForUser(username, callback){
    var deviceRef = 'crimson/alpha/users/'+username+'/devices';
    crimsonDatabase.child(deviceRef).once("value", function(snap) {
        console.log(snap.val());
        var data = snap.val();
        if(data){
            callback(true, Object.keys(data));
        }
        else{
            callback(false, []);
        }
    });
}

function createDeviceForUser(username, deviceSecret, callback){
    var deviceRefUnderUser = 'crimson/alpha/users/'+username+'/devices/'+deviceSecret;
    crimsonDatabase.child(deviceRefUnderUser).set(true, function(error){
        if(error){
            console.log('Synchronization failed for creating device under user');
            callback(false, -1);
        }
        else{
            
            var deviceRefUnderDevices = 'crimson/alpha/devices/'+deviceSecret+'/createdon';
            var currentEpochTime = Math.floor((new Date).getTime()/1000); 
            console.log('Setting createdon for device : '+currentEpochTime);
            crimsonDatabase.child(deviceRefUnderDevices).set(currentEpochTime, function(error){
                if(error){
                    console.log('Synchronization failed for setting createdon time under devices');
                    callback(false, -2);
                }
                else{
                    callback(true, 0);
                }
            });
        }
    });
    
    
}



/*
HTTP/1.1 404 Not Found
Server: Cowboy
Connection: close
X-Powered-By: Express
Access-Control-Allow-Origin: *
X-Paripadi-Api-Version: 0.0.3.0
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 25
Date: Tue, 15 Dec 2015 14:38:16 GMT
Via: 1.1 vegur

Cannot GET /api/colleges
======================================================
HTTP/1.1 200 OK
Server: Cowboy
Connection: close
X-Powered-By: Express
Access-Control-Allow-Origin: *
X-Paripadi-Api-Version: 0.0.3.0
Date: Tue, 15 Dec 2015 14:39:22 GMT
Content-Length: 241
Via: 1.1 vegur

{"result":[{"collegeId":"2npb8EBOv5","name":"Thangal Kunju Musaliar College of Engineering"},{"collegeId":"LEk6kq9sBd","name":"College of Engineering Trivandrum"},{"collegeId":"0WoP5Yu699","name":"National Institute of Technology Calicut"}]}
======================================================

======================================================

======================================================
*/