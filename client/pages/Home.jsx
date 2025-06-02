import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-inner">
    <div className="animate-fade-in-down">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 flex items-center justify-center gap-2 mb-4">
        Welcome to Xeno CRM
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Streamline your customer management with ease and efficiency.
      </p>
    </div>

    <div className="flex flex-wrap gap-6 animate-fade-in-up justify-center">
      <Link
        to="/add-customer"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition duration-300"
      >
        Add Customer
      </Link>
      <Link
        to="/customer-list"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow transition duration-300"
      >
        View Customers
      </Link>
      <Link
        to="/segment-customers"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition duration-300"
      >
        Segment Customers
      </Link>
    </div>
  </div>
);

export default Home;
