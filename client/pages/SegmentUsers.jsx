import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SegmentUsers = () => {
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [segmentName, setSegmentName] = useState("");

  useEffect(() => {
    const fetchSegmentAndUsers = async () => {
      try {
        const [segmentRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/segments`),
          axios.get(`http://localhost:5000/api/segments/${id}/users`)
        ]);
        const segment = segmentRes.data.find((s) => s._id === id);
        setSegmentName(segment?.name || "Unknown Segment");
        setCustomers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSegmentAndUsers();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Customers in Segment: {segmentName}</h2>
      {customers.length === 0 ? (
        <p className="text-gray-600">No customers found for this segment.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Total Spent</th>
              <th className="p-2 border">Visits</th>
              <th className="p-2 border">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="text-center border-t">
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">{c.total_spent}</td>
                <td className="p-2 border">{c.visits}</td>
                <td className="p-2 border">{new Date(c.last_active).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SegmentUsers;
