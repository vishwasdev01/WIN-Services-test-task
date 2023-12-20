const Order = require("../models/order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error,"errrr");
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createOrder = async (req, res) => {
  const { id, datetime, totalfee, services } = req.body;
  try {
    if (!id || !datetime || !totalfee || !services) {
      res.status(400).json({ error: 'Validation failed' });
    } else {
      const existingOrder = await Order.findOne({ id });
      if (existingOrder) {
        res.status(400).json({ error: 'Order with the same ID already exists' });
      } else {
        const newOrder = new Order({ id, datetime, totalfee, services });
        await newOrder.save();
        res.status(201).json(newOrder);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { datetime, totalfee, services } = req.body;
  try {
    const order = await Order.findById(id);
    if (order) {
      order.datetime = datetime;
      order.totalfee = totalfee;
      order.services = services;
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (order) {
      await order.remove();
      res.status(200).send({message:'Order deleted'});
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
