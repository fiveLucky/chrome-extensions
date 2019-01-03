
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';



export const today = () => moment().format(dateFormat);
export const now = () => moment().format(timeFormat);

export const lastHalfHour = () => moment().format(dateFormat);




export const encode = (string) => {
  return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code + 1)).join('');
};
export const decode = (string) => {
  return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code - 1)).join('');
};