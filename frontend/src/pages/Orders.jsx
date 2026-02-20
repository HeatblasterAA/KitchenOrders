import { useEffect, useState } from "react";
import {
  getOrders,
  markDelivered,
  deleteOrder,
  updateOrder,
  markPaid
} from "../apis/orders";

import { getMenu } from "../apis/menu";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editItems, setEditItems] = useState([]);

  useEffect(() => {
    loadOrders();
    loadMenu();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    const res = await getMenu();
    setMenu(res.data);
  };

  // DELIVERY
  const deliver = async (id) => {
    try {
      setWorkingId(id);
      await markDelivered(id);
      loadOrders();
    } catch {
      alert("Failed");
    } finally {
      setWorkingId(null);
    }
  };

  // PAYMENT
  const pay = async (id) => {
    try {
      setWorkingId(id);
      await markPaid(id);
      loadOrders();
    } catch {
      alert("Failed");
    } finally {
      setWorkingId(null);
    }
  };

  // DELETE
  const remove = async (id) => {

    if (!window.confirm("Delete order?")) return;

    try {
      setWorkingId(id);
      await deleteOrder(id);
      loadOrders();
    } catch {
      alert("Failed");
    } finally {
      setWorkingId(null);
    }
  };

  // START EDIT
  const startEdit = (order) => {

    setEditingId(order.id);

    setEditItems(
      order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // EDIT + 
  const increaseQty = (menuItem) => {

    const exists = editItems.find(
      i => i.menuItemId === menuItem.id
    );

    if (exists) {

      setEditItems(
        editItems.map(i =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );

    } else {

      setEditItems([
        ...editItems,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1
        }
      ]);

    }
  };

  // EDIT -
  const decreaseQty = (menuItemId) => {

    const item = editItems.find(
      i => i.menuItemId === menuItemId
    );

    if (!item) return;

    if (item.quantity === 1) {

      setEditItems(
        editItems.filter(
          i => i.menuItemId !== menuItemId
        )
      );

    } else {

      setEditItems(
        editItems.map(i =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );

    }
  };

  // SAVE EDIT
  const saveEdit = async (order) => {

    try {

      setWorkingId(order.id);

      await updateOrder(order.id, {
        ...order,
        items: editItems
      });

      setEditingId(null);

      loadOrders();

    } catch {

      alert("Failed to update");

    } finally {

      setWorkingId(null);

    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (

    <div className="p-4 space-y-4">

      {orders.map(order => {

        const isEditing = editingId === order.id;

        const itemsToShow =
          isEditing ? editItems : order.items;

        const total =
          itemsToShow.reduce(
            (sum, i) =>
              sum + i.price * i.quantity,
            0
          );

        return (

          <div
            key={order.id}
            className="border rounded-xl p-4 bg-white shadow">

            {/* CUSTOMER */}
            <div className="text-lg font-bold">
              {order.customerName}
            </div>

            {/* STATUS */}
            <div className="flex gap-4 mt-1 text-sm">

              <span className={
                order.delivered
                  ? "text-green-600"
                  : "text-orange-600"
              }>
                Delivery:
                {order.delivered ? " Delivered" : " Pending"}
              </span>

              <span className={
                order.paid
                  ? "text-green-600"
                  : "text-red-600"
              }>
                Payment:
                {order.paid ? " Paid" : " Pending"}
              </span>

            </div>

            {/* ITEMS */}
            <div className="mt-3 space-y-2">

              {(isEditing ? menu : order.items)
                .map(item => {

                  const menuItem =
                    isEditing ? item : null;

                  const editItem =
                    isEditing
                      ? editItems.find(
                        i => i.menuItemId === menuItem.id
                      )
                      : item;

                  const qty =
                    isEditing
                      ? editItem?.quantity || 0
                      : item.quantity;

                  const name =
                    isEditing
                      ? menuItem.name
                      : item.name;

                  const price =
                    isEditing
                      ? menuItem.price
                      : item.price;

                  return (

                    <div
                      key={
                        isEditing
                          ? menuItem.id
                          : item.menuItemId
                      }
                      className="flex justify-between items-center">

                      <span>
                        {name}
                      </span>

                      {isEditing ? (

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              decreaseQty(menuItem.id)
                            }
                            className="bg-red-500 text-white px-2 rounded">
                            −
                          </button>

                          <span>
                            {qty}
                          </span>

                          <button
                            onClick={() =>
                              increaseQty(menuItem)
                            }
                            className="bg-green-600 text-white px-2 rounded">
                            +
                          </button>

                        </div>

                      ) : (

                        <span>
                          {qty} × SAR {price}
                        </span>

                      )}

                    </div>

                  );

                })}

            </div>

            {/* TOTAL */}
            <div className="mt-3 font-semibold">
              Total: SAR {total}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2 mt-3">

              {!order.delivered && !isEditing && (

                <button
                  onClick={() => deliver(order.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded">
                  Delivered
                </button>

              )}

              {order.delivered && !order.paid && !isEditing && (

                <button
                  onClick={() => pay(order.id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded">
                  Mark Paid
                </button>

              )}

              {!order.delivered && !isEditing && (

                <>
                  <button
                    onClick={() => startEdit(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                  </button>

                  <button
                    onClick={() => remove(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </>

              )}

              {isEditing && (

                <>
                  <button
                    onClick={() => saveEdit(order)}
                    className="bg-green-600 text-white px-3 py-1 rounded">
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </>

              )}

            </div>

          </div>

        );

      })}

    </div>
  );
}