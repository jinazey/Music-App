const router = require("express").Router();

const song = require("../models/song");

router.post("/save", async (req, res) => {
    const newSong = song(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL: req.body.songURL,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
        }
    );

    try {
        const savedSong = await newSong.save();
        return res.status(200).send({ success : true, song: savedSong })
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});


router.get("/getOne/:id", async (req, res) => {
    const filter = {_id : req.params.id};

    const data = await song.findOne(filter)

    if (data) {
        return res.status(200).send({ success : true, song: data })
    } else {
        return res.status(400).send({ success: false, msg: "Song Not Found" });
    }
});


router.get("/getAll", async (req, res) => {
    try {
        const options = {
            sort: {
                createdAt: -1, // trier du plus récent au plus ancien
            },
        };

        const data = await song.find().sort(options.sort);

        if (data && data.length > 0) {
            return res.status(200).send({ success: true, songs: data });
        } else {
            return res.status(404).send({ success: false, msg: "No songs found" });
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
    const result = await song.findOneAndUpdate(filter, {
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

    const result = await song.deleteOne(filter);

    if (result) {
        return res.status(200).send({ success : true, msg : "Song Deleted successfully" })
    } else {
        return res.status(400).send({ success: false, msg: "Not Found" });
    }
});

module.exports = router