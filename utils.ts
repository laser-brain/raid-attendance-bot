import { verifyKey } from "discord-interactions";
import { Request, Response } from "express";

export const VerifyDiscordRequest = (clientKey: string) => {
  if (!clientKey) {
    throw new Error("Missing client key");
  }

  return function (req: Request, res: Response, buf: Uint8Array) {
    const signature = req.get("X-Signature-Ed25519") || "";
    const timestamp = req.get("X-Signature-Timestamp") || "";

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res
        .status(401)
        .send(
          "Bad request signature"
        );
      throw new Error("Bad request signature");
    }
  };
};

export const DiscordRequest = async (
  endpoint: string,
  options: RequestInit
) => {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads

  const fetchOptions: RequestInit = {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/laser-brain/raid-attendance-bot, 1.0.0)",
    },
  };
  // Use node-fetch to make requests
  const res = await fetch(url, fetchOptions);

  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
};
