const RegExp = /https?:\/\/(www\.)?[\w-@:%.\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w-.~:/[?%#@!\]$&'()*+,;=]*)/;

const cors = [
  'http://pleykoa.nomoredomains.monster',
  'https://pleykoa.nomoredomains.monster',
  'localhost:3000',
];

module.exports = {
  RegExp,
  cors,
};
