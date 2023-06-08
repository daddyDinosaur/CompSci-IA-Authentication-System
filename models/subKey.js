const mongoose = require('mongoose');

const subKeySchema = new mongoose.Schema(
  { key: { type: String } },
  { versionKey: false }, {_id: null}
);

const SubKey = mongoose.model('subKey', subKeySchema);

module.exports = { SubKey };
