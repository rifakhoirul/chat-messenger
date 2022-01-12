const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
    username: { type: String, unique: true },
},
    {
        timestamps: true
    })

module.exports = model('Users', usersSchema)

