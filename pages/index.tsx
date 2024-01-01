import "dotenv/config";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import { GetServerSideProps } from "next";
import initMiro from "../services/initMiro";
import apiCall from "../services/apiCall";

const openai = new OpenAI();

interface Props {
  assistant: OpenAI.Beta.Assistants.Assistant;
  authUrl?: string;
}

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({ req }) {
    const { miro } = initMiro(req);

    // redirect to auth url if user has not authorized the app
    if (!(await miro.isAuthorized(""))) {
      return {
        props: {
          boards: [],
          authUrl: miro.getAuthUrl(),
        },
      };
    }

    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions:
        "You are a personal math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });

    return {
      props: {
        assistant,
      },
    };
  };

const updateDatabase = async () => {
  const boardInfo = await window.miro.board.getInfo();
  const params = new URLSearchParams({ boardId: boardInfo.id });
  const items = await apiCall(
    "get",
    `/api/updateDatabase?${params.toString()}`
  );

  console.log(11.32, { items });
};

export default function Main({ authUrl, assistant }: Props) {
  const [message, setMessage] =
    useState<OpenAI.Beta.Threads.Messages.ThreadMessage>();
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("panel")) return;

    window.miro.board.ui.on("icon:click", async () => {
      window.miro.board.ui.openPanel({
        url: `/?panel=1`,
      });
    });

    // const thread = await openai.beta.threads.create();

    // openai.beta.threads.messages
    //   .create(thread.id, {
    //     role: "user",
    //     content:
    //       "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    //   })
    //   .then((message) => {
    //     console.log(11.2, { message });
    //     setMessage(message);
    //   });
  }, []);

  console.log(11.1, { assistant });

  if (authUrl) {
    return (
      <div className="grid wrapper">
        <div className="cs1 ce12">
          <a className="button button-primary" href={authUrl}>
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>AI Assistant</h1>
        <div>123</div>
      </div>
    </div>
  );
}
