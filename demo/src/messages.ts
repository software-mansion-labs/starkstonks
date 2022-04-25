import { useEffect, useRef } from "react";
import { WALLET_URL } from "./config";

type Message = { type: string } & Record<string, any>;
type MessageHandler = (event: Message) => void;

export const useListener = (name: string, handler: MessageHandler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log("orig", event.origin);
      console.log("data", event.data);
      console.log("data", event.data.type);
      if (
        event.origin === WALLET_URL &&
        event.data &&
        event.data?.type === name
      ) {
        handlerRef.current(event);
      }
    };
    window.addEventListener("message", handler, false);
    return () => window.removeEventListener("message", handler);
  }, [name]);
};
