import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Pill, Clock, Calendar, TrendingUp, AlertCircle, 
  CheckCircle, Plus, Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalMedications: 0,
    todayReminders: 0,
    upcomingRefills: 0,
    adherenceRate: 0
  });
  const [recentMedications, setRecentMedications] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, medsRes, scheduleRes] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/medications?limit=5'),
        axios.get('/reminders/today')
      ]);

      setStats(statsRes.data);
      setRecentMedications(medsRes.data.medications || []);
      setTodaySchedule(scheduleRes.data.reminders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's your medication overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Pill}
          title="Total Medications"
          value={stats.totalMedications}
          color="bg-indigo-600"
        />
        <StatCard
          icon={Clock}
          title="Today's Reminders"
          value={stats.todayReminders}
          color="bg-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Refills"
          value={stats.upcomingRefills}
          color="bg-amber-600"
        />
        <StatCard
          icon={Activity}
          title="Adherence Rate"
          value={`${stats.adherenceRate}%`}
          trend="+5%"
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-indigo-600" />
              Today's Schedule
            </h2>
            <Link 
              to="/reminders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((reminder, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reminder.medicationName}</h3>
                      <p className="text-sm text-gray-600">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{reminder.time}</p>
                    <button className="mt-1 px-4 py-1 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-colors">
                      Mark Taken
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No medications scheduled for today!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Medications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/medications/add"
                className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
              >
                <span className="font-medium text-gray-900">Add Medication</span>
                <Plus className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                to="/reminders"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <span className="font-medium text-gray-900">Set Reminder</span>
                <Clock className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                to="/medications"
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <span className="font-medium text-gray-900">View All Meds</span>
                <Pill className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Alerts</h2>
            <div className="space-y-3">
              {stats.upcomingRefills > 0 && (
                <div className="flex items-start p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Refill Needed</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {stats.upcomingRefills} medication{stats.upcomingRefills > 1 ? 's' : ''} need refilling soon
                    </p>
                  </div>
                </div>
              )}
              {stats.adherenceRate < 80 && (
                <div className="flex items-start p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Low Adherence</p>
                    <p className="text-xs text-red-700 mt-1">
                      Try to maintain consistency with your medications
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;