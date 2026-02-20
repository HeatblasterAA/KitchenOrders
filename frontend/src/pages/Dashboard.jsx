import { useEffect, useState } from "react";
import api from "../apis/axios";

export default function Dashboard() {

  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rangeTotal, setRangeTotal] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [rangeLoading, setRangeLoading] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    loadMetrics();
  }, []);


  const loadMetrics = async () => {
    try {
      setLoading(true);

      const today = new Date().toISOString().slice(0, 10);
      const month = today.slice(0, 7);

      const dailyRes = await api.get("/orders/earnings/day", {
        params: { date: today }
      });

      const monthlyRes = await api.get("/orders/earnings/month", {
        params: { month }
      });

      setDaily(dailyRes.data ?? 0);
      setMonthly(monthlyRes.data ?? 0);

    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };


  const loadRange = async () => {

    if (!startDate || !endDate) {
      alert("Select both dates");
      return;
    }

    try {
      setRangeLoading(true);

      const res = await api.get("/earnings/range", {
        params: {
          startDate,
          endDate
        }
      });

      setRangeTotal(res.data ?? 0);

    } catch {
      alert("Failed to load range earnings");
    } finally {
      setRangeLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Earnings overview
        </p>
      </div>


      <div className="p-4 space-y-4">


        {/* Daily card */}
        <div className="bg-white rounded-2xl shadow-md p-4">

          <p className="text-gray-500 text-sm">
            Today
          </p>

          <p className="text-2xl font-bold text-green-600">
            SAR {daily}
          </p>

        </div>


        {/* Monthly card */}
        <div className="bg-white rounded-2xl shadow-md p-4">

          <p className="text-gray-500 text-sm">
            This Month
          </p>

          <p className="text-2xl font-bold text-blue-600">
            SAR {monthly}
          </p>

        </div>



        {/* Range picker card */}
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">

          <p className="font-semibold">
            Custom Date Range
          </p>


          {/* Start date */}
          <div>
            <label className="text-sm text-gray-600">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full h-12 border rounded-xl px-4"
            />
          </div>


          {/* End date */}
          <div>
            <label className="text-sm text-gray-600">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="w-full h-12 border rounded-xl px-4"
            />
          </div>


          {/* Button */}
          <button
            onClick={loadRange}
            disabled={rangeLoading}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold disabled:bg-blue-300"
          >
            {rangeLoading
              ? "Loading..."
              : "Check Earnings"}
          </button>


          {/* Result */}
          {rangeTotal !== null && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl text-center font-semibold">

              Total: SAR {rangeTotal}

            </div>
          )}

        </div>


      </div>

    </div>
  );
}