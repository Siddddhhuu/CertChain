import ContactMessage from '../models/ContactMessage.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContactMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await newContactMessage.save();

    res.status(201).json({ message: 'Contact message sent successfully!', data: newContactMessage });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Error saving contact message', error: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ isDeleted: false }).sort({ createdAt: -1 }); // Get non-deleted messages, sorted by newest first
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
  }
};

export const softDeleteContactMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const updatedMessage = await ContactMessage.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.status(200).json({ message: 'Contact message soft-deleted successfully!' });
  } catch (error) {
    console.error('Error soft-deleting contact message:', error);
    res.status(500).json({ message: 'Error soft-deleting contact message', error: error.message });
  }
}; 