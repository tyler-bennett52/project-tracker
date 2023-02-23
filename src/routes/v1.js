'use strict';

const express = require('express');
const dataModules = require('../models');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res, next) {
  try {
    console.log(req.user);
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    next(error);
  }

}

async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
  } catch (error) {
    next(error);
  }

}

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }

}

async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }

}

async function handleDelete(req, res, next) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    next(error);
  }

}


module.exports = router;
