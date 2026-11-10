
import HelpRequest from "../models/HelpRequest.js";

// Customer: create a help request
export const createHelpRequest = async (req, res) => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber || !String(tableNumber).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your table number.",
      });
    }

    const table = String(tableNumber).trim();

    // Avoid duplicate pending requests for the same table
    const existingRequest = await HelpRequest.findOne({
      tableNumber: table,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(200).json({
        success: true,
        message: "A help request is already pending for this table.",
        data: existingRequest,
      });
    }

    const helpRequest = await HelpRequest.create({
      customerId: req.user._id,
      tableNumber: table,
    });

    return res.status(201).json({
      success: true,
      message: "Staff has been notified!",
      data: helpRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin/staff: get pending requests
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

// Admin/staff: get all requests for a table
export const getTableHelpRequests = async (req, res) => {
  try {
    const tableNumber = String(req.params.tableNumber).trim();

    const requests = await HelpRequest.find({ tableNumber })
      .populate("customerId", "name phone")
      .populate("attendedBy", "name")
      .populate("resolvedBy", "name")
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

// Admin/staff: update request status
export const updateHelpRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["attended", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid help request status.",
      });
    }

    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Help request not found.",
      });
    }

    if (status === "attended") {
      request.status = "attended";
      request.attendedBy = req.user._id;
      request.attendedAt = new Date();
    }

    if (status === "resolved") {
      request.status = "resolved";
      request.resolvedBy = req.user._id;
      request.resolvedAt = new Date();
    }

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request marked as ${status}.`,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
