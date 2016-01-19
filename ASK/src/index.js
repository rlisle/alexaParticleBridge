/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Replace these with action device id and access token
var deviceid = "<your-unique-value-here>";
var accessToken = "<your-unique-value-here>";

/**
 * The AlexaSkill prototype and helper functions
 */

var http = require('https');
var AlexaSkill = require('./AlexaSkill');

/*
 *
 * Particle is a child of AlexaSkill.
 *
 */
var Particle = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Particle.prototype = Object.create(AlexaSkill.prototype);
Particle.prototype.constructor = Particle;

//Particle.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
//    console.log("Particle onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
//};

// Particle.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
//     console.log("Particle onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
//     var speechOutput = "Hola! What would you like to control?";
//
//     response.ask(speechOutput);
// };

// Particle.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
//     console.log("Particle onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
// };

Particle.prototype.intentHandlers = {
  // register custom intent handlers
  MyIntent: function (intent, session, response) {
    var requestURI = "/v1/devices/" + deviceid + "/lights";

		var deviceSlot = intent.slots.device;
		var dimmingSlot = intent.slots.dimming;
		var device = deviceSlot ? intent.slots.device.value : "";
		var dimming = dimmingSlot ? intent.slots.dimming.value : "";
		var speakText = "";

    console.log("Device = " + device);
		console.log("Dimming = " + dimming);

		// Verify a device was specified.
		if(device.length > 0){

      // If dimming was specified, do it.
      if(dimming.length == 0){
        dimming = "toggle"
      }
      var postData = "args=" + device + "," + dimming
		  makeParticleRequest(requestURI, device, dimming, function(resp){
		    var json = JSON.parse(resp);
		    console.log(device + ": " + json.return_value);
		    response.tellWithCard(device + " is " + json.return_value);
	    });
		} else {
			response.tell("Sorry, Senor. No comprendo.");
		}
  }, // MyIntent
  BoothLightIntent: function (intent, session, response) {
    var requestURI = "/v1/devices/" + deviceid + "/lights";

		var dimmingSlot = intent.slots.dimming;
		var dimming = dimmingSlot ? intent.slots.dimming.value : "";
		var speakText = "";

		console.log("Dimming = " + dimming);

    // If dimming was specified, do it.
    if(dimming.length == 0){
      dimming = "toggle"
    }
    var postData = "args=booth," + dimming
		makeParticleRequest(requestURI, postData, function(resp){
		    var json = JSON.parse(resp);
		    console.log(device + ": " + json.return_value);
		    response.tellWithCard(device + " is " + json.return_value);
	    });
  }, // BoothLightIntent
  HelpIntent: function (intent, session, response) {
    response.ask("You can tell me to set the dimming level of lights. For example, you can say: My RV, booth lights on.");
  }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Particle skill.
    var particleSkill = new Particle();
    particleSkill.execute(event, context);
};

function makeParticleRequest(requestURI, postData, callback){
	// Particle API parameters
	var options = {
		hostname: "api.particle.io",
		port: 443,
		path: requestURI,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + accessToken,
			'Accept': '*.*'
		}
	}

	console.log("Post Data: " + postData);

	// Call Particle API
	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));

		var body = "";

		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			body += chunk;
		});

		res.on('end', function () {
      callback(body);
    });
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(postData);
	req.end();
}
