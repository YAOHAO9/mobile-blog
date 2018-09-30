import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';
moment.updateLocale('zh-cn', momentLocale);

export const fromNow = (date) => {
  return moment(date).fromNow();
};

export const fromatChatDate = (date) => {
  const oneMinute = 1000 * 60;
  const now = new Date().getTime();
  let text = '';
  if (now - date <= oneMinute * 60) {
    text = fromNow(date);
  } else {
    const formatYearStr = 'YYYY-';
    const formatMonthStr = 'MM-DD ';
    const formatStr = 'YYYY-MM-DD HH:mm';
    text = moment(date).format(formatStr);
    const year = moment(now).format(formatYearStr);
    if (text.includes(year)) {
      const month = moment(now).format(formatMonthStr);
      text = text.replace(year, '').replace(month, '');
    }
  }
  return text;
};

export const toCaption = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};