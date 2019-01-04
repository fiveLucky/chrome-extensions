
import moment from 'moment';

export const TIME_RANGE = {
  last15Minutes: () => [moment().subtract(15, "minutes"), moment()],
  last30Minutes: () => [moment().subtract(30, "minutes"), moment()],
  last1Hour: () => [moment().subtract(1, "hour"), moment()],
  last3Hours: () => [moment().subtract(3, "hours"), moment()],
  last6Hours: () => [moment().subtract(6, "hours"), moment()],
  lastHalfDay: () => [moment().subtract(12, "hours"), moment()],
  last1Day: () => [moment().subtract(1, "day"), moment()],
  last1Week: () => [moment().subtract(7, "days"), moment()],
};

export const requst = () => {

};





export const encode = (string) => {
  return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code + 1)).join('');
};
export const decode = (string) => {
  return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code - 1)).join('');
};