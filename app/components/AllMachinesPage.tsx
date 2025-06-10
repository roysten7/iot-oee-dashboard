'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  BarChart2,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Mock data for machines
const machinesData = [
  {
    id: 'M-101',
    name: 'Injection Molder A1',
    status: 'running',
    oee: 92,
    availability: 95,
    performance: 96,
    quality: 98,
    line: 'A',
    lastMaintenance: '2025-06-01',
    uptime: '98.5%',
    alerts: 2
  },
  {
    id: 'M-102',
    name: 'Injection Molder A2',
    status: 'running',
    oee: 89,
    availability: 92,
    performance: 94,
    quality: 97,
    line: 'A',
    lastMaintenance: '2025-06-05',
    uptime: '97.2%',
    alerts: 1
  },
  {
    id: 'M-201',
    name: 'Assembly Line B1',
    status: 'idle',
    oee: 78,
    availability: 85,
    performance: 88,
    quality: 95,
    line: 'B',
    lastMaintenance: '2025-05-28',
    uptime: '94.1%',
    alerts: 0
  },
  {
    id: 'M-202',
    name: 'Packaging Line B2',
    status: 'maintenance',
    oee: 65,
    availability: 70,
    performance: 82,
    quality: 90,
    line: 'B',
    lastMaintenance: '2025-06-07',
    uptime: '89.7%',
    alerts: 3
  },
  {
    id: 'M-301',
    name: 'CNC Machine C1',
    status: 'running',
    oee: 85,
    availability: 90,
    performance: 92,
    quality: 96,
    line: 'C',
    lastMaintenance: '2025-05-30',
    uptime: '96.3%',
    alerts: 1
  },
  {
    id: 'M-302',
    name: 'CNC Machine C2',
    status: 'running',
    oee: 88,
    availability: 93,
    performance: 93,
    quality: 97,
    line: 'C',
    lastMaintenance: '2025-05-25',
    uptime: '95.8%',
    alerts: 0
  },
];

// Group machines by line
const groupedMachines = machinesData.reduce((acc, machine) => {
  if (!acc[machine.line]) {
    acc[machine.line] = [];
  }
  acc[machine.line].push(machine);
  return acc;
}, {} as Record<string, typeof machinesData>);

// Calculate line statistics
const lineStats = Object.entries(groupedMachines).map(([line, machines]) => {
  const totalOEE = machines.reduce((sum, m) => sum + m.oee, 0);
  const avgOEE = Math.round((totalOEE / machines.length) * 10) / 10;
  
  const running = machines.filter(m => m.status === 'running').length;
  const idle = machines.filter(m => m.status === 'idle').length;
  const maintenance = machines.filter(m => m.status === 'maintenance').length;

  return {
    line,
    avgOEE,
    running,
    idle,
    maintenance,
    total: machines.length
  };
});

const AllMachinesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const filteredMachines = machinesData.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.line.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Use filteredMachines for rendering the machine list
  const displayMachines = searchTerm ? filteredMachines : machinesData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Production Line Overview</h1>
          <div className="mt-2 sm:mt-0">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search machines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {lineStats.map((stats) => (
          <div 
            key={stats.line} 
            className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
              selectedLine === stats.line ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedLine(selectedLine === stats.line ? null : stats.line)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Line {stats.line}</h3>
                  <p className="text-sm text-gray-500">{stats.total} Machines</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    stats.avgOEE >= 85 ? 'text-green-600' : 
                    stats.avgOEE >= 70 ? 'text-yellow-500' : 'text-red-600'
                  }`}>
                    {stats.avgOEE}%
                  </div>
                  <p className="text-xs text-gray-500">Avg. OEE</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Running
                  </span>
                  <span className="font-medium">{stats.running}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Idle
                  </span>
                  <span className="font-medium">{stats.idle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Maintenance
                  </span>
                  <span className="font-medium">{stats.maintenance}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Machine Details */}
      <div className="space-y-6">
        {Object.entries(
          displayMachines.reduce((acc, machine) => {
            if (!acc[machine.line]) acc[machine.line] = [];
            acc[machine.line].push(machine);
            return acc;
          }, {} as Record<string, typeof machinesData>)
        ).map(([line, lineMachines]) => (
          <div key={line} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Line {line} - Machine Details</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {lineMachines.map((machine) => (
                <div key={machine.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{machine.name}</h4>
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {machine.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Last Maintenance: {machine.lastMaintenance} • Uptime: {machine.uptime}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      {/* OEE */}
                      <div className="text-center">
                        <div className="text-2xl font-bold">{machine.oee}%</div>
                        <div className="text-xs text-gray-500">OEE</div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        machine.status === 'running' 
                          ? 'bg-green-100 text-green-800' 
                          : machine.status === 'idle' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                      </div>
                      
                      {/* Alerts */}
                      {machine.alerts > 0 && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">{machine.alerts}</span>
                        </div>
                      )}
                      
                      {/* View Details Button */}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        View Details
                        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-blue-700">Availability</span>
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900">{machine.availability}%</span>
                        <span className="ml-1 text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                          +2.5%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-700">Performance</span>
                        <BarChart2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900">{machine.performance}%</span>
                        <span className="ml-1 text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                          +1.2%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-700">Quality</span>
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900">{machine.quality}%</span>
                        <span className="ml-1 text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                          +0.8%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-purple-700">Alerts</span>
                        <AlertTriangle className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="mt-1">
                        <span className="text-xl font-semibold text-gray-900">{machine.alerts}</span>
                        <span className="ml-1 text-xs text-gray-500">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMachinesPage;
