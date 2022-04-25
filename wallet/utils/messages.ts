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