import { useEffect, useState } from "react";
import axios from "axios";

const SegmentCustomerListPage = () => {
  const [segments, setSegments] = useState([]);
  const [segmentCustomers, setSegmentCustomers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegmentsAndCustomers = async () => {
      try {
        const segmentRes = await axios.get("http://localhost:5000/api/segments");
        const allSegments = segmentRes.data;
        setSegments(allSegments);

        // Fetch customers for each segment
        const customerData = {};
        await Promise.all(
          allSegments.map(async (segment) => {
            try {
              const custRes = await axios.get(`http://localhost:5000/api/segments/${segment._id}/customers`);
              customerData[segment._id] = custRes.data;
            } catch (err) {
              console.error(`Error fetching customers for segment ${segment.name}:`, err);
              customerData[segment._id] = [];
            }
          })
        );

        setSegmentCustomers(customerData);
      } catch (err) {
        console.error("Error fetching segments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentsAndCustomers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Segments & Customers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : segments.length === 0 ? (
        <p>No segments found.</p>
      ) : (
        segments.map((segment) => {
          const customers = segmentCustomers[segment._id] || [];
          return (
            <div key={segment._id} className="mb-10">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{segment.name}</h3>
              {customers.length === 0 ? (
                <p className="text-gray-500">No customers in this segment.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Total Spent</th>
                      <th className="border p-2">Visits</th>
                      <th className="border p-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust) => (
                      <tr key={cust._id} className="hover:bg-gray-50">
                        <td className="border p-2">{cust.name}</td>
                        <td className="border p-2">{cust.email}</td>
                        <td className="border p-2">{cust.total_spent}</td>
                        <td className="border p-2">{cust.visits}</td>
                        <td className="border p-2">
                          {new Date(cust.last_active).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SegmentCustomerListPage;
