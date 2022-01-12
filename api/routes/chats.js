var express = require('express');
var router = express.Router();
const Chats = require('../models/Chats')

router.get('/', async function (req, res, next) {
  try {
    const chat = await Chats.find().populate('author').populate('room')
    res.json(chat)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const chat = await Chats.find({ recipients: { _id: req.params.id } }).populate('recipients').populate('messages.sender')
    res.json(chat)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.get('/select/:id', async function (req, res, next) {
  try {
    const chat = await Chats.find({ _id: req.params.id })
    res.json(chat)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const chat = await Chats.create({ ...req.body })
    const newChat = await Chats.find({ _id: chat._id }).populate('author').populate('room')
    res.json(newChat)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

router.put('/:id', async function (req, res, next) {
  console.log(req.body)
  try {
    const chat = await Chats.findByIdAndUpdate(req.params.id, { $push: { messages: { ...req.body } } })
    res.json(chat)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "terjadi kesalahan" })
  }
});

module.exports = router;
