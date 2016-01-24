/**
 * Particle.io account information
 * Replace these with your particle.io device id and access token
 */
var deviceId = "put-your-particle.io-device-ID-here";
var accessToken = "put-your-particle.io-access-token-here";

/**
 * Particle.io cloud function
 * The Arduino sketch specifies the REST URI when it makes
 * the particle.function()
 * For example, particle.function("myFunction", myFunction)
 * would be specified as: var cloudName = "myFunction"
 * You can leave this "myFunction", or change it later
 * if you change the sketch code.
 */
var cloudName = "myFunction";

/**
 * Update skillName and invocationName to match the values
 * that you specify in the Alexa Skill Kit.
 * These are only used in responses from Alexa.
 */
var skillName = "Particle"
var invocationName = "Particle";

/**
 * App ID for the skill
 * Update and use this if/when you publish your skill publicly.
 * It's ok to leave this undefined until then.
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 * Particle is a child of AlexaSkill.
 */
var http = require('https');
var AlexaSkill = require('./AlexaSkill');
var Particle = function () {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Particle.prototype = Object.create(AlexaSkill.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log(invocationName + "onSessionStarted requestId: " + sessionStartedRequest.requestId
         + ", sessionId: " + session.sessionId);
     // any initialization logic goes here
};

Particle.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log(invocationName + " onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  var speechOutput = "Welcome to " + skillName + ", you can tell me to turn on or off";
  var repromptText = "You can tell me to turn on or off";
  response.ask(speechOutput, repromptText);
};

Particle.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log(skillName + " onSessionEnded requestId: " + sessionEndedRequest.requestId
           + ", sessionId: " + session.sessionId);
  // any cleanup logic goes here
};

Particle.prototype.intentHandlers = {
  // Register custom intent handlers.
  // This simple skill only uses one, but more can be added.
  "ParticleIntent": function (intent, session, response) {
    var requestURI = "/v1/devices/" + deviceId + "/" + cloudName;

 		var commandSlot = intent.slots.command;
 		var command = commandSlot ? intent.slots.command.value : "";
 		var speakText = "";

    console.log("Command = " + command);

 		// Verify that a command was specified.
    // We can extend this to prompt the user,
    // but let's keep this simple for now.
 		if(command.length > 0){

      var postData = "args=" + command;
      console.log("Post data = " + postData);

 		  makeParticleRequest(requestURI, postData, function(resp){
 		    var json = JSON.parse(resp);
 		    console.log(command + ": " + json.return_value);
 		    response.tellWithCard(skillName, invocationName, "Thing is " + command );
 	    });
 		} else {
 			response.tell("I don't know whether to turn thing on or off.");
 		}
  }, // ParticleIntent

  "AMAZON.HelpIntent": function (intent, session, response) {
    response.ask("You can tell " + invocationName + " to turn on or off.");
  } // HelpIntent
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  var particleSkill = new Particle();
  particleSkill.execute(event, context);
};

function makeParticleRequest(requestURI, postData, callback){
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
 	};

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
 	req.write(postData.toString());
 	req.end();
}
