import {useEffect, useRef} from "react";

type MessageHandler = (event: Record<any, any>) => void;

export const useListener = (name: string, handler: MessageHandler) => {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data && event.data?.type === name) {
                handlerRef.current(event);
            }
        }
        window.addEventListener("message", handler, false);
        return () => window.removeEventListener("message", handler)
    }, [name]);
}

export const encode = (obj: Record<string, any>): string => Buffer.from(JSON.stringify(obj)).toString("base64");
export const decode = (value: string): Record<string, any> => JSON.parse(Buffer.from(value, 'base64').toString());