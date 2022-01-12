const { Schema, model } = require('mongoose');

const groupsSchema = new Schema({
    groupName: { type: String, default: null },
    participants: [{
        type: Schema.Types.ObjectId, ref: 'Users'
    }],
},
    {
        timestamps: true
    })

module.exports = model('Groups', groupsSchema)

