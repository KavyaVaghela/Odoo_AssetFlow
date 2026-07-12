<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Assets
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const asset = await prisma.asset.create({ data: req.body });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.asset.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({ include: { asset: true } });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = await prisma.transaction.create({ data: req.body });
    
    // Update asset status/holder based on transaction type
    const { assetId, type, toHolder } = req.body;
    let newStatus = '';
    
    if (type === 'Allocation') newStatus = 'Allocated';
    if (type === 'Return') { newStatus = 'Available'; req.body.toHolder = null; }
    if (type === 'Transfer') newStatus = 'Allocated';
    
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: newStatus || undefined, holder: type === 'Return' ? null : toHolder }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Maintenance
app.get('/api/maintenance', async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.findMany({ include: { asset: true } });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js'; // Ensure database connects on startup

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AssetFlow Backend Server is running on port ${PORT}`);
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
});
