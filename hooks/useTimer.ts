import { useState } from "react";
import Time from "../libs/time";
import useInterval from "./utils/useInterval";

const DEFAULT_DELAY = 1000;

function getDelayFromExpiryTimestamp(expiryTimestamp: number) {
  const seconds = Time.getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
}

/**
 * Example
 * ```
 * const time = new Date()
 * time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
 * const { hours, minutes, seconds, start } = useTimer({ expiry: time.getTime() })
 * ```
 */
export default function useTimer(expiry: number, onExpire: () => void = () => {}) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
  const [seconds, setSeconds] = useState(Time.getSecondsFromExpiry(expiryTimestamp));
  const [isRunning, setIsRunning] = useState(false);
  const [didStart, setDidStart] = useState(false);
  const [isExpire, setIsExpire] = useState(false);
  const [delay, setDelay] = useState(getDelayFromExpiryTimestamp(expiryTimestamp));

  function restart(newExpiryTimestamp: number, start = true) {
    setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
    setDidStart(start);
    setIsRunning(start);
    setIsExpire(false);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(Time.getSecondsFromExpiry(newExpiryTimestamp));
  }

  const handleExpire = () => {
    setIsRunning(false);
    setIsExpire(true);
    setDelay(expiryTimestamp);
    if (onExpire) {
      onExpire();
    }
  };

  const resume = () => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + (seconds * 1000));
    restart(time.getTime());
  };

  const reset = (newExpiryTimestamp: number) => {
    restart(newExpiryTimestamp, false);
  };

  const stop = () => setIsRunning(false);
  const start = () => {
    if (didStart) {
      setSeconds(Time.getSecondsFromExpiry(expiryTimestamp));
      setIsRunning(true);
    } else {
      resume();
    }
  };

  useInterval(() => {
    if (delay !== DEFAULT_DELAY) {
      setDelay(DEFAULT_DELAY);
    }
    const secondsValue = Time.getSecondsFromExpiry(expiryTimestamp);
    setSeconds(secondsValue);
    if (secondsValue <= 0) {
      handleExpire();
    }
  }, isRunning ? delay : undefined);

  return {
    ...Time.getTimeFromSeconds(seconds),
    totalSeconds: seconds,
    start,
    stop,
    reset,
    resume,
    restart,
    didStart,
    isRunning,
    isExpire,
  };
}
