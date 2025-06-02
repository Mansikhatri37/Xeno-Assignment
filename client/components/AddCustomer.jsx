import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";

const AddCustomer = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    total_spent: 0,
    visits: 0,
    last_active: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [csvSuccess, setCsvSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total_spent" || name === "visits" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/customers/add",
        formData
      );

      setSuccess(res.data.message || "Customer added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        total_spent: 0,
        visits: 0,
        last_active: new Date().toISOString().slice(0, 10),
      });

      if (onCustomerAdded) onCustomerAdded(res.data.customer);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add customer"
      );
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    setCsvSuccess(null);
    setError(null);

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const customers = results.data.map((c) => ({
              name: c.name,
              email: c.email,
              phone: c.phone,
              total_spent: Number(c.total_spent),
              visits: Number(c.visits),
              last_active:
                c.last_active || new Date().toISOString().slice(0, 10),
            }));

            const res = await axios.post(
              "http://localhost:5000/api/customers/add-bulk",
              { customers }
            );
            setCsvSuccess(res.data.message || "Customers added successfully!");
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Failed to upload CSV"
            );
          }
        },
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Customers</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      {csvSuccess && <p className="text-green-600">{csvSuccess}</p>}

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          Name:
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        </label>
        <label className="block">
          Email :
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        </label>
        <label className="block">
          Phone:
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        </label>
        <label className="block">
          Total Spent:
        <input
          type="number"
          name="total_spent"
          placeholder="Total Spent"
          value={formData.total_spent}
          onChange={handleChange}
          //min={0}
          className="border p-2 w-full"
          inputMode="numeric"
        />
        </label>
        <label className="block">
          Visits:
        <input
          type="number"
          name="visits"
          placeholder="Visits"
          value={formData.visits}
          onChange={handleChange}
          //min={0}
          className="border p-2 w-full"
          inputMode="numeric"
        />
        </label>
        <label className="block">
          Last Active:
          <input
            type="date"
            name="last_active"
            value={formData.last_active}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Customer
        </button>
      </form>

      <hr className="my-4" />

      {/* Bulk Upload CSV */}
      <div>
        <label className="font-medium">Upload CSV (bulk add customers):</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="mt-2 block"
        />
        <p className="text-sm text-gray-600 mt-1">
          CSV columns:{" "}
          <code>name,email,phone,total_spent,visits,last_active</code>
        </p>
      </div>
    </div>
  );
};

export default AddCustomer;
