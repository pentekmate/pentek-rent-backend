module.exports=(email)=>{
    const validator = require('validator');
    return validator.isEmail(email)
}