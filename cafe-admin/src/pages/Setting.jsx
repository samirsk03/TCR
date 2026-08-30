// src/pages/Admin/Settings.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import {
    Settings,
    Percent,
    Gift,
    Store,
    Save,
} from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        gstPercentage: "",
        rewardPercentage: "",
        maxRedeemPercentage: "",
        minimumRedeemPoints: "",
        rewardValue: "",
        storeName: "",
        phone: "",
        email: "",
        address: "",
    });

    const fetchSettings = async () => {
        try {
            const res = await api.get("/settings");

            setForm(res.data.data);
        } catch (err) {
            console.log(err);
            alert("Unable to load settings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            await api.patch("/settings", form);

            alert("Settings Updated Successfully");
        } catch (err) {
            console.log(err);
            alert("Unable to update settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-xl font-semibold">
                Loading Settings...
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">

            {/* Header */}

            <div className="flex items-center gap-4 mb-10">
                <Settings className="text-sbGreen" size={34} />
                <div>
                    <h1 className="text-3xl font-black text-sbDark">
                        Store Settings
                    </h1>

                    <p className="text-gray-500">
                        Configure billing and store information.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Billing */}

                <div className="bg-white rounded-3xl shadow border border-gray-100 p-8">

                    <div className="flex items-center gap-3 mb-8">
                        <Percent className="text-sbGreen" />
                        <h2 className="text-2xl font-bold">
                            Billing Settings
                        </h2>
                    </div>

                    <div className="space-y-5">

                        <div>
                            <label className="font-semibold">
                                GST Percentage
                            </label>

                            <input
                                type="number"
                                name="gstPercentage"
                                value={form.gstPercentage}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Reward Percentage
                            </label>

                            <input
                                type="number"
                                name="rewardPercentage"
                                value={form.rewardPercentage}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Maximum Redeem %
                            </label>

                            <input
                                type="number"
                                name="maxRedeemPercentage"
                                value={form.maxRedeemPercentage}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Minimum Redeem Points
                            </label>

                            <input
                                type="number"
                                name="minimumRedeemPoints"
                                value={form.minimumRedeemPoints}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Reward Value (₹)
                            </label>

                            <input
                                type="number"
                                name="rewardValue"
                                value={form.rewardValue}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                    </div>

                </div>

                {/* Store */}

                <div className="bg-white rounded-3xl shadow border border-gray-100 p-8">

                    <div className="flex items-center gap-3 mb-8">
                        <Store className="text-sbGreen" />
                        <h2 className="text-2xl font-bold">
                            Store Information
                        </h2>
                    </div>

                    <div className="space-y-5">

                        <div>
                            <label className="font-semibold">
                                Store Name
                            </label>

                            <input
                                name="storeName"
                                value={form.storeName}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Phone
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Email
                            </label>

                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Address
                            </label>

                            <textarea
                                rows="4"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                    </div>

                </div>

            </div>

            {/* Save */}

            <div className="mt-10 flex justify-end">

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 text-black px-8 py-4 rounded-2xl font-bold "
                >
                    <Save size={20} />

                    {saving ? "Saving..." : "Save Settings"}
                </button>

            </div>

        </div>
    );
}