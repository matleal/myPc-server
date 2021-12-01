const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  whatsappContact: String,
  adress: {
    type: String,
    required: true,
  },
  image: String,
  userId: String,
});

module.exports = mongoose.model('Products', ProductSchema);
