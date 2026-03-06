const faqService = require("../services/faq.service");

class FaqController {
  //create faq
  async create(req, res) {
    try {
      const faq = await faqService.createFaq(req.body);
      return res.status(201).json({
        success: true,
        message: "FAQ created successfully",
        data: faq
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  //get all faq
  async getAll(req, res) {
    try {
      const faqs = await faqService.getAllFaqs();
      return res.status(200).json({
        success: true,
        data: faqs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  //get public faq
  async getPublic(req, res) {
    try {
      const faqs = await faqService.getActiveFaqs();
      return res.status(200).json({
        success: true,
        data: faqs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  //update faq
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedFaq = await faqService.updateFaq(id, req.body);
      return res.status(200).json({
        success: true,
        message: "FAQ updated successfully",
        data: updatedFaq
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  //delete faq
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await faqService.deleteFaq(id);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new FaqController();