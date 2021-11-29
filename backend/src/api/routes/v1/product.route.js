/* eslint-disable max-len */
const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const controller = require('../../controllers/product.controller');
const userController = require('../../controllers/user.controller');
const { authorize } = require('../../middlewares/auth');

const { createProduct } = require('../../validations/product.validation');
const { authorize, ADMIN } = require('../../middlewares/auth');

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
  .post(authorize(), upload.single('image'), validate(createProduct), controller.create);

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
  .get(authorize(ADMIN), controller.list);

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
  .get(controller.get);

module.exports = router;
