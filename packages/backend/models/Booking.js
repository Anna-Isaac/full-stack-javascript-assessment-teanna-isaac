const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'Booking'},
  title: String,
  address: String,
  photos: [String],
  description: String,
  speciality: [String],
  extraInfo: String,
  oepning: Number,
  closing: Number,
  price: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;