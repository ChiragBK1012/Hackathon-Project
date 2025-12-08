import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to MediTrack
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Manage prescriptions and patient records efficiently
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/doctor/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Doctor Portal
          </Link>
          <Link
            to="/patient/auth"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Patient Portal
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

