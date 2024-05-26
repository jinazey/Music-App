// artist model
const artist = require("../models/artist");

const router = require("express").Router();

router.post("/save", async (req, res) => {
    const newArtist = artist(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
        }
    );

    try {
        const savedArtist = await newArtist.save();
        return res.status(200).send({ success : true, artist: savedArtist })
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});


router.get("/getOne/:id", async (req, res) => {
    const filter = {_id : req.params.id};

    const data = await artist.findOne(filter)

    if (data) {
        return res.status(200).send({ success : true, artist: data })
    } else {
        return res.status(400).send({ success: false, msg: "Not Found" });
    }
});


router.get("/getAll", async (req, res) => {
    try {
        const options = {
            sort: {
                createdAt: -1, // trier du plus récent au plus ancien
            },
        };

        const data = await artist.find().sort(options.sort);

        if (data && data.length > 0) {
            return res.status(200).send({ success: true, artists: data });
        } else {
            return res.status(404).send({ success: false, msg: "No artists found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, msg: "Internal Server Error" });
    }
});

router.put("/update/:id", async (req, res) => {

    const filter = {_id : req.params.id};

   const options = {
    upsert : true,
    new : true
   };

   try {
    const result = await artist.findOneAndUpdate(filter, {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
    }, 
    options 
    );

    return res.status(200).send({success : true, data : result})
    
   } catch (error) {
    return res.status(400).send({ success: false, msg: error });
   }

});

router.delete("/delete/:id", async (req, res) => {
    const filter = {_id : req.params.id};

    const result = await artist.deleteOne(filter);

    if (result) {
        return res.status(200).send({ success : true, msg : "Artist Deleted successfully" })
    } else {
        return res.status(400).send({ success: false, msg: "Not Found" });
    }
});



module.exports = router