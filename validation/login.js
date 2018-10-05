const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  //Testto check if name field is left blank before assigning value to data.name
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';


  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is is invalid';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
