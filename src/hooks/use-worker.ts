import { useEffect, useRef } from "react";

export function useWorker<TReq, TRes>(createWorker: () => Worker) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = createWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postMessage = (data: TReq): Promise<TRes> => {
    return new Promise<TRes>((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("Worker is not initialized"));
        return;
      }
      worker.onmessage = (e: MessageEvent<TRes>) => resolve(e.data);
      worker.onerror = (e) => reject(e);
      worker.postMessage(data);
    });
  };

  return { postMessage };
}
