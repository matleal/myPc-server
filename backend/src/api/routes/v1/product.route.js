/* eslint-disable max-len */
const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const controller = require('../../controllers/product.controller');
const userController = require('../../controllers/user.controller');

const { createProduct } = require('../../validations/product.validation');
const { authorize } = require('../../middlewares/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// eslint-disable-next-line no-trailing-spaces
const upload = multer({ 
// eslint-disable-next-line object-shorthand
  storage: storage,
  fileSize: 1024 * 1024 * 5,
});

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
/**
  * @api {post} v1/product Create Product
  * @apiDescription Create a new Product
  * @apiVersion 1.0.0
  * @apiName createProduct
  * @apiGroup Product
  * @apiPermission User
  *
  * @apiHeader {String} Authorization  User's access token
  *
  * @apiParam  {Object}                 object   Product object
  *
  * @apiSuccess (Created 201) {Object}  Product        Product
  *
  * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
  * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
  * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
  */
  .post(authorize(), upload.single('image'), validate(createProduct), controller.create)
  /**
   * @api {put} v1/product Update Product
   * @apiDescription Update a Product
   * @apiVersion 1.0.0
   * @apiName updateProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Product id
   * @apiParam  {Object}                 Product     Product object
   *
   * @apiSuccess {String}   _id        Product id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .put(authorize(), upload.single('image'), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/product/all List Products
   * @apiDescription List Products information
   * @apiVersion 1.0.0
   * @apiName ListAllProducts
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product        Product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v1/product/:id Get Product
   * @apiDescription Get Product information
   * @apiVersion 1.0.0
   * @apiName GetProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product        Product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/product/:id Delete Product
   * @apiDescription Delete product of the id
   * @apiVersion 1.0.0
   * @apiName DeleteProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
