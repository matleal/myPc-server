const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Product = require('../models/product.model');

/**
 * Create Product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    let entity = new Product(req.body);
    entity.image = `http://localhost:3000/v1/${req.file.filename}`;
    entity.whatsappContact = `https://api.whatsapp.com/send?phone=55${entity.contact}`;
    entity.userId = req.user._id;

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

/**
 * List Products By User Id
 * @public
 */
// eslint-disable-next-line consistent-return
exports.listByUserId = async (req, res, next) => {
  try {
    const querry = { userId: req.user._id };
    let entities = await Product.find(querry).sort({ title: 1 });

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

// eslint-disable-next-line consistent-return
exports.update = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('body acima!');

    const entity = new Product(req.body);
    entity.whatsappContact = `https://api.whatsapp.com/send?phone=55${entity.contact}`;
    entity.userId = req.user._id;

    if (req.file) {
      entity.image = `http://localhost:3000/v1/${req.file.filename}`;
    }

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Product.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    const savedEntity = await Product.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

/**
 * Delete Product
 * @public
 */
// eslint-disable-next-line consistent-return
exports.remove = async (req, res, next) => {
  try {
    const entity = await Product.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }
    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};
