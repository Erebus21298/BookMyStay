const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    images: [String],
    hostId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    bookingDates: [{start:Date, end: Date}],
});

module.exports = mongoose.model("Listing", listingSchema)