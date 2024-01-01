import { NextApiRequest } from "next";

export type NextApiRequestWithMiro = NextApiRequest & {
  rawHeaders: NextApiRequest["rawHeaders"] & {
    miro_tokens: string;
  };
};
