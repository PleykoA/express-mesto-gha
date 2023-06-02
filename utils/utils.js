const RegExp = /^(ftp|http|https):\/\/[^ "]+$/;

const allowedCors = [
  'http://pleykoa.nomoredomains.monster',
  'https://pleykoa.nomoredomains.monster',
  'localhost:3000',
];

module.exports = {
  RegExp,
  allowedCors,
};
