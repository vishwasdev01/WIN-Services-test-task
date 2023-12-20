const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const Order = require('../models/order');

chai.use(chaiHttp);
const { expect } = chai;

describe('Order API', () => {
  beforeEach(async () => {
    await Order.deleteMany({});
  });

  describe('GET /orders', () => {
    it('should get all orders', async () => {
      await Order.create({ id: '1', datetime: new Date(), totalfee: 100, services: [{ id: '123' }] });

      const res = await chai.request(app).get('/orders');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
    });
  });

  describe('GET /orders/:id', () => {
    

      it('should get a single order by ID', async () => {
        const order = await Order.create({ id: '1', datetime: new Date(), totalfee: 100, services: [{ id: '123' }] });
        const res = await chai.request(app).get(`/orders/${order._id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(order.id);
      });
    
      it('should return 404 if order ID is not found', async () => {
        const nonExistentOrderId = '656dbcf991edfc96172f4583';
        const res = await chai.request(app).get(`/orders/${nonExistentOrderId}`);
    
        expect(res).to.have.status(404);  // Correct status code
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Order not found');
      });
    
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = { id: '2', datetime: new Date(), totalfee: 150, services: [{ id: '456' }] };
      const res = await chai.request(app).post('/orders').send(newOrder);
  
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(newOrder.id);
  
      const savedOrder = await Order.findOne({ id: newOrder.id });
      expect(savedOrder).to.not.be.null;
    });
  
    it('should return 400 if required fields are missing', async () => {
      const invalidOrder = { datetime: new Date() };
      const res = await chai.request(app).post('/orders').send(invalidOrder);
    
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Validation failed');
    });    
  });
  


  describe('DELETE /orders/:id', () => {
    it('should delete a single order by ID', async () => {
      
      const order = await Order.create({ id: '3', datetime: new Date(), totalfee: 120, services: [{ id: '789' }] });
      console.log(order,"orderrrr")
      const res = await chai.request(app).delete(`/orders/${order._id}`);


      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Order deleted');

      const deletedOrder = await Order.findById(order._id);
      expect(deletedOrder).to.be.null;
    });

    it('should return 404 if order ID is not found', async () => {
      const nonExistentOrderId = '656dbcf991edfc96172f4583';
      const res = await chai.request(app).delete(`/orders/${nonExistentOrderId}`);

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Order not found');
    });
  });
});
