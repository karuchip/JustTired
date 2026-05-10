import { useEffect } from "react";
type UsePollingProps = {
  callback:  () => Promise<void>;
  interval: number;
  enabled?: boolean;
}

const usePolling = ({callback, interval, enabled = true}: UsePollingProps) => {
  useEffect(() => {
    if (!enabled) return;

    // 初回実行
    callback();

    const timer = setInterval(callback, interval);

    return () => {clearInterval(timer)}
  }, [enabled, interval]);
};

export default usePolling;
