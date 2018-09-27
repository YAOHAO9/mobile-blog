import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';
moment.updateLocale('zh-cn', momentLocale);

export const fromNow = (date) => {
  moment.locale('zh-cn');
  return moment(date).fromNow();
};