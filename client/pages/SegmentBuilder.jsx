import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SegmentBuilder = () => {
  const [segments, setSegments] = useState([]);
  const [selectedField, setSelectedField] = useState("total_spent");
  const [condition, setCondition] = useState(">");
  const [value, setValue] = useState("");
  const [segmentName, setSegmentName] = useState("");
  const [allSegments, setAllSegments] = useState([]);

  const handleAddCondition = () => {
    if (selectedField && condition && value) {
      const newCondition = {
        field: selectedField,
        operator:
          condition === ">"
            ? "greater_than"
            : condition === "<"
            ? "less_than"
            : condition === "="
            ? "equals"
            : condition,
        value,
      };
      setSegments([...segments, newCondition]);
      setValue("");
    }
  };

  const handleSaveSegment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/segments/save",
        {
          name: segmentName,
          description: `Auto-generated segment with ${segments.length} rule(s)`,
          rules: segments,
        }
      );

      alert("Segment saved successfully!");
      setSegments([]);
      setSegmentName("");
      fetchAllSegments(); // refresh list
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error saving segment");
    }
  };

  const fetchAllSegments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/segments/");
      setAllSegments(res.data);
    } catch (err) {
      console.error("Error fetching segments", err);
    }
  };

  useEffect(() => {
    fetchAllSegments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create Customer Segment
      </h2>

      {/* === Segment Builder Form === */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="total_spent">Total Spent</option>
            <option value="visits">Visits</option>
            <option value="last_active">Last Active</option>
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value=">">Greater than</option>
            <option value="<">Less than</option>
            <option value="=">Equal to</option>
          </select>

          <input
            type={selectedField === "last_active" ? "date" : "number"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter value"
          />

          <button
            onClick={handleAddCondition}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Add Condition
          </button>
        </div>

        {segments.length > 0 && (
          <div className="bg-gray-100 border border-gray-300 rounded p-4 mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Current Conditions:
            </h3>
            <ul className="list-disc list-inside">
              {segments.map((seg, index) => (
                <li key={index}>
                  {seg.field} {seg.operator.replace("_", " ")}{" "}
                  <span className="text-blue-700">{seg.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* === Segment Name Input === */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Segment Name"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          onClick={handleSaveSegment}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded w-full md:w-auto"
        >
          Save Segment
        </button>
      </div>

      {/* === List All Saved Segments === */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Saved Segments
        </h3>
        {allSegments.length === 0 ? (
          <p className="text-gray-500">No segments saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {allSegments.map((seg) => (
              <li
                key={seg._id}
                className="flex justify-between items-center border p-4 rounded bg-gray-50"
              >
                <div>
                  <h4 className="font-bold">{seg.name}</h4>
                  <p className="text-sm text-gray-600">{seg.description}</p>
                </div>
                <Link
                  to={`/segment/${seg._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Customers
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SegmentBuilder;
