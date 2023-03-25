const express = require('express');
const router = express.Router();
const Shelter = require('../models/shelter');

//Get all shelters 
router.get('/', async(req, res) => {
    try{
        const shelters = await Shelter.find();
        res.json(shelters);
    } catch(err) {
        res.json({message: err.message});
    }
});

router.get('/:id',getShelter, (req, res) => {
    res.json(res.shelter);
});
//Get singular shelter
async function getShelter(req, res, next) {
    try {
        shelter = await Shelter.findById(req.params.id);
        if(shelter == null){
            return res.json({message: 'Cannot find Shelter'});
        }else{
            res.shelter = shelter;
            next();
        }
    } catch(err) {
        return res.json({message: err.message});
    }
}

router.post('/', async (req, res) => {
    const shelter = new Shelter({
        name:req.body.name,
        location: req.body.location,
        email: req.body.email
    });
    try {
        const newShelter = await shelter.save();
        res.json(newShelter);
    } catch(err){
        res.json({message: err.message});
    }
});

router.patch('/:id', getShelter, async (req, res)=>{
    if(req.body.name != null){
        res.shelter.name = req.body.name;
    }
    if(req.body.location != null){
        res.shelter.location = req.body.location;
    }if(req.body.email != null){
        res.shelter.email = req.body.email;
    }

    try{
        const updatedShelter = await res.shelter.save();
        res.json(updatedShelter);
    }catch(err){
        res.json({message: err.message});
    }
});

router.delete('/:id', getShelter, async (req, res) => {
    try {
      await res.shelter.remove();
      res.json({ message: 'Deleted Shelter' });
    } catch (err) {
      res.json({ message: err.message });
    }
  });

  module.exports = router;
