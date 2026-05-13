const { URL } = require('url');

module.exports = {
  format_date: date => {
    const parsedDate = new Date(date);
    return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;
  },
  format_url: url => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  },
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },
  display_user: user => {
    return user?.username || 'deleted user';
  }
};
