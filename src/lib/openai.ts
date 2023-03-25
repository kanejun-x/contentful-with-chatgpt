import { Configuration, OpenAIApi } from "openai";

export const createClient = (param: {
  organization: string;
  apiKey: string;
}) => {
  const configuration = new Configuration({
    organization: param.organization,
    apiKey: param.apiKey,
  });
  return new OpenAIApi(configuration);
};
