// controllers/suppliesController.js
const {
  getSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
  countSupplies
} = require('../models/supplyModel');

const getAllSupplies = async (req, res) => {
  const { hospcode } = req.user;
  const { page = 1, limit = 10, search = '' } = req.query;
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
      const supplies = await getSupplies(hospcode, parsedLimit, offset, search);
      const total = await countSupplies(hospcode, search);
      res.json({
          page: parsedPage,
          limit: parsedLimit,
          total,
          data: supplies
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

const getSupply = async (req, res) => {
  const { hospcode } = req.user;
  const { id } = req.params;

  try {
      const supply = await getSupplyById(id, hospcode);
      if (!supply) {
          return res.status(404).json({ message: 'Supply not found.' });
      }
      res.json(supply);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

const createNewSupply = async (req, res) => {
  const { hospcode } = req.user;
  const { name, description, quantity, unit } = req.body;

  try {
      const insertedId = await createSupply(hospcode, name, description, quantity, unit);
      const newSupply = await getSupplyById(insertedId, hospcode);
      res.status(201).json(newSupply);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateExistingSupply = async (req, res) => {
  const { hospcode } = req.user;
  const { id } = req.params;
  const { name, description, quantity, unit } = req.body;

  try {
      const existingSupply = await getSupplyById(id, hospcode);
      if (!existingSupply) {
          return res.status(404).json({ message: 'Supply not found.' });
      }

      await updateSupply(id, hospcode, name, description, quantity, unit);
      const updatedSupply = await getSupplyById(id, hospcode);
      res.json(updatedSupply);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteExistingSupply = async (req, res) => {
  const { hospcode } = req.user;
  const { id } = req.params;

  try {
      const existingSupply = await getSupplyById(id, hospcode);
      if (!existingSupply) {
          return res.status(404).json({ message: 'Supply not found.' });
      }

      await deleteSupply(id, hospcode);
      res.json({ message: 'Supply deleted successfully.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getAllSupplies,
  getSupply,
  createNewSupply,
  updateExistingSupply,
  deleteExistingSupply
};
