import React, { useState } from "react";
import { Box, Text, Button, Textarea } from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import {
  useAutoResizer,
  useSDK,
  useFieldValue,
} from "@contentful/react-apps-toolkit";
import { createClient } from "../lib/openai";

const Field = () => {
  useAutoResizer();
  const sdk = useSDK<FieldExtensionSDK>();
  const OUTPUT_FILED_ID = sdk.parameters.instance.outputFiledId;
  const openai = createClient({
    organization: sdk.parameters.instance.openaiOrganization,
    apiKey: sdk.parameters.instance.openaiApiKey,
  });

  const [inputText, setInputText] = useFieldValue<string>();
  const [, setOutputText] = useFieldValue<string>(OUTPUT_FILED_ID);
  const [isLoading, setIsLoading] = useState(false);

  const generateComment = async () => {
    if (!inputText) return;

    setIsLoading(true);

    console.log(inputText);

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputText }],
      });
      console.log(response);
      setOutputText(response.data.choices[0].message?.content ?? "");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Textarea
        defaultValue={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Box marginBottom="spacingXs">
        <Text fontColor={"gray600"} fontWeight={"fontWeightMedium"}>
          {`ChatGPTへのインプットを入力してボタンを押下してください`}
        </Text>
      </Box>
      <Box>
        <Button
          variant="secondary"
          isLoading={isLoading}
          isDisabled={!inputText || !!isLoading}
          onClick={generateComment}
        >
          {"Generate"}
        </Button>
      </Box>
    </>
  );
};

export default Field;
