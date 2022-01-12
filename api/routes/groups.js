var express = require('express');
var router = express.Router();
const Groups = require('../models/Groups')

router.get('/', async function (req, res, next) {
  try {
    const groups = await Groups.find().populate('participants')
    res.json(groups)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const groups = await Groups.create({ ...req.body })
    const newGroup = await Groups.find({ _id: groups._id }).populate('participants')
    res.json(newGroup)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const groups = await Groups.find({username:req.params.id})
    res.json(groups)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

module.exports = router;
