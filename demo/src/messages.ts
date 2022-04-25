import { useEffect, useRef } from "react";
import { WALLET_URL } from "./config";

type Message = { type: string } & Record<string, any>;
type MessageHandler = (event: Message) => void;

export const useListener = (name: string, handler: MessageHandler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
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
