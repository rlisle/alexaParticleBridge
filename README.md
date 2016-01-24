# alexaParticleBridge

AlexaParticleBridge provides instructions and sample code to connect an
Amazon Echo to a Particle.io compatible Arduino using Alexa spoken
voice commands.

This will let you "talk" to your Amazon Echo, and use what you say to
invoke a function running on an Arduino.

I've used information from a several sources, including the Amazon developer doc,
a [one hour tutorial](https://developer.amazon.com/public/community/post/TxDJWS16KUPVKO/New-Alexa-Skills-Kit-Template-Build-a-Trivia-Skill-in-under-an-Hour)
by Kevin Utter, the [Particle_Alexa package on GitHub]( https://github.com/krvarma/Particle_Alexa)
by Krishnaraj Varma, and some collaboration with my buddies Dan, Don and Sean.
Thanks, guys!

My intent is to fill in some gaps, provide answers to some puzzles that
we ran into, and provide an easy to use template for projects.

## What you will need

1. A free Amazon Web Services (AWS) account
1. A free account on the Amazon developer portal
1. A free Particle.io account
1. A Particle.io compatible Arduino, such as the Photon or Oak

I recommend the Particle.io Photon, which is $19 as of January, 2016.

I'm also looking forward to completion of the Digistump Oak,
which will cost only $10 each, and promises Particle.io support.

The Alexa Skills Kit provides a simulator to help testing your code.
This allows you to type what you would say, instead of talking to an
actual Echo device. You will need an Amazon Echo to actually speak to.
But this allows anyone to experiment with Alexa support, even if they
don't own or have access to an Echo.

## Create an AWS Account

An AWS account is free, but you will need a valid credit card to setup
an account.
1. Go to aws.amazon.com and choose Create a Free AWS Account.
2. Follow the instructions. Don't worry about the IAM role,
we'll do that later.
2. You'll need to enter your credit card info, even though this is a
free tier.
2. Follow the confirmation process to activate your account.
1. Sign into the Console
2. It may take awhile for your new account to become active.
2. You will receive an email when your account is activated

## Create a free Amazon Develop Portal account

1. Go to developer.amazon.com and then select Alexa
1. Select Create Free Account (in the upper right)
2. Follow the instructions to create your account

## Connect Particle.io to your arduino

If you haven't already associated your Arduino with your particle.io account,
you'll need to do so. This should be very simple.
Refer to the particle.io help if you run into any problems:
1. Power-up your new particle
2. Go to your particle.io dashboard and connect to the new device

## Create a free particle.io account

1. Go to the [particle.io dashboard](https://dashboard.particle.io)
2. Select Signup for an account

## Starting with a Simple Skill

Amazon has named code that extends Alexa a "Skill", as opposed to an "app"
or a "program". For this example, we're going to create a simple skill,
keeping it about as simple as possible.
Once you know how to get something simple working, I think that you will
find it easy to extend to handle more complex interactions.

So what we're going to build is an Alexa Skill that can
respond to a few simple on/off commands. We will enable our skill to
understand the following sentences:

* "Alexa, tell **Particle** to **turn on**"
* "Alexa, ask **Particle** to **turn off**"

## Wake Word

In order to interact with Echo, the user must first wake it up.
This is done by speaking the word "Alexa". Once awoken, Alexa then
listens for an invocation name to select the skill to invoke.

## Invocation Name

So the first thing that a skill needs is an invocation name.
In the above example, the invocation name is **Particle**.
It is the thing that causes Alexa to launch our Skill.
The Amazon Doc [Choosing the Invocation Name for an Alexa
Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill)
provides a lot of information about choosing a good invocation name,
but basically it needs to be several syllables long, and best if not
similar to words that Alexa already recognizes as a command.
So the word "Particle" is pretty good, since it is fairly unique and
3 syllables. But using the word "weather" would not be good because
Alexa already responds to that word.

## Creating an Alexa Skill

So now that your accounts are setup, and you've decided what invocation
name to use, we're ready to go ahead an create a new Alexa Skill that
will invoke a function on our Photon. You'll need to do 4 things:

1. Create a web service that will process the voice input
  * We'll create an AWS lambda function to do this.
  * Don't worry, this will be mostly cut-and-paste, with a couple edits
  to provide your own specific account information.
2. Use the Alexa Skill Kit portal to configure our Alexa skill
  * List the sentences that Alexa will recognize
  * Provide lists of any variable information we want to use in our sentences.
  For example, the words "on" and "off" in our example.

## Create an AWS Lambda Function

This is probably the most difficult part of this process.
I've tried to simplify it as much as possible.
I recommend that you keep it simple until everything is working,
and only then go back and make any desired modifications.

The first step will be to edit the javascript files included in
this package to add your particular account and device information.
then you'll need to upload them to your AWS account.

### Editing the Javascript Files

The javascript files are located in the ASK folder of the repository.
1. The AlexaSkill.js file is boiler plate code, and does not
   need to be edited at all.
2. Open index.js
3. Near the top of this file are 2 lines that must be edited:
  * Locate the [Device ID](https://dashboard.particle.io/user/devices)
  for your particle.io Arduino device
  and copy it into the ***deviceId = "<...>"*** between the double-quote marks.
  * Locate your Particle.io [access token](https://build.particle.io) in the
  build settings section and copy it into
  the ***accessToken = "<...>"*** line between the double-quote marks.
4. Now save your changes, and zip both files up in a single archive file.
  You'll need the archive file in the next section.

### Configure the Lambda Function

1. Sign into your AWS account console
2. Select ***US East (N. Virginia)*** region (upper right)
3. Select ***lambda*** in compute services.
4. Select the ***Skip*** button in the bottom right to skip
selecting a blueprint.
This should take you to the "Configure Function" screen.
5. Enter a ***Name*** and ***Description*** of your choosing.
6. Set Runtime to ***node.js***
7. Set Code entry type to ***Upload a .ZIP file***
8. Click the ***Upload*** button, and select the archive file
   containing the javascript files you edited in the previous
   section.
9. Select ***Next***
10. Select ***Create Function***
    Now that you've created the function, this page will appear
    different when you come back later. You can upload new code,
    but a Save button will appear in the top left instead of the
    Create Function button in the bottom right.
11. Select the ***Configuration*** tab
  * Leave handler as ***"index.handler"***
  * Set role to ***lambda_basic_execution***
  * Enter a description as you wish
12. You will be prompted for an IAM role if not previously done
  * Leave the Advanced settings as default, and select ***Next***
  * Select ***Create your Function***
13. Select the ***Event sources*** tab
  * Select ***Add event source***
  * Select type ***Alexa Skill Kit***
14. Copy the ARN information displayed in the upper right.
It should look something like
"arn:aws:lambda:us-east-1:123456789012:function:ParticleExample"
Copy everything after the leading "ARN -".
We'll paste that into the Alexa portal in the upcoming steps.
I recommend that you leave this page open so you can copy
the ARN later when it is needed.

**Congratulations!** You've completed the part that I found most difficult.
Hopefully it was easier for you.

## Setup Skill in the Develop Portal

Now you will tell Alexa about the sentences you want it to
recognize, and provide the link to the lambda function just created.

1. Sign into the
[Alexa Skills Kit Portal](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit)
by selecting ***SIGN IN*** in the upper right.
2. Select the ***APPS & SERVICES*** tab
3. Select ***Alexa*** in the horizontal menu near the top.
4. Select the ***Alexa Skills Kit*** Get Started button.
You may want to bookmark this page.
5. Select ***Add a New Skill***
6. Provide a name of your choosing (eg. "Particle")
7. Provide the invocation name "Particle"
8. Provide a version number of your choosing (eg. "1.0")
9. Set the Endpoint to ***Lambda ARN (Amazon Resource Name)***
10. Copy into the Endpoint field the ARN that you previously copied.
You can go back to the AWS console and copy it again if needed,
or if you copied the wrong text.
11. Click ***Next***
    You may receive an error here if the lambda function event source
    wasn't set to Alexa Skills Kit. Go back to AWS and do so, then try
    Next again.

### Interaction Model
The above steps should result in display of the Interaction Model page.
This is where we will define the things that we can say to Alexa.

1. Copy and paste the contents of the IntentSchema.json file from the
   speechAssets folder into the Intent Schema section.
2. Select ***Add Slot Type***
3. Enter Type ***LIST_OF_COMMANDS***
4. Enter the values
  * ParticleIntent on
  * ParticleIntent off
  Ensure that each is entered onto its own line.
5. Select OK
6. Copy the text below (or from the SampleUtterances.txt file)
   into the Sample Utterances section.
    **Sample Utterance**
    ParticleIntent {command}
    ParticleIntent turn {command}
    ParticleIntent to turn {command}
    ParticleIntent thing {command}
    ParticleIntent turn thing {command}
    ParticleIntent to turn thing {command}
7. Select ***Next***

And this will bring you to the test page. You're ready to test your new skill.

**Testing Your Skill**

There are several ways to test the new skill.

* Enter text into the **Enter Utterance** field on the Alexa test page.
* If you have an Echo, and it is associated with your account, you can test
right away by speaking "Alexa, tell Particle to turn on"

## Debugging

There are a couple tools available for debugging:

* Alexa Skills Kit Test Page***
You can use the Alexa Skills Kit test page to Enter Utterances, and view the
JSON that is sent to and received from the Lambda function.

* AWS CloudWatch
From the AWS Lambda Functions page for your Lambda function, select the
Monitoring tab, then click ***View logs in CloudWatch***.
This will display the console output from the Lambda Function.
Be observant of the timestamps of the logs.
You will probably need to refresh each time you rerun the test.
Note that sometimes logs are grouped together, so instead of generating
a new timestamped log, the entries are put into the bottom of the previous log.

* Arduino Console output
Connect a USB cable to the Arduino and write debug comments in your sketch.
Even though the Arduino can be programmed using WiFi,
it still requires a USB cable to view console output.

### References

* [One Hour Tutorial](https://developer.amazon.com/public/community/post/TxDJWS16KUPVKO/New-Alexa-Skills-Kit-Template-Build-a-Trivia-Skill-in-under-an-Hour)
* [Particle_Alexa package on GitHub](https://github.com/krvarma/Particle_Alexa)
* [Amazon AWS](https://aws.amazon.com)
* [Alexa Skills Kit Portal](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit)
* [Choosing the Invocation Name for an Alexa
Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill)
* [Particle.io Dashboard](https://dashboard.particle.io)
