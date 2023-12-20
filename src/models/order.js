const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  datetime: Date,
  totalfee: Number,
  services: [
    {
      id: String,
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
