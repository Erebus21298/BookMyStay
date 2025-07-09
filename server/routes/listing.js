// const express = require("express");
// const router= express.Router();
// const Listing = require("../models/Listing");
// const auth = require("../middleware/auth");
// const { model } = require("mongoose");

// //get all Listings
// router.get("/",async(req,res)=>{
//     try {
//         const {location,minPrice,maxPrice} = req.query;
//         const filter={};


//         if(location) filter.location={$regex:location, $options:"i"};
//         if(minPrice || maxPrice) filter.price={};
//         if(minPrice) filter.price.$gte= +minPrice;
//         if(maxPrice) filter.price.$lte= +maxPrice;

//         const listings = await Listing.find(filter);
//         res.json(listings);
        
//     } catch (error) {
//         res.status(500).json({message:"Error fetching listings"});
        
//     }
// });

// // Get Listings By id 
// router.get("/id",async(req,res)=>{
//     try {
//         const listing=await Listing.findById(req.params.id);
//         if(!listing) return res.status(404).json({message:"Listing Not  Found"});
//         res.json(listing);
//     } catch (error) {
//         res.status(500).json({message:"Error fetching Listings"})
        
//     }
// });

// // Post listing by Host
// router.post("/",auth,async(req,res)=>{
//     try {
//         if(!req.user.isHost){
//             return res.status(403).json({message:"Only hosts can add listings"});
//         }
//         const listing = new Listing({...req.body, hostId: req.user.id});
//         await listing.save();
//         res.status(201).json(listing);
//     } catch (error) {
//         res.status(500).json({message:"Error creating listings"});
        
//     }

//     //Update Listing(put by host)
//     router.put("/",async(req,res)=> {
//         try {
//             const listing = await Listing.findById(req.params.id);
//             if(!listing) return res.status(404).json({message:"Listing not found"});
//             if(listing.hostId.toString()!== req.user.id){
//                 return res.status(403).json({message:"Unauthorized"});
//             }
//             const updated = await Listing.findByIdAndUpdate(req.params.id, req.body,{
//                 new:true,
//             });
//             res.json(updated);
//         } catch (error) {
//             res.status(500).json({message:"Error updating listing"});
            

            
//         }
//     });
// });


// // Delete Listing by host

// router.delete("/:id",auth,async(req,res)=>{
//    try {
//      const listing = await Listing.findById(req.params.id);
//     if(!listing) return res.status(404).json({message:"Listing not found"});

//     if(listing.hostId.toString()!== req.user.id){
//         return res.status(403).json({message:"Unauthorized"});
//     }
//     await listing.deleteOne();
//     res.json({message:"DELETED SUCCESSFULLY"});
//    } catch (error) {
//     res.status(500).json({message:"Error in deleting Listing"});
    
//    }
// });

// model.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const auth = require("../middleware/auth");

// Get all Listings
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (!isNaN(minPrice)) filter.price = { ...(filter.price || {}), $gte: parseFloat(minPrice) };
    if (!isNaN(maxPrice)) filter.price = { ...(filter.price || {}), $lte: parseFloat(maxPrice) };

    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

// Get Listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing Not Found" });
    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ message: "Error fetching listing" });
  }
});

// Post listing by Host
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user.isHost) {
      return res.status(403).json({ message: "Only hosts can add listings" });
    }
    const listing = new Listing({ ...req.body, hostId: req.user.id });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Error creating listing" });
  }
});

// Update Listing by Host
router.put("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Error updating listing" });
  }
});

// Delete Listing by Host
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await listing.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Error deleting listing" });
  }
});
//This route allows authenticated users who are hosts to fetch their own listings.
router.get("/my-listing",auth,async(req,res)=>{
    try {
        if(!req.user.isHost){
            return res
            .status(403)
            .json({message:"Only host can view their listing"});
            }
            const listings = await Listing.find({hostId: req.user,id});
            res.json(listings);
    } catch (error) {
        res.status(500).json({message:"Error in fetching the listing"});
        
    }
});




module.exports = router;
