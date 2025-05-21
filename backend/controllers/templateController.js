import Template from '../models/Template.js';

export const createTemplate = async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().populate('createdBy');
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate('createdBy');
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};