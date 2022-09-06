export default class Time {
  static getExpiry(expirySeconds: number) {
    const now = new Date();

    now.setSeconds(now.getSeconds() + expirySeconds);
    return now.getTime();
  }

  static getTimeFromSeconds(secs: number) {
    const totalSeconds = Math.ceil(secs);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return {
      seconds,
      minutes,
      hours,
      days,
    };
  }

  static getSecondsFromExpiry(expiry: number, shouldRound?: boolean | undefined) {
    const now = new Date().getTime();
    const milliSecondsDistance = expiry - now;
    if (milliSecondsDistance > 0) {
      const val = milliSecondsDistance / 1000;
      return shouldRound ? Math.round(val) : val;
    }
    return 0;
  }

  static getSecondsFromPrevTime(prevTime: number, shouldRound?: boolean | undefined) {
    const now = new Date().getTime();
    const milliSecondsDistance = now - prevTime;
    if (milliSecondsDistance > 0) {
      const val = milliSecondsDistance / 1000;
      return shouldRound ? Math.round(val) : val;
    }
    return 0;
  }
}
