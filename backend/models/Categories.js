const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true,
});

module.exports = mongoose.model('Categories', CategoriesSchema);