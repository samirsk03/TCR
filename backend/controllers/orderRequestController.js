import OrderRequest from "../models/OrderRequest.js";
import Session from "../models/Session.js";
import { APP_CONFIG } from "../config/appConfig.js";

export const createOrderRequest = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    const orderRequest = await OrderRequest.create({
      customerId: req.user._id,
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

    if (
      order.customerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending orders can be cancelled",
      });
    }

    const diff =
      Date.now() -
      new Date(order.createdAt).getTime();

    if (diff > 60000) {
      return res.status(400).json({
        success: false,
        message:
          "Order can only be cancelled within 60 seconds",
      });
    }

    order.status = "cancelled";
    order.cancelledBy = req.user._id;
    order.cancelledAt = new Date();
    order.cancelReason = "Cancelled by customer";

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



export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order
    const order = await OrderRequest.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check status
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order already processed",
      });
    }

    // Find active session
    let session = await Session.findOne({
      customerId: order.customerId,
      status: "active",
    });

    // Create session if not exists
    if (!session) {
      session = await Session.create({
        customerId: order.customerId,
        openedBy: req.user._id,
        items: [],
        acceptedOrders: [],
      });
    }

    // Add items to session
    session.items.push(...order.items);

    // Save order reference
    session.acceptedOrders.push(order._id);

    // Calculate subtotal
    session.subtotal = session.items.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Calculate reward points from subtotal
    // rewards will be calculated during payment
    session.totalRewardPoints = 0;
    
    // Calculate GST
    session.gst =
      (session.subtotal * session.gstPercentage) / 100;

    // Final amount
    session.totalAmount =
      session.subtotal +
      session.gst -
      session.discount;

    await session.save();

    // Update order
    order.status = "accepted";
    order.sessionId = session._id;
    order.acceptedBy = req.user._id;
    order.acceptedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: {
        orderId: order._id,
        sessionId: session._id,
        subtotal: session.subtotal,
        gst: session.gst,
        totalAmount: session.totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};