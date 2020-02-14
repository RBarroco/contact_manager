//CRUD route (create, read, update and delete);
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); //define our User based on that Model;
const Contact = require('../models/Contact'); //define our User based on that Model;

// @route   GET  api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      //req.user.id is accessible based on the auth middleware
      date: -1
    }); //sort based on the most recent contact first
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST  api/contacts
// @desc    Add new contact
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name: name,
        email: email,
        phone: phone,
        type: type,
        user: req.user.id //we are allowed to use the req.user.id because of the middleware that we are passing as argument in our request;
      });

      const contact = await newContact.save(); //.save() put everything inside of the database;
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT  api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id); //we are searching based on param id
    if (!contact) return res.status(404).json({ msg: 'Contact not found' }); //404 res is not found;

    // Make sure user own contact -> contact.user is not string is object and the req.user.id is a string so need to make contact.use into a string;
    if (contact.user.toString() !== req.user.id) {
      //if the Id of the database is equal to the id of the req object;
      return res.status(401).json({ msg: 'Not authorized' }); //401 not authorized
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE  api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id); //we are searching based on param id
    if (!contact) return res.status(404).json({ msg: 'Contact not found' }); //404 res is not found;

    // Make sure the user owns contact -> contact.user is not string is object and the req.user.id is a string so need to make contact.use into a string;
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' }); //401 not authorized
    }
    await Contact.findOneAndRemove(req.params.id);

    res.json({ msg: 'Contact Removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
