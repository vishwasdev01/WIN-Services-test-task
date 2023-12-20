const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const Service = require('../models/service');

chai.use(chaiHttp);
const { expect } = chai;

describe('Service API', () => {
  beforeEach(async () => {
    await Service.deleteMany({});
  });

  describe('GET /services', () => {
    it('should get all services', async () => {
  
      await Service.create({ id: '1', name: 'Service 1' });

      const res = await chai.request(app).get('/services');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
    });
  });

  describe('GET /services/:id', () => {
    it('should get a single service by ID', async () => {
      const service = await Service.create({ id: '1', name: 'Service 1' });
      const res = await chai.request(app).get(`/services/${service._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(service.id);
    });

    it('should return 404 if service ID is not found', async () => {
      const nonExistentServiceId = '656dbcf991edfc96172f4583';
      const res = await chai.request(app).get(`/services/${nonExistentServiceId}`);

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Service not found');
    });
  });

  describe('POST /services', () => {
    it('should create a new service', async () => {
      const newService = { id: 2, name: 'Service 2' };
      const res = await chai.request(app).post('/services').send(newService);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(newService.id);

      const savedService = await Service.findById(res.body._id);
      expect(savedService).to.not.be.null;
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidService = { name: 'Service without ID' };
      const res = await chai.request(app).post('/services').send(invalidService);

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Validation failed');
    });
  });

  // Add more test cases for other endpoints

  describe('DELETE /services/:id', () => {
    it('should delete a single service by ID', async () => {
      const service = await Service.create({ id: '3', name: 'Service 3' });
      const res = await chai.request(app).delete(`/services/${service._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Service deleted');

      const deletedService = await Service.findById(service._id);
      expect(deletedService).to.be.null;
    });

    it('should return 404 if service ID is not found', async () => {
      const nonExistentServiceId = '656dbcf991edfc96172f4583';
      const res = await chai.request(app).delete(`/services/${nonExistentServiceId}`);

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Service not found');
    });
  });
});
