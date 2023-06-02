const RegExp = /https?:\/\/(www\.)?[\w-@:%.\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w-.~:/[?%#@!\]$&'()*+,;=]*)/;
const allowedCors = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = {
  RegExp,
  allowedCors,
};
