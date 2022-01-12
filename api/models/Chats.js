const { Schema, model } = require('mongoose');

const chatsSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Users' },
    message: String,
    room : { type: Schema.Types.ObjectId, ref: 'Groups' }
},
    {
        timestamps: true
    })

module.exports = model('Chats', chatsSchema)

