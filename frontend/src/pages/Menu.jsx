import { useEffect, useState } from "react";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../apis/menu";

export default function Menu() {

  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const loadMenu = async () => {
    const res = await getMenu();
    setItems(res.data);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const addItem = async () => {
    if (!name || !price) return;
    await createMenuItem({ name, price });
    setName("");
    setPrice("");
    loadMenu();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
  };

  const saveEdit = async (id) => {
    await updateMenuItem(id, {
      name: editName,
      price: editPrice,
    });
    setEditingId(null);
    loadMenu();
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteMenuItem(id);
    loadMenu();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800">
          Menu Management
        </h1>
        <p className="text-sm text-gray-500">
          Add, edit, or remove items
        </p>
      </div>


      <div className="p-4 space-y-4">

        {/* Add item card */}
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">

          <h2 className="font-semibold text-gray-700">
            Add New Item
          </h2>

          <input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 px-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Price (SAR)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            className="w-full h-12 px-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={addItem}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold text-lg active:bg-blue-700"
          >
            Add Item
          </button>

        </div>


        {/* Menu list */}
        <div className="space-y-3">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 space-y-3"
            >

              {editingId === item.id ? (

                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-12 px-4 border rounded-xl"
                  />

                  <input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    type="number"
                    className="w-full h-12 px-4 border rounded-xl"
                  />

                  <div className="flex gap-2">

                    <button
                      onClick={() => saveEdit(item.id)}
                      className="flex-1 h-12 bg-green-600 text-white rounded-xl font-semibold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 h-12 bg-gray-300 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>

                  </div>
                </>

              ) : (

                <>
                  <div className="flex justify-between items-center">

                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-gray-500">
                        SAR {item.price}
                      </p>
                    </div>

                  </div>


                  <div className="flex gap-2">

                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 h-12 bg-yellow-500 text-white rounded-xl font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-1 h-12 bg-red-600 text-white rounded-xl font-semibold"
                    >
                      Delete
                    </button>

                  </div>

                </>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}