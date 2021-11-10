const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Product = require('../models/product.model');

/**
 * Create Product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Product(req.body);
    // entity.userId = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List Products
 * @public
 */
// eslint-disable-next-line consistent-return
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await Product.find(query).sort({ title: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']));

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};