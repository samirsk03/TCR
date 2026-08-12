import Session from "../models/Session.js";
import User from "../models/User.js";
import StoreSettings from "../models/StoreSettings.js";

export const getActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            status: {
                $in: ["active", "bill_requested"],
            },
        })
            .populate("customerId", "name phone rewardPoints visitCount")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate("customerId", "name phone rewardPoints")
            .populate("acceptedOrders", "status createdAt");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        res.status(200).json({
            success: true,
            data: session,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const requestBill = async (req, res) => {
    console.log("REQUEST BILL API HIT");
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Bill can only be requested for active sessions",
            });
        }

        const user = await User.findById(session.customerId);

        const settings = await StoreSettings.findOne();

        if (!settings) {
            return res.status(500).json({
                success: false,
                message: "Store settings not configured",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        //-----------------------------------------
        // Bill Values
        //-----------------------------------------

        const subtotal = session.subtotal;
        const gst = session.gst;
        const billAmount = session.totalAmount;

        //-----------------------------------------
        // Wallet Calculation
        //-----------------------------------------

        const maxRedeemAllowed = Math.floor(
             (billAmount * settings.maxRedeemPercentage)  / 100
        );

        const redeemablePoints = Math.min(
            user.rewardPoints,
            maxRedeemAllowed
        );

        const rewardDiscount =
            redeemablePoints * settings.rewardValue;

        //-----------------------------------------
        // Payable
        //-----------------------------------------

        const payableAmount = Math.max(
            billAmount - rewardDiscount,
            0
        );

        //-----------------------------------------
        // Reward Calculation
        //-----------------------------------------

        const earnedWithoutRedeem = Math.floor(
            (billAmount * settings.rewardPercentage) / 100
        );

        const earnedPoints = Math.floor(
            (payableAmount * settings.rewardPercentage) / 100
        );

        //-----------------------------------------

        session.status = "bill_requested";

        await session.save();

        //-----------------------------------------

        res.status(200).json({
            success: true,
            message: "Bill generated successfully",

            data: {
                customerName: user.name,

                subtotal,

                gst,

                rewardPointsAvailable: user.rewardPoints,

                redeemablePoints,

                rewardDiscount,

                payableAmount,

                earnedPoints,

                earnedWithoutRedeem,

                totalAmount: billAmount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Generate Bill (Preview Only)
|--------------------------------------------------------------------------
| Calculates everything but DOES NOT save anything.
| This API powers the receipt popup.
|--------------------------------------------------------------------------
*/

export const generateBill = async (req, res) => {
    try {

        const session = await Session.findById(req.params.id)
            .populate("customerId", "name phone rewardPoints");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status !== "bill_requested") {
            return res.status(400).json({
                success: false,
                message: "Please generate bill first",
            });
        }

        const settings =
            await StoreSettings.findOne();

        if (!settings) {
            return res.status(500).json({
                success: false,
                message: "Store settings not configured",
            });
        }

        const subtotal = session.subtotal;

        const gst = session.gst;

        const billAmount = session.totalAmount;

        const availablePoints =
            session.customerId.rewardPoints || 0;

        const maxRedeemAllowed = Math.floor(
            (billAmount *
                settings.maxRedeemPercentage) /
                100
        );

        const redeemPoints = Math.min(
            availablePoints,
            maxRedeemAllowed
        );

        const rewardDiscount =
            redeemPoints *
            settings.rewardValue;

        const finalAmount = Math.max(
            billAmount - rewardDiscount,
            0
        );

        const earnedPoints = Math.floor(
            (finalAmount *
                settings.rewardPercentage) /
                100
        );

        res.status(200).json({
            success: true,
            data: {
                customer: session.customerId,

                subtotal,

                gst,

                billAmount,

                availablePoints,

                maxRedeemAllowed,

                redeemPoints,

                rewardDiscount,

                finalAmount,

                earnedPoints,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const paySession = async (req, res) => {
    console.log("PAY API HIT");

    try {

        const {
            paymentMethod,
            redeem = false,
            manualDiscount = 0,
            discountReason = "",
        } = req.body;

        if (!["cash", "upi", "card"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status !== "bill_requested") {
            return res.status(400).json({
                success: false,
                message: "Bill must be requested first",
            });
        }

        console.log("\n========== PAYMENT ==========");
        console.log("Logged In Staff :", req.user._id.toString());
        console.log("Session Customer:", session.customerId.toString());
        console.log("Redeem Requested:", redeem);

        const user = await User.findById(
            session.customerId
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        const settings =
            await StoreSettings.findOne();

        if (!settings) {
            return res.status(500).json({
                success: false,
                message:
                    "Store settings not configured",
            });
        }

        console.log("Customer Name:", user.name);
        console.log(
            "Reward Balance Before:",
            user.rewardPoints
        );

        //-----------------------------------------
        // BILL
        //-----------------------------------------

        const billAmount = session.totalAmount;

        //-----------------------------------------
        // REDEEM
        //-----------------------------------------

        let redeemedPoints = 0;
        let rewardDiscount = 0;

        if (redeem) {

            const maxRedeemAllowed = Math.floor(
                (billAmount *
                    settings.maxRedeemPercentage) /
                    100
            );

            redeemedPoints = Math.min(
                user.rewardPoints,
                maxRedeemAllowed
            );

            rewardDiscount =
                redeemedPoints *
                settings.rewardValue;

            user.rewardPoints -= redeemedPoints;

            if (user.rewardPoints < 0) {
                user.rewardPoints = 0;
            }

            console.log(
                "Redeemed Points:",
                redeemedPoints
            );

            console.log(
                "Reward Discount:",
                rewardDiscount
            );
        }

        //-----------------------------------------
        // FINAL BILL
        //-----------------------------------------

        const finalAmount = Math.max(
            billAmount -
            rewardDiscount -
            manualDiscount,
            0
        );

        //-----------------------------------------
        // EARN REWARD
        //-----------------------------------------

        const earnedPoints = Math.floor(
            (finalAmount *
                settings.rewardPercentage) /
                100
        );

        const rewardBeforeAdding =
            user.rewardPoints;

        user.rewardPoints += earnedPoints;
        user.visitCount += 1;

        console.log(
            "Reward Before Adding:",
            rewardBeforeAdding
        );

        console.log(
            "Reward Earned:",
            earnedPoints
        );

        console.log(
            "Final Wallet Balance:",
            user.rewardPoints
        );

        await user.save();

        //-----------------------------------------
        // SAVE SESSION
        //-----------------------------------------

        session.redeemedPoints =
            redeemedPoints;

        session.rewardDiscount =
            rewardDiscount;

        session.manualDiscount =
            manualDiscount;

        session.discountReason =
            discountReason;

        session.earnedPoints =
            earnedPoints;

        session.totalRewardPoints =
            earnedPoints;

        session.totalAmount =
            finalAmount;

        session.status = "paid";

        session.paymentMethod =
            paymentMethod;

        session.paidAt = new Date();

        session.closedBy =
            req.user._id;

        await session.save();

        //-----------------------------------------

        res.status(200).json({
            success: true,
            message: "Payment Successful",
            data: {
                finalAmount,
                redeemedPoints,
                rewardDiscount,
                earnedPoints,
                walletBalance:
                    user.rewardPoints,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const getSessionHistory = async (req, res) => {
    try {

        const {
            period,
            from,
            to,
            customer,
            staff,
            payment,
        } = req.query;

        const query = {
            status: "paid",
        };

        //----------------------------------
        // Period Filter
        //----------------------------------

        if (period) {

            const today = new Date();

            let startDate;

            if (period === "today") {

                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                );

            }

            if (period === "week") {

                startDate = new Date();

                startDate.setDate(
                    today.getDate() - 7
                );

            }

            if (period === "month") {

                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

            }

            if (period === "year") {

                startDate = new Date(
                    today.getFullYear(),
                    0,
                    1
                );

            }

            if (startDate) {

                query.paidAt = {
                    $gte: startDate,
                };

            }

        }

        //----------------------------------
        // Custom Date Filter
        //----------------------------------

        if (from && to) {

            query.paidAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };

        }

        //----------------------------------
        // Customer Filter
        //----------------------------------

        if (customer) {

            query.customerId = customer;

        }

        //----------------------------------
        // Staff Filter
        //----------------------------------

        if (staff) {

            query.closedBy = staff;

        }

        //----------------------------------
        // Payment Method
        //----------------------------------

        if (payment) {

            query.paymentMethod = payment;

        }

        //----------------------------------
        // Fetch
        //----------------------------------

        const sessions = await Session.find(query)
            .populate("customerId", "name phone rewardPoints visitCount")
            .populate("openedBy", "name employeeId")   // <-- ADD THIS LINE
            .populate("closedBy", "name employeeId")
            .sort({ paidAt: -1 });

        //----------------------------------
        // Summary
        //----------------------------------

        const summary = {

            totalOrders: sessions.length,

            totalRevenue: sessions.reduce(
                (sum, s) => sum + s.totalAmount,
                0
            ),

            totalRewardEarned: sessions.reduce(
                (sum, s) => sum + s.earnedPoints,
                0
            ),

            totalRewardRedeemed: sessions.reduce(
                (sum, s) => sum + s.redeemedPoints,
                0
            ),

            totalManualDiscount: sessions.reduce(
                (sum, s) => sum + s.manualDiscount,
                0
            ),

        };

        //----------------------------------

        res.status(200).json({

            success: true,

            summary,

            count: sessions.length,

            data: sessions,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }
};

export const getMyTransactions = async (req, res) => {
    try {
        const sessions = await Session.find({
            customerId: req.user._id,
            status: "paid",
        }).sort({ paidAt: -1 });

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};