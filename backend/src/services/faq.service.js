const faqRepository = require("../repositories/faq.repository");

class FaqService {

  async createFaq(data) {
    if (!data.question || !data.answer) {
      throw new Error("Question and Answer are required");
    }

    return await faqRepository.create(data);
  }

  async getAllFaqs() {
    return await faqRepository.findAll();
  }

  async getActiveFaqs() {
    return await faqRepository.findActive();
  }

  async getFaqById(faqId) {
    const faq = await faqRepository.findById(faqId);
    if (!faq) {
      throw new Error("FAQ not found");
    }
    return faq;
  }

  async updateFaq(id, data) {
    const faq = await faqRepository.findById(id);
    if (!faq) {
      throw new Error("FAQ not found");
    }

    await faqRepository.update(id, data);
    return await faqRepository.findById(id);
  }

  async deleteFaq(id) {
    const faq = await faqRepository.findById(id);
    if (!faq) {
      throw new Error("FAQ not found");
    }

    await faqRepository.delete(id);
    return { message: "FAQ deleted successfully" };
  }
}

module.exports = new FaqService();