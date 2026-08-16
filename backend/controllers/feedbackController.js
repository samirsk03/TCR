import Feedback from "../models/Feedback.js";

// POST feedback
export const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = await Feedback.create({
      customerId: req.user._id,
      rating,
      comment,
    });

    const populatedFeedback = await feedback.populate(
      "customerId",
      "name phone"
    );

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: populatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};