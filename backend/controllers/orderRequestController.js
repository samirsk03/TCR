import OrderRequest from "../models/OrderRequest.js";
import Session from "../models/Session.js";
import { APP_CONFIG } from "../config/appConfig.js";


export const createOrderRequest = async (req, res) => {
  try {
    const { items, tableNumber } = req.body;

    if (!tableNumber || !String(tableNumber).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your table number",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    const orderRequest = await OrderRequest.create({
      customerId: req.user._id,
      tableNumber: String(tableNumber).trim(),
      items,
    });

    res.status(201).json({
      success: true,
      data: orderRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getPendingOrders = async (req, res) => {
  try {
    const orders = await OrderRequest.find({
      status: "pending",
    }).populate("customerId", "name phone");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderRequest.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner =
      order.customerId.toString() === req.user._id.toString();
    const isStaffOrAdmin =
      req.user.role === "admin" || req.user.role === "staff";

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // 60-second window only applies to the customer cancelling their own order.
    // Staff/admin can cancel a pending order anytime.
    if (isOwner && !isStaffOrAdmin) {
      const diff = Date.now() - new Date(order.createdAt).getTime();

      if (diff > 60000) {
        return res.status(400).json({
          success: false,
          message: "Order can only be cancelled within 60 seconds",
        });
      }
    }

    order.status = "cancelled";
    order.cancelledBy = req.user._id;
    order.cancelledAt = new Date();
    order.cancelReason = isStaffOrAdmin
      ? "Cancelled by staff"
      : "Cancelled by customer";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCancelledOrders = async (req, res) => {
  try {
    const orders = await OrderRequest.find({ status: "cancelled" })
      .populate("customerId", "name phone")
      .populate("cancelledBy", "name employeeId")
      .sort({ cancelledAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order request
    const order = await OrderRequest.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order already processed",
      });
    }

    // Find an existing unpaid session
    let session = await Session.findOne({
      customerId: order.customerId,
      status: {
        $in: ["active", "bill_requested"],
      },
    }).sort({ createdAt: -1 });

    // Create a new session only if no unpaid session exists
    if (!session) {
      session = await Session.create({
        customerId: order.customerId,
        tableNumber: order.tableNumber,
        openedBy: req.user._id,
        items: [],
        acceptedOrders: [],
      });
    }

    // Add new items to the existing session
    session.items.push(...order.items);

    // Save accepted order reference
    session.acceptedOrders.push(order._id);

    // Recalculate subtotal
    session.subtotal = session.items.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Rewards are calculated during payment
    session.totalRewardPoints = 0;

    // Recalculate GST
    session.gst =
      (session.subtotal * session.gstPercentage) / 100;

    // Recalculate final amount
    session.totalAmount =
      session.subtotal +
      session.gst -
      session.discount;

    // IMPORTANT:
    // Do not change session.status here.
    // If it was bill_requested, it stays bill_requested.

    await session.save();

    // Update order request
    order.status = "accepted";
    order.sessionId = session._id;
    order.acceptedBy = req.user._id;
    order.acceptedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: {
        orderId: order._id,
        sessionId: session._id,
        sessionStatus: session.status,
        subtotal: session.subtotal,
        gst: session.gst,
        totalAmount: session.totalAmount,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
