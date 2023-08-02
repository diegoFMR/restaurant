function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
  }

  function validHhMm(time) {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);

  }

  function dateToString(date) {
    return `${date.getFullYear()} ${date.getMonth()} ${date.getDay()}`;

  }
  module.exports = {
    isValidDate, validHhMm, dateToString
  }