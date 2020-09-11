const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');

const dynamoDbAdapter = new DynamoDbPersistenceAdapter({ tableName : 'peopleTable', createTable : true })

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    // DynamoDB test
    const attributesManager = handlerInput.attributesManager;
    attributesManager.setPersistentAttributes({"counter":10}); 
    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak('おはようございます。今日のスピーチ当番は？と話しかけることで、今日のスピーチ当番を確認することができます。')
      .reprompt('今日のスピーチ当番は？と聞いてみてください。')
      .getResponse();
  }
};

const TodaySpeechIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TodaySpeechIntent';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const s3Attributes = await attributesManager.getPersistentAttributes();

    return handlerInput.responseBuilder
      // DynamoDB test
      .speak(`今日の当番はnagaiさんです。カウンターは${s3Attributes.counter}です。`)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = '今日の当番は？と言ってみてください。';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('さようなら。明日の当番はosakaさんです。')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //クリーンアップロジックをここに追加します
    return handlerInput.responseBuilder.getResponse();
  }
};

let skill;

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`処理されたエラー： ${error.message}`);

    return handlerInput.responseBuilder
      .speak('すみません。理解できませんでした。もう一度お願いします。')
      .reprompt('すみません。理解できませんでした。もう一度お願いします。')
      .getResponse();
  },
};

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        TodaySpeechIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .withPersistenceAdapter(dynamoDbAdapter)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};