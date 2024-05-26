const router = require("express").Router();

const album = require("../models/album");

router.post("/save", async (req, res) => {
    const newAlbum = album(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
        }
    );

    try {
        const savedAlbum = await newAlbum.save();
        return res.status(200).send({ success : true, album: savedAlbum })
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = {_id : req.params.id};

    const data = await album.findOne(filter)

    if (data) {
        return res.status(200).send({ success : true, album: data })
    } else {
        return res.status(400).send({ success: false, msg: "Album Not Found" });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const options = {
            sort: {
                createdAt: -1, // trier du plus récent au plus ancien
            },
        };

        const data = await album.find().sort(options.sort);

        if (data && data.length > 0) {
            return res.status(200).send({ success: true, album: data });
        } else {
            return res.status(404).send({ success: false, msg: "No Albums found" });
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
    const result = await album.findOneAndUpdate(filter, {
        name: req.body.name,
        imageURL: req.body.imageURL,
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

    const result = await album.deleteOne(filter);

    if (result) {
        return res.status(200).send({ success : true, msg : "Album Deleted successfully" })
    } else {
        return res.status(400).send({ success: false, msg: "Album Not Found" });
    }
});

module.exports = router