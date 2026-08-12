import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
    name: "",
    image: "",
    description: "",
    category: "",
    foodType: "veg",
    price: "",
    isAvailable: true,
    variants: [],
};

export default function MenuForm({
    open,
    onClose,
    onSubmit,
    editingItem,
}) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (editingItem) {
            setForm({
                name: editingItem.name || "",
                image: editingItem.image || "",
                description: editingItem.description || "",
                category: editingItem.category || "",
                foodType: editingItem.foodType || "veg",
                price: editingItem.price || "",
                isAvailable:
                    editingItem.isAvailable ?? true,
                variants:
                    editingItem.variants || [],
            });
        } else {
            setForm(initialForm);
        }
    }, [editingItem]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, checked, type } =
            e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const data = new FormData();

        data.append("image", file);

        try {

            const res = await api.post(
                "/upload",
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            setForm((prev) => ({
                ...prev,
                image: res.data.image,
            }));

        } catch (err) {

            console.log(err);

        }

    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-5">

                    <h2 className="text-2xl font-bold">

                        {editingItem
                            ? "Edit Menu Item"
                            : "Add Menu Item"}

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-2xl"
                    >
                        ×
                    </button>

                </div>

                {/* Body */}

                <div className="p-5 space-y-5">

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-medium">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 mt-1"
                            />

                        </div>

                        <div>

                            <label className="font-medium">
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 mt-1"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="font-medium">
                            Description
                        </label>

                        <textarea
                            rows="3"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-medium">
                                Food Type
                            </label>

                            <select
                                name="foodType"
                                value={form.foodType}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 mt-1"
                            >
                                <option value="veg">
                                    Veg
                                </option>

                                <option value="non-veg">
                                    Non Veg
                                </option>

                                <option value="both">
                                    Both
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="font-medium">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 mt-1"
                            />

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={form.isAvailable}
                            onChange={handleChange}
                        />

                        <span>
                            Available
                        </span>

                    </div>

                    {/* ---------- VARIANTS SECTION COMES HERE ---------- */}

                    {/* Variants */}

                    <div className="border rounded-lg p-4">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="text-lg font-semibold">
                                Variants
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        variants: [
                                            ...prev.variants,
                                            {
                                                name: "",
                                                price: "",
                                                isAvailable: true,
                                            },
                                        ],
                                    }))
                                }
                                className="bg-green-600 text-white px-3 py-2 rounded"
                            >
                                + Add Variant
                            </button>

                        </div>

                        {form.variants.length === 0 && (
                            <p className="text-gray-500">
                                No variants added.
                                Product price will be used.
                            </p>
                        )}

                        {form.variants.map((variant, index) => (

                            <div
                                key={index}
                                className="grid grid-cols-12 gap-3 mb-3"
                            >

                                <input
                                    className="col-span-5 border rounded p-2"
                                    placeholder="Variant Name"
                                    value={variant.name}
                                    onChange={(e) => {

                                        const updated = [...form.variants];

                                        updated[index].name =
                                            e.target.value;

                                        setForm({
                                            ...form,
                                            variants: updated,
                                        });

                                    }}
                                />

                                <input
                                    type="number"
                                    className="col-span-4 border rounded p-2"
                                    placeholder="Price"
                                    value={variant.price}
                                    onChange={(e) => {

                                        const updated = [...form.variants];

                                        updated[index].price =
                                            Number(e.target.value);

                                        setForm({
                                            ...form,
                                            variants: updated,
                                        });

                                    }}
                                />

                                <button
                                    type="button"
                                    className="col-span-3 bg-red-600 text-white rounded"
                                    onClick={() => {

                                        const updated =
                                            form.variants.filter(
                                                (_, i) => i !== index
                                            );

                                        setForm({
                                            ...form,
                                            variants: updated,
                                        });

                                    }}
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>

                    <div className="flex justify-end gap-3 pt-5 border-t">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-5 py-2 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {

                                if (!form.name.trim())
                                    return alert("Name Required");

                                if (!form.category.trim())
                                    return alert("Category Required");

                                if (
                                    form.variants.length === 0 &&
                                    !form.price
                                )
                                    return alert("Price Required");

                                onSubmit(form);

                                onClose();

                            }}
                            className="bg-[#6F4E37] text-white px-6 py-2 rounded-lg"
                        >
                            {editingItem
                                ? "Update Item"
                                : "Add Item"}
                        </button>

                    </div>
                </div>

            </div>

        </div>
    );
}