const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Product = require('../models/product.model');

/**
 * Create Product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    console.log(req.user);
    console.log(req.body);
    console.log(req.file);
    // eslint-disable-next-line prefer-const
    let entity = new Product(req.body);
    entity.image = `http://localhost:3000/v1/${req.file.filename}`;
    // entity.userId = req.user._id;
    console.log(entity);

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Product
 * @public
 */
// eslint-disable-next-line consistent-return
exports.get = async (req, res, next) => {
  try {
    const entity = await Product.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
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
