const Service = require("../models/service");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createService = async (req, res) => {
  const { id, name } = req.body;
  try {
    if (!id || !name) {
      res.status(400).json({ error: "Validation failed" });
    } else {
      const existingService = await Service.findOne({ id });
      if (existingService) {
        res
          .status(400)
          .json({ error: "Service with the same ID already exists" });
      } else {
        const newService = new Service({ id, name });
        await newService.save();
        res.status(201).json(newService);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const service = await Service.findById(id);
    if (service) {
      service.name = name;
      await service.save();
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (service) {
      await service.remove();
      res.status(200).send({message:'Service deleted'});
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
