const mongoose = require('mongoose');

const subKeySchema = new mongoose.Schema(
{   key: { type: String, required: true,},
    duration: { type: String, required: true,},
    type: { type: String, required: true, enum: ['lite', 'pro'],},
    expiresAt: { type: Date, reqiored: false },
  }, { versionKey: false }, {_id: null}
);

const SubKey = mongoose.model('subKey', subKeySchema);

module.exports = { SubKey };
