
import HelpRequest from "../models/HelpRequest.js";
import Session from "../models/Session.js";

// Customer: request assistance
export const createHelpRequest = async (req, res) => {
  try {
    const session = await Session.findOne({
      customerId: req.user._id,
      status: { $in: ["active", "bill_requested"] },
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active table session found.",
      });
    }

    // Avoid creating duplicate pending alerts for the same session.
    const existingRequest = await HelpRequest.findOne({
      sessionId: session._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(200).json({
        success: true,
        message: "Your help request is already pending.",
        data: existingRequest,
      });
    }

    const helpRequest = await HelpRequest.create({
      customerId: req.user._id,
      sessionId: session._id,
      tableNumber: String(session.tableNumber),
    });

    return res.status(201).json({
      success: true,
      message: "Help request sent successfully.",
      data: helpRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin/staff: get pending help requests
export const getPendingHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ status: "pending" })
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin/staff: resolve a request
export const resolveHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Help request not found.",
      });
    }

    if (request.status === "resolved") {
      return res.status(200).json({
        success: true,
        message: "Request already resolved.",
        data: request,
      });
    }

    request.status = "resolved";
    request.resolvedBy = req.user._id;
    request.resolvedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Help request resolved.",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
