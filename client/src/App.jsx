import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "../pages/Home";
import AddCustomer from "../pages/AddCustomerPage";
import CustomerList from "../pages/CustomerListPage";
import SegmentPage from "../pages/SegmentBuilder"; // ✅ Import this
import SegmentCustomerListPage from "../pages/SegmentCustomerListPage";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <nav className="w-60 bg-blue-900 text-white flex flex-col p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Xeno CRM</h2>
          <Link to="/" className="hover:bg-blue-700 p-2 rounded">
            Home
          </Link>
          <Link to="/add-customer" className="hover:bg-blue-700 p-2 rounded">
            Add Customer
          </Link>
          <Link to="/customer-list" className="hover:bg-blue-700 p-2 rounded">
            Customer List
          </Link>
          <Link
            to="/segment-customers"
            className="hover:bg-blue-700 p-2 rounded"
          >
            Segment Customers
          </Link>
          <Link
            to="/segment-customers-page"
            className="hover:bg-blue-700 p-2 rounded"
          >
            Segment Customers List Page
          </Link>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/segment-customers" element={<SegmentPage />} />{" "}
            {/* ✅ New Route */}
            <Route
              path="/segment-customers-page"
              element={<SegmentCustomerListPage />}
            />{" "}
            {/* ✅ New Route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
