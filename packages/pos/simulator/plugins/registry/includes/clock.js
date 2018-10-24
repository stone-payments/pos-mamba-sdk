export default Registry => {
  const initDate = new Date();

  Registry._clock = {
    hours: String(initDate.getHours()).padStart(2, '0'),
    minutes: String(initDate.getMinutes()).padStart(2, '0'),
  };

  Registry.getCurrentTime = () => Registry._clock;

  const timer = () => {
    let { hours, minutes } = Registry.getCurrentTime();

    minutes++;
    if (minutes === 60) {
      hours++;
      if (hours === 24) {
        hours = 0;
      }
      minutes = 0;
    }

    Registry.clock(
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
    );

    return timer;
  };

  setTimeout(
    () => setInterval(timer(), 60000),
    (60 - initDate.getSeconds()) * 1000,
  );
};
