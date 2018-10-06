const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  //Test to check if fields are left blank before assigning values
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.current = !isEmpty(data.current) ? data.current : '';


  if (Validator.isEmpty(data.school)) {
    errors.school = 'School name is required';
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree name is required';
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'Start date is required';
  }
  if (Validator.isEmpty(data.current)) {
    errors.current = 'Please indicate if you are currently in school';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
