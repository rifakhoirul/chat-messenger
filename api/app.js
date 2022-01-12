var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/react-chat-db');

var chatsRouter = require('./routes/chats');
var usersRouter = require('./routes/users');
var groupsRouter = require('./routes/groups');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/api/chats', chatsRouter);
app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);

module.exports = app;
