'use client';

import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Wrench, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import Link from 'next/link';

// Mock data for maintenance history
const maintenanceHistory = [
  { 
    id: 'MT-1001', 
    machine: 'Injection Molder A1', 
    issue: 'Hydraulic Leak', 
    status: 'Completed', 
    priority: 'High',
    reported: '2025-06-01T09:30:00',
    resolved: '2025-06-01T14:45:00',
    duration: '5h 15m',
    technician: 'John D.',
    cost: 1250,
    parts: ['Hydraulic Seal Kit', 'Gasket Set']
  },
  { 
    id: 'MT-1002', 
    machine: 'Assembly Line B1', 
    issue: 'Conveyor Belt Misalignment', 
    status: 'Completed', 
    priority: 'Medium',
    reported: '2025-05-30T11:15:00',
    resolved: '2025-05-30T12:30:00',
    duration: '1h 15m',
    technician: 'Sarah M.',
    cost: 450,
    parts: ['Belt Tensioner']
  },
  { 
    id: 'MT-1003', 
    machine: 'Injection Molder C1', 
    issue: 'Heating Element Failure', 
    status: 'In Progress', 
    priority: 'High',
    reported: '2025-06-08T08:00:00',
    resolved: null,
    duration: 'Ongoing',
    technician: 'Mike T.',
    cost: 0,
    parts: ['Heating Element']
  },
];

// Mock data for maintenance trends
const maintenanceTrends = [
  { month: 'Jan', preventive: 8, corrective: 5, emergency: 2 },
  { month: 'Feb', preventive: 7, corrective: 4, emergency: 1 },
  { month: 'Mar', preventive: 9, corrective: 6, emergency: 3 },
  { month: 'Apr', preventive: 6, corrective: 5, emergency: 2 },
  { month: 'May', preventive: 8, corrective: 7, emergency: 1 },
  { month: 'Jun', preventive: 5, corrective: 3, emergency: 2 },
];

// Mock data for MTTR and MTBF
const mttrData = [
  { month: 'Jan', mttr: 3.2 },
  { month: 'Feb', mttr: 2.8 },
  { month: 'Mar', mttr: 4.1 },
  { month: 'Apr', mttr: 3.5 },
  { month: 'May', mttr: 3.0 },
  { month: 'Jun', mttr: 2.7 },
];

const mtbfData = [
  { month: 'Jan', mtbf: 120 },
  { month: 'Feb', mtbf: 135 },
  { month: 'Mar', mtbf: 128 },
  { month: 'Apr', mtbf: 142 },
  { month: 'May', mtbf: 138 },
  { month: 'Jun', mtbf: 145 },
];

// Mock data for upcoming maintenance
const upcomingMaintenance = [
  { 
    id: 'PM-2001',
    machine: 'Injection Molder A2',
    type: 'Preventive',
    dueDate: '2025-06-15',
    status: 'Scheduled',
    estimatedDuration: '4h',
    partsNeeded: ['Air Filter', 'Lubricant']
  },
  { 
    id: 'PM-2002',
    machine: 'Assembly Line A1',
    type: 'Calibration',
    dueDate: '2025-06-20',
    status: 'Scheduled',
    estimatedDuration: '2h',
    partsNeeded: ['Calibration Kit']
  },
];

// Mock data for AI recommendations
const aiRecommendations = [
  {
    id: 'AI-001',
    title: 'Predictive Maintenance for Injection Molders',
    description: 'Vibration analysis suggests potential bearing wear in 3 injection molders within 2-3 weeks',
    impact: 'High',
    potentialSavings: '$15,000',
    action: 'Schedule vibration analysis for next week'
  },
  {
    id: 'AI-002',
    title: 'Optimize Maintenance Schedule',
    description: 'Analysis shows 23% of maintenance is performed during peak production hours',
    impact: 'Medium',
    potentialSavings: '$8,400/year',
    action: 'Reschedule non-critical maintenance to off-peak hours'
  },
];

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedRec, setExpandedRec] = useState<string | null>(null);

  const toggleRec = (id: string) => {
    setExpandedRec(expandedRec === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4 text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Maintenance History
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Work Orders</p>
                  <p className="text-2xl font-semibold">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed This Month</p>
                  <p className="text-2xl font-semibold">24</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-semibold">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Maintenance Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="preventive" fill="#3B82F6" name="Preventive" />
                  <Bar dataKey="corrective" fill="#F59E0B" name="Corrective" />
                  <Bar dataKey="emergency" fill="#EF4444" name="Emergency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MTTR & MTBF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Mean Time to Repair (MTTR)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mttrData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mttr" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Mean Time Between Failures (MTBF)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mtbfData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mtbf" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">AI-Powered Recommendations</h2>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Beta
              </span>
            </div>
            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRec(rec.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-blue-100 text-blue-600">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{rec.title}</h3>
                        <p className="text-sm text-gray-500">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rec.impact === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rec.impact} Impact
                      </span>
                      <svg 
                        className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${
                          expandedRec === rec.id ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {expandedRec === rec.id && (
                    <div className="px-4 pb-4 pt-0 border-t bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Potential Savings</p>
                          <p className="font-medium">{rec.potentialSavings}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Recommended Action</p>
                          <p className="font-medium">{rec.action}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                          Implement Suggestion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Maintenance History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed log of all maintenance activities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.machine}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.issue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.reported).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Maintenance</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Scheduled maintenance activities</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Schedule Maintenance
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingMaintenance.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.machine}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.estimatedDuration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Maintenance by Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Preventive', value: 45, color: '#3B82F6' },
                        { name: 'Corrective', value: 35, color: '#F59E0B' },
                        { name: 'Emergency', value: 20, color: '#EF4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Preventive', value: 45, color: '#3B82F6' },
                        { name: 'Corrective', value: 35, color: '#F59E0B' },
                        { name: 'Emergency', value: 20, color: '#EF4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Parts', value: 45000 },
                      { name: 'Labor', value: 65000 },
                      { name: 'Contractors', value: 25000 },
                      { name: 'Other', value: 15000 },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                    <Bar dataKey="value" fill="#8884d8">
                      {['#3B82F6', '#10B981', '#F59E0B', '#6366F1'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Maintenance Cost Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Jan', cost: 12000 },
                    { month: 'Feb', cost: 15000 },
                    { month: 'Mar', cost: 18000 },
                    { month: 'Apr', cost: 14000 },
                    { month: 'May', cost: 16000 },
                    { month: 'Jun', cost: 20000 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorCost)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
