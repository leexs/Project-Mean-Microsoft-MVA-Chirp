var Validator  = require("validatorjs");

module.exports = function(data){

var regexU = "regex:/^[a-zA-Z0-9]{5,20}$/";
var regexP = "regex:/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])([a-zA-Z0-9_\\-\\$!@#%&]{8,20})$/";

var rules = {
    username: ['required', regexU],
    password: ['required', regexP]
};

var validation = new Validator(data, rules);

return validation.passes();
}