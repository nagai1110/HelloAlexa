import { HandlerInput, RequestHandler, Skill, SkillBuilders } from 'ask-sdk';
// import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter';

// const dynamoDbAdapter = new DynamoDbPersistenceAdapter({ tableName : 'peopleTable', createTable : true })

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak('おはようございます。今日のスピーチ当番は？と話しかけることで、今日のスピーチ当番を確認することができます。')
      .reprompt('今日のスピーチ当番は？と聞いてみてください。')
      .getResponse();
  }
};

const TodaySpeechIntentHandler: RequestHandler  = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TodaySpeechIntent';
  },
  async handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      // DynamoDB test
      .speak(`今日の当番はnagaiさんです。`)
      .getResponse();
  }
};

const HelpIntentHandler: RequestHandler  = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput: HandlerInput) {
    const speechText = '今日の当番は？と言ってみてください。';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler: RequestHandler  = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak('さようなら。明日の当番はosakaさんです。')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler: RequestHandler  = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput: HandlerInput) {
    //クリーンアップロジックをここに追加します
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error) {
    console.log(`処理されたエラー： ${error.message}`);

    return handlerInput.responseBuilder
      .speak('すみません。理解できませんでした。もう一度お願いします。')
      .reprompt('すみません。理解できませんでした。もう一度お願いします。')
      .getResponse();
  },
};

let skill: Skill;
export const handler = async (event: any, context: any): Promise<any> => {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        TodaySpeechIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
}
