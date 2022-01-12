var express = require('express');
var router = express.Router();
const Users = require('../models/Users')

router.get('/', async function (req, res, next) {
  try {
    const users = await Users.find()
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const users = await Users.create({ ...req.body })
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const users = await Users.find({ username: req.params.id })
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

module.exports = router;
