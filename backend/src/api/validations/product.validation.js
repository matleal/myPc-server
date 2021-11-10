const Joi = require('joi');

module.exports = {

  // POST /v1/product
  createProduct: {
    body: {
      title: Joi.string().required(),
      description: Joi.string(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      image: Joi.string(),
      userId: Joi.string(),
    },
  },

};
