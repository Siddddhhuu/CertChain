import Recipient from '../models/Recipient.js';

export const createRecipient = async (req, res) => {
  try {
    const recipient = new Recipient(req.body);
    await recipient.save();
    res.status(201).json(recipient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRecipients = async (req, res) => {
  try {
    const recipients = await Recipient.find().populate('addedBy');
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id).populate('addedBy');
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    res.json(recipient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    res.json(recipient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findByIdAndDelete(req.params.id);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    res.json({ message: 'Recipient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};