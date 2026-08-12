import { useEffect, useState } from "react";
import api from "../services/api";

import MenuTable from "../components/MenuTable";
import MenuForm from "../components/MenuForm";

export default function Menu() {

    const [menu, setMenu] = useState([]);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {

        try {

            setLoading(true);

            const res = await api.get("/menus/");

            setMenu(res.data.data || []);

        } catch (err) {

            console.log(err);

            alert("Unable to fetch menu");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this item?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/menus/${id}`);

            fetchMenu();

        } catch (err) {

            console.log(err);

            alert("Delete Failed");

        }

    };

    const handleSubmit = async (form) => {

        try {

            if (editingItem) {

                await api.put(
                    `/menus/${editingItem._id}`,
                    form
                );

            } else {

                await api.post(
                    "/menus",
                    form
                );

            }

            setOpen(false);

            setEditingItem(null);

            fetchMenu();

        } catch (err) {

            console.log(err);

            alert("Save Failed");

        }

    };

    const handleEdit = (item) => {

        setEditingItem(item);

        setOpen(true);

    };

    const handleAdd = () => {

        setEditingItem(null);

        setOpen(true);

    };

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">

                    Menu Management

                </h1>

                <button
                    onClick={handleAdd}
                    className="bg-[#6F4E37] text-white px-5 py-2 rounded"
                >

                    + Add Item

                </button>

            </div>

            {

                loading ?

                    <h2>Loading...</h2>

                    :

                    <MenuTable
                        menu={menu}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

            }

            <MenuForm
                open={open}
                onClose={() => {

                    setOpen(false);

                    setEditingItem(null);

                }}
                editingItem={editingItem}
                onSubmit={handleSubmit}
            />

        </div>

    );

}