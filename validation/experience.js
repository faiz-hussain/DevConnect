const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //Test to check if fields are left blank before assigning values
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title is required';
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company name is required';
  }
  if (Validator.isEmpty(data.location)) {
    errors.location = 'Job location is required';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'Start date is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
