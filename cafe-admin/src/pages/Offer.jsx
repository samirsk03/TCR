// src/pages/Offers.jsx

import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  badge: "",
  title: "",
  description: "",
  terms: "",
  icon: "",
  theme: "brown",
  startDate: "",
  endDate: "",
  displayOrder: 0,
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await api.get("/offers/admin");
      setOffers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/offers/${editingId}`, form);
      } else {
        await api.post("/offers", form);
      }

      setForm(initialForm);
      setEditingId(null);
      fetchOffers();
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const editOffer = (offer) => {
    setEditingId(offer._id);

    setForm({
      badge: offer.badge || "",
      title: offer.title || "",
      description: offer.description || "",
      terms: offer.terms || "",
      icon: offer.icon || "",
      theme: offer.theme || "brown",
      startDate: offer.startDate?.slice(0, 10) || "",
      endDate: offer.endDate?.slice(0, 10) || "",
      displayOrder: offer.displayOrder,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete offer?")) return;

    await api.delete(`/offers/${id}`);

    fetchOffers();
  };

  const toggleOffer = async (id) => {
    await api.patch(`/offers/${id}/toggle`);

    fetchOffers();
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Offer Management
      </h1>

      {/* FORM */}

      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow p-6 mb-10"
      >

        <h2 className="text-xl font-bold mb-5">
          {editingId ? "Edit Offer" : "Create Offer"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="border rounded p-3"
            placeholder="Badge"
            name="badge"
            value={form.badge}
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="Icon"
            name="icon"
            value={form.icon}
            onChange={handleChange}
          />

          <input
            className="border rounded p-3"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            className="border rounded p-3"
            name="theme"
            value={form.theme}
            onChange={handleChange}
          >
            <option>brown</option>
            <option>orange</option>
            <option>red</option>
            <option>green</option>
            <option>blue</option>
            <option>grey</option>
          </select>

          <textarea
            className="border rounded p-3 md:col-span-2"
            rows={3}
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <textarea
            className="border rounded p-3 md:col-span-2"
            rows={2}
            placeholder="Terms"
            name="terms"
            value={form.terms}
            onChange={handleChange}
          />

          <div>
            <label className="font-semibold">
              Start Date
            </label>

            <input
              type="date"
              className="border rounded p-3 w-full"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-semibold">
              End Date
            </label>

            <input
              type="date"
              className="border rounded p-3 w-full"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          <input
            type="number"
            className="border rounded p-3"
            placeholder="Display Order"
            name="displayOrder"
            value={form.displayOrder}
            onChange={handleChange}
          />

        </div>

        <div className="mt-6 flex gap-4">

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Offer"
              : "Create Offer"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
              className="bg-gray-300 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Title</th>

              <th>Badge</th>

              <th>Theme</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {offers.map((offer) => (

              <tr
                key={offer._id}
                className="border-t"
              >

                <td className="p-4">

                  <div className="font-semibold">
                    {offer.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    {offer.description}
                  </div>

                </td>

                <td>{offer.badge}</td>

                <td>{offer.theme}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      offer.isActive
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {offer.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                <td>

                  <div className="flex gap-2 justify-center">

                    <button
                      onClick={() =>
                        editOffer(offer)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleOffer(offer._id)
                      }
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      {offer.isActive
                        ? "Disable"
                        : "Enable"}
                    </button>

                    <button
                      onClick={() =>
                        deleteOffer(offer._id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}