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

    useEffect(() => {
        fetchSession();
    }, []);

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

    if (loading) return <div className="p-8">Loading...</div>;

    if (!session)
        return <div className="p-8">Session Not Found</div>;

    return (
        <div className="p-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-gray-200 px-4 py-2 rounded"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold mb-2">
                Session Details
            </h1>

            <div className="bg-white rounded shadow p-6 mb-6">

                <h2 className="text-xl font-bold">
                    {session.customerId.name}
                </h2>

                <p>{session.customerId.phone}</p>

                <p className="mt-2">
                    Status :
                    <span className="font-bold ml-2">
                        {session.status}
                    </span>
                </p>

            </div>

            <div className="bg-white rounded shadow">

                <table className="w-full">

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

            <div className="bg-white rounded shadow mt-8 p-6">

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

            <div className="mt-8 flex gap-4">

                {session.status === "active" && (

                    <button
                        onClick={requestBill}
                        disabled={processing}
                        className="bg-orange-600 text-white px-6 py-3 rounded"
                    >
                        Generate Bill
                    </button>

                )}

                {session.status === "bill_requested" && (
                    <button
                        onClick={() => setShowBill(true)}
                        disabled={processing}
                        className="bg-green-600 text-white px-6 py-3 rounded"
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