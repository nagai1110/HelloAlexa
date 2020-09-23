import {VirtualAlexa} from "virtual-alexa";
import {handler} from "../src/index";

const alexa = VirtualAlexa.Builder()
  .handler(handler)
  .interactionModelFile("./interaction_models/model_ja-JP.json")
  .create();

describe("LaunchTest", () => {
  it ("Launch", async () => {
    const launchResponse = await alexa.launch();
    expect(launchResponse.response.outputSpeech.ssml).toContain( "今日のスピーチ当番は？と話しかけることで、今日のスピーチ当番を確認することができます。");
  });
});