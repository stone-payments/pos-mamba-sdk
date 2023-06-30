export default (System) => {
  const initDate = new Date();

  const time = {
    hours: String(initDate.getHours()).padStart(2, '0'),
    minutes: String(initDate.getMinutes()).padStart(2, '0'),
  };

  System.getCurrentTime = () => time;

  const timer = () => {
    let hours = Number.parseInt(time.hours, 10);
    let minutes = Number.parseInt(time.minutes, 10);

    minutes++;
    if (minutes === 60) {
      hours++;
      if (hours === 24) {
        hours = 0;
      }
      minutes = 0;
    }

    time.hours = String(hours).padStart(2, '0');
    time.minutes = String(minutes).padStart(2, '0');

    System.fire('clock', time.hours, time.minutes);

    return timer;
  };

  setTimeout(() => setInterval(timer(), 60000), (60 - initDate.getSeconds()) * 1000);
};
