const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// Create a new booking(post)
router.post("/",auth,async(req,res)=>{
    try {
        const {listingId, checkIn,checkOut} = req.body; 
        const booking= new Booking({
          listingId,
          userId: req.user.id,
          checkIn,
          checkOut,

        });
        await booking.save();
    } catch (error) {
        res.status(500).json({message:"Error creating booking"});
        
    }
});

// Get a single booking by their id
  router.get("/:id",auth,async(req,res)=>{
    try {
      const booking = await Booking.findById(req.params.id).populate("listingId");
      if(!booking) return res.status(404).json({message:"Booking not found"});
      if(booking.userId.toString() !== req.user.id)
        return res.status(403).json({message:"unauthorized"});
      res.json(booking);
        
    } catch (error) {
      res.status(500).json({message:"Error fetching booking"});
     }
  });

  // Update the booking 
  router.put("/:id",auth,async(req,res)=>{
    try {
      const booking = await Booking.findById(req.params.id);
      if(!booking) return res.status(404).json({message:"Booking not found"});
      if(booking.userId.toString()!== req.user.id)
      return res.status(403).json({message:"Unauthorized"});

const { checkIn, checkOut} = req.body;
booking.checkIn = checkIn || booking.checkIn;
booking.checkOut = checkOut || booking.checkOut;  


await booking.save();
res.json(booking);

    } catch (error) {
      res.status(500).json({message:"Error updating Booking"});
      
      
    }
  });

 //Delet a booking 
 router.delete("/:id",auth,async(req,res)=>{
  try {
    const booking = await booking.findById(req.params.id);
    if(!booking) return res.status(404).json({message: "booking not found"});
    if(booking.userId.toString() !== req.user.id)
        await booking.deleteOne();
      return res.status(403).json({message:"Unauthorized"});
  } catch (error) {
    res.status(500).json({message:"Error deleting bOOKING"});
    
  }
 });





module.exports = router;