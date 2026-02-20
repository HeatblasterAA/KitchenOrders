import { useEffect, useState } from "react";
import { getMenu } from "../apis/menu";
import { createOrder } from "../apis/orders";
import { useNavigate } from "react-router-dom";

export default function CreateOrder() {

  const [menu, setMenu] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    loadMenu();
  }, []);


  const loadMenu = async () => {
    const res = await getMenu();
    setMenu(res.data);
  };


  const toggleItem = (menuItemId) => {

    const exists = items.find(
      i => i.menuItemId === menuItemId
    );

    if (exists) {
      setItems(
        items.filter(
          i => i.menuItemId !== menuItemId
        )
      );
    } else {
      setItems([
        ...items,
        { menuItemId, quantity: 1 }
      ]);
    }
  };


  const updateQty = (menuItemId, qty) => {

    if (qty < 1) return;

    setItems(
      items.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: qty }
          : i
      )
    );
  };


  // FIXED submitOrder inside component
  const submitOrder = async () => {

    if (!customerName) {
      alert("Enter customer name");
      return;
    }

    if (items.length === 0) {
      alert("Select at least one item");
      return;
    }

    try {

      setLoading(true);

      // Build full order items with name and price
      const fullItems = items.map(item => {

        const menuItem = menu.find(
          m => m.id === item.menuItemId
        );

        return {
          menuItemId: item.menuItemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity
        };

      });

      await createOrder({
        customerName,
        items: fullItems,
        deliverBy: deliveryDate
          ? deliveryDate + "T00:00:00"
          : null
      });

      navigate("/orders");

    } catch (err) {

      console.error(err);
      alert("Failed to create order");

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="p-4">

      <h1 className="text-xl font-bold mb-4">
        Create Order
      </h1>

      <input
        value={customerName}
        onChange={(e) =>
          setCustomerName(e.target.value)
        }
        placeholder="Customer Name"
        className="border p-2 w-full mb-4"
      />

      {menu.map(m => {

        const selected = items.find(
          i => i.menuItemId === m.id
        );

        const qty = selected?.quantity || 0;

        return (
          <div key={m.id} className="mb-3 border p-3 rounded">

            <div className="flex justify-between items-center">

              <div>
                <div className="font-semibold">
                  {m.name}
                </div>
                <div className="text-gray-500">
                  SAR {m.price}
                </div>
              </div>

              {!selected ? (

                <button
                  onClick={() => toggleItem(m.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add
                </button>

              ) : (

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => {

                      if (qty === 1) {
                        toggleItem(m.id);
                      } else {
                        updateQty(m.id, qty - 1);
                      }

                    }}
                    className="bg-red-500 text-white w-8 h-8 rounded"
                  >
                    −
                  </button>

                  <span className="w-6 text-center font-bold">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(m.id, qty + 1)
                    }
                    className="bg-green-600 text-white w-8 h-8 rounded"
                  >
                    +
                  </button>

                </div>

              )}

            </div>

          </div>
        );
      })}


      <input
        type="date"
        value={deliveryDate}
        onChange={(e) =>
          setDeliveryDate(e.target.value)
        }
        className="border p-2 w-full mt-4"
      />


      <button
        onClick={submitOrder}
        disabled={loading}
        className="bg-green-600 text-white p-3 w-full mt-4"
      >
        {loading ? "Creating..." : "Create Order"}
      </button>

    </div>
  );

}