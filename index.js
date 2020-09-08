import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
  } from 'ask-sdk-core';
  import {
    Response,
    SessionEndedRequest,
  } from 'ask-sdk-model';

  const LaunchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'ようこそ、アレクサスキルキットへ。こんにちは、と言ってみてください。';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('ハローワールド', speechText)
        .getResponse();
    },
  };

  const HelloWorldIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'こんにちは';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('ハローワールド', speechText)
        .getResponse();
    },
  };

  const HelpIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'こんにちは、と言ってみてください。';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('ハローワールド', speechText)
        .getResponse();
    },
  };

  const CancelAndStopIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'さようなら';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('ハローワールド', speechText)
        .withShouldEndSession(true)      
        .getResponse();
    },
  };

  const SessionEndedRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput : HandlerInput) : Response {
      console.log(`次の理由でセッションが終了しました。 ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);
  
      return handlerInput.responseBuilder.getResponse();
    },
  };

  const ErrorHandler : ErrorHandler = {
    canHandle(handlerInput : HandlerInput, error : Error ) : boolean {
      return true;
    },
    handle(handlerInput : HandlerInput, error : Error) : Response {
      console.log(`処理されたエラー：${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('すみません。コマンドを理解できませんでした。もう一度お願いします。')
        .reprompt('すみません。コマンドを理解できませんでした。もう一度お願いします。')
        .getResponse();
    },
  };

  let skill;

exports.handler = async (event, context) => {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
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
};