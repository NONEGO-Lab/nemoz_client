


export const secondsToTime = (time) => {
  //sec 은 180, 혹은 50 등
  let min;
  let sec;

  if(time >= 60) {
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
  } else {
    min = 0;
    sec = time;
  }

  if(min < 10) {
    min = `0${min}`;
  }
  if(sec < 10 && sec >= 0){
    sec = `0${sec}`;
  }

  if(time < 0) {
    min = "00";
    sec = "00";
  }

  return `${min} : ${sec}`;
};


export const TimeToSeconds = (time) => {

  let min = Number(time.split(":")[0]);
  let sec = Number(time.split(":")[1]);

  return min * 60 + sec;
}

export const secondsToMins = (sec) => {

  if (sec < 60) return 1
  return Math.floor(sec / 60);
}