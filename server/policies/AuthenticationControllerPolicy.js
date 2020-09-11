const { check, validationResult } = require("express-validator");
const joi = require("joi");

module.exports = (req, res, next) => {
  {
    const schema = joi
      .object({
        email: joi.string().email(),
        password: joi
          .string()
          .regex(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_=;,<>!~?@#$%^&*])(?=.{8,})"
            )
          )
          .required(),
        repeat_password: joi.ref("password"),
        name: joi
          .string()
          .min(3)
          .max(20)
          .regex(new RegExp("^[a-zA-Z]+(([' ][a-zA-Z ])?[a-zA-Z]*)*$"))
          .required(),
        username: joi
          .string()
          .min(5)
          .max(20)
          .regex(
            new RegExp("^(?!.*[_.]{2,})(?=^[^_.].*[^_.]$)[a-zA-Z](w|.){4,20}$")
          )
          .required()
      })
      .with("password", "repeat_password");
    const { error, value } = schema.validate(req.body);
    if (error) {
      switch (error.details[0].context.key) {
        case "email":
          res.status(400).send({
            error: "Email is not valid."
          });
          break;
        case "password":
          res.status(400).send({
            error:
              "Password must be at least 8 charachters long, contains small leter, capital letter, number and one special charachter."
          });
          break;
        case "name":
          res.status(400).send({
            error:
              "Name can contain only charachters and spaces. Must be at least 3 and maximum 20 charachters long."
          });
          break;
        case "repeat_password":
          res.status(400).send({
            error: "Password and reapeat password must match"
          });
          break;
        case "username":
          res.status(400).send({
            error: "Username must be between 5 and 20 charachters long."
          });
          break;
        default:
          res.status(400).send({
            error: "Error in validation."
          });
          break;
      }
    } else {
      next();
    }
  }
};
