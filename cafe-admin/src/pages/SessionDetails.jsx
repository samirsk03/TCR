
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import PaymentModal from "../components/PaymentModal";

export default function SessionDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [showBill, setShowBill] = useState(
        location.state?.openPayment || false
    );

    const [billData, setBillData] = useState(
        location.state?.billData || null
    );

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Help Requests
    const [helpRequests, setHelpRequests] = useState([]);
    const [helpLoading, setHelpLoading] = useState(false);
    const [updatingHelpId, setUpdatingHelpId] = useState(null);

    const fetchSession = async () => {
        try {
            const res = await api.get(`/session/${id}`);
            setSession(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Unable to load session.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHelpRequests = async (tableNumber) => {
        if (!tableNumber) return;

        try {
            setHelpLoading(true);

            const res = await api.get(
                `/help-request/table/${encodeURIComponent(tableNumber)}`
            );

            setHelpRequests(res.data.data || []);
        } catch (err) {
            console.error("Unable to fetch help requests:", err);
        } finally {
            setHelpLoading(false);
        }
    };

    const updateHelpStatus = async (requestId, status) => {
        try {
            setUpdatingHelpId(requestId);

            await api.patch(
                `/help-request/${requestId}/status`,
                { status }
            );

            await fetchHelpRequests(session.tableNumber);
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to update help request."
            );
        } finally {
            setUpdatingHelpId(null);
        }
    };

    useEffect(() => {
        fetchSession();
    }, [id]);

    useEffect(() => {
        if (session?.tableNumber) {
            fetchHelpRequests(session.tableNumber);
        }
    }, [session?.tableNumber]);

    const requestBill = async () => {
        try {
            setProcessing(true);

            const res = await api.patch(
                `/session/${id}/request-bill`
            );

            setBillData(res.data.data);
            setShowBill(true);

            fetchSession();
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setProcessing(false);
        }
    };

    const takePayment = async ({
        paymentMethod,
        redeem,
        manualDiscount,
        discountReason,
    }) => {
        try {
            setProcessing(true);

            await api.patch(`/session/${id}/pay`, {
                paymentMethod,
                redeem,
                manualDiscount,
                discountReason,
            });

            alert("Payment Successful");

            setShowBill(false);

            fetchSession();

            navigate("/active-sessions");
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Payment Failed"
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!session) {
        return <div className="p-8">Session Not Found</div>;
    }

    return (
        <div className="p-4 md:p-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 rounded bg-gray-200 px-4 py-2"
            >
                ← Back
            </button>

            <h1 className="mb-2 text-3xl font-bold">
                Session Details
            </h1>

            {/* CUSTOMER DETAILS */}

            <div className="mb-6 rounded bg-white p-6 shadow">

                <h2 className="text-xl font-bold">
                    {session.customerId?.name}
                </h2>

                <p>{session.customerId?.phone}</p>

                <p className="mt-2">
                    Table Number:
                    <span className="ml-2 font-bold">
                        {session.tableNumber}
                    </span>
                </p>

                <p className="mt-2">
                    Status:
                    <span className="ml-2 font-bold">
                        {session.status}
                    </span>
                </p>

            </div>

            {/* HELP REQUESTS */}

            <div className="mb-6 rounded-xl bg-white p-6 shadow">

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                    <div>
                        <h2 className="text-xl font-bold">
                            Help Requests
                        </h2>

                        <p className="text-sm text-gray-500">
                            Table {session.tableNumber}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            fetchHelpRequests(session.tableNumber)
                        }
                        disabled={helpLoading}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                        {helpLoading ? "Refreshing..." : "↻ Refresh"}
                    </button>

                </div>

                {helpLoading && helpRequests.length === 0 ? (

                    <p className="py-4 text-gray-500">
                        Loading help requests...
                    </p>

                ) : helpRequests.length === 0 ? (

                    <div className="rounded-lg bg-gray-50 py-8 text-center">
                        <p className="text-gray-500">
                            No help requests for this table.
                        </p>
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[650px]">

                            <thead className="bg-gray-100">

                                <tr>
                                    <th className="p-3 text-left">
                                        Customer
                                    </th>

                                    <th className="p-3 text-left">
                                        Requested At
                                    </th>

                                    <th className="p-3 text-left">
                                        Status
                                    </th>

                                    <th className="p-3 text-left">
                                        Action
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {helpRequests.map((request) => (

                                    <tr
                                        key={request._id}
                                        className="border-t"
                                    >

                                        <td className="p-3">
                                            <p className="font-medium">
                                                {request.customerId?.name || "Customer"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {request.customerId?.phone || ""}
                                            </p>
                                        </td>

                                        <td className="p-3 text-sm">
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleString()}
                                        </td>

                                        <td className="p-3">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    request.status === "pending"
                                                        ? "bg-red-100 text-red-700"
                                                        : request.status === "attended"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {request.status.toUpperCase()}
                                            </span>

                                        </td>

                                        <td className="p-3">

                                            <div className="flex gap-2">

                                                {request.status === "pending" && (
                                                    <button
                                                        onClick={() =>
                                                            updateHelpStatus(
                                                                request._id,
                                                                "attended"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingHelpId === request._id
                                                        }
                                                        className="rounded bg-yellow-500 px-3 py-2 text-xs text-white hover:bg-yellow-600 disabled:opacity-50"
                                                    >
                                                        {updatingHelpId === request._id
                                                            ? "Updating..."
                                                            : "Attended"}
                                                    </button>
                                                )}

                                                {request.status !== "resolved" && (
                                                    <button
                                                        onClick={() =>
                                                            updateHelpStatus(
                                                                request._id,
                                                                "resolved"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingHelpId === request._id
                                                        }
                                                        className="rounded bg-green-600 px-3 py-2 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        Resolve
                                                    </button>
                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* SESSION ITEMS */}

            <div className="overflow-x-auto rounded bg-white shadow">

                <table className="w-full min-w-[650px]">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Item
                            </th>

                            <th className="p-3">
                                Variant
                            </th>

                            <th className="p-3">
                                Qty
                            </th>

                            <th className="p-3">
                                Price
                            </th>

                            <th className="p-3">
                                Reward
                            </th>

                            <th className="p-3">
                                Total
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {session.items.map((item, index) => (

                            <tr key={index} className="border-t">

                                <td className="p-3">
                                    {item.itemName}
                                </td>

                                <td className="text-center">
                                    {item.variantName || "-"}
                                </td>

                                <td className="text-center">
                                    {item.quantity}
                                </td>

                                <td className="text-center">
                                    ₹{item.price}
                                </td>

                                <td className="text-center">
                                    {item.rewardPoints}
                                </td>

                                <td className="text-center">
                                    ₹{item.quantity * item.price}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* SESSION TOTALS */}

            <div className="mt-8 rounded bg-white p-6 shadow">

                <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>₹{session.subtotal}</span>
                </div>

                <div className="flex justify-between py-2">
                    <span>GST</span>
                    <span>₹{session.gst}</span>
                </div>

                <div className="flex justify-between py-2">
                    <span>Discount</span>
                    <span>₹{session.discount}</span>
                </div>

                <div className="flex justify-between py-2">
                    <span>Reward Points</span>
                    <span>{session.totalRewardPoints}</span>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>₹{session.totalAmount}</span>
                </div>

            </div>

            {/* BILL / PAYMENT */}

            <div className="mt-8 flex flex-wrap gap-4">

                {session.status === "active" && (
                    <button
                        onClick={requestBill}
                        disabled={processing}
                        className="rounded bg-[#6F4E37] px-6 py-3 text-white disabled:opacity-50"
                    >
                        Generate Bill
                    </button>
                )}

                {session.status === "bill_requested" && (
                    <button
                        onClick={() => setShowBill(true)}
                        disabled={processing}
                        className="rounded bg-[#6F4E37] px-6 py-3 text-white disabled:opacity-50"
                    >
                        Take Payment
                    </button>
                )}

                <PaymentModal
                    open={showBill}
                    bill={billData || {}}
                    loading={processing}
                    onClose={() => setShowBill(false)}
                    onPay={takePayment}
                />

            </div>

        </div>
    );
}
