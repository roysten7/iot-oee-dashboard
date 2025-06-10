'use client';

import { useState, MouseEvent, useCallback, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, Zap, CheckCircle, TrendingUp, TrendingDown, ChevronDown, ChevronRight, Wrench, Maximize2, Minimize2, User, Settings, Shield, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

type Role = 'owner' | 'supervisor' | 'maintenance' | 'quality' | 'all';
type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

// Mock data for quality metrics
const qualityData = {
  rejectionRate: 2.5, // %
  totalProduced: 12500,
  totalRejected: 312,
  topRejectionReasons: [
    { reason: 'Surface Defects', count: 125, percentage: 40 },
    { reason: 'Dimensional Issues', count: 78, percentage: 25 },
    { reason: 'Material Flaws', count: 47, percentage: 15 },
    { reason: 'Assembly Errors', count: 31, percentage: 10 },
    { reason: 'Other', count: 31, percentage: 10 },
  ],
  trend: [
    { month: 'Jan', rejectionRate: 3.2 },
    { month: 'Feb', rejectionRate: 2.9 },
    { month: 'Mar', rejectionRate: 2.7 },
    { month: 'Apr', rejectionRate: 2.5 },
    { month: 'May', rejectionRate: 2.4 },
    { month: 'Jun', rejectionRate: 2.3 },
  ]
};

// Mock data for the dashboard
const plantOeeData = [
  { date: '2025-05-01', oee: 78 },
  { date: '2025-05-02', oee: 82 },
  { date: '2025-05-03', oee: 79 },
  { date: '2025-05-04', oee: 85 },
  { date: '2025-05-05', oee: 88 },
  { date: '2025-05-06', oee: 75 },
  { date: '2025-05-07', oee: 90 },
  { date: '2025-05-08', oee: 92 },
  { date: '2025-05-09', oee: 89 },
  { date: '2025-05-10', oee: 86 },
  { date: '2025-05-11', oee: 82 },
  { date: '2025-05-12', oee: 84 },
  { date: '2025-05-13', oee: 87 },
  { date: '2025-05-14', oee: 89 },
  { date: '2025-05-15', oee: 91 },
];

const operatorEfficiencyData = [
  { name: 'John D.', efficiency: 92, shifts: 12 },
  { name: 'Sarah M.', efficiency: 88, shifts: 10 },
  { name: 'Mike T.', efficiency: 85, shifts: 15 },
  { name: 'Emma R.', efficiency: 89, shifts: 14 },
  { name: 'David K.', efficiency: 82, shifts: 11 },
];

const downtimeReasons = [
  { name: 'Mechanical Failure', value: 35, color: '#EF4444' },
  { name: 'Material Shortage', value: 25, color: '#F59E0B' },
  { name: 'Changeover', value: 20, color: '#3B82F6' },
  { name: 'Quality Check', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 5, color: '#6B7280' },
];

const recommendations = [
  { 
    id: 1, 
    title: 'Reduce minor stops on Machine MX-04', 
    description: 'Frequent minor stops detected. Consider preventive maintenance.',
    priority: 'High',
    icon: <AlertTriangle className="text-yellow-500" />
  },
  { 
    id: 2, 
    title: 'Schedule preventive maintenance for Line B', 
    description: 'Scheduled maintenance due in 3 days.',
    priority: 'Medium',
    icon: <Clock className="text-blue-500" />
  },
  { 
    id: 3, 
    title: 'Optimize changeover process', 
    description: 'Average changeover time increased by 15% this week.',
    priority: 'Medium',
    icon: <Zap className="text-purple-500" />
  },
];

const alerts = [
  { id: 1, time: '10:23 AM', machine: 'MX-04', issue: 'Overheating', status: 'Critical' },
  { id: 2, time: '09:45 AM', machine: 'Line B', issue: 'Conveyor Jam', status: 'Warning' },
  { id: 3, time: '09:12 AM', machine: 'QA-12', issue: 'Calibration Needed', status: 'Info' },
  { id: 4, time: '08:30 AM', machine: 'MX-04', issue: 'Low Lubricant', status: 'Warning' },
];

const kpiComparison = {
  currentMonth: { oee: 89, availability: 92, performance: 95, quality: 98 },
  previousMonth: { oee: 85, availability: 89, performance: 93, quality: 97 },
};

interface Machine {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'maintenance';
  oee: number;
  line: string;
}

// Machine data
const machinesData: Machine[] = [
  { id: 'M-101', name: 'Injection Molder A1', status: 'running' as const, oee: 92, line: 'A' },
  { id: 'M-102', name: 'Injection Molder A2', status: 'running' as const, oee: 89, line: 'A' },
  { id: 'M-103', name: 'Assembly Line A1', status: 'idle' as const, oee: 0, line: 'A' },
  { id: 'M-201', name: 'Injection Molder B1', status: 'running' as const, oee: 87, line: 'B' },
  { id: 'M-202', name: 'Assembly Line B1', status: 'running' as const, oee: 85, line: 'B' },
  { id: 'M-301', name: 'Injection Molder C1', status: 'maintenance' as const, oee: 0, line: 'C' },
  { id: 'M-302', name: 'Assembly Line C1', status: 'running' as const, oee: 90, line: 'C' },
];

// Production data
const productionData = {
  today: 12450,
  yesterday: 11870,
  week: 84320,
  month: 327890,
  quarter: 985430,
  year: 3850000,
};

// Production trend data
const productionTrendData = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 4, i + 1).toISOString().split('T')[0],
    production: 10000 + Math.floor(Math.random() * 4000),
  })),
  weekly: Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    production: 60000 + Math.floor(Math.random() * 20000),
  })),
  monthly: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
    production: 250000 + Math.floor(Math.random() * 100000),
  })),
  quarterly: Array.from({ length: 4 }, (_, i) => ({
    quarter: `Q${i + 1}`,
    production: 800000 + Math.floor(Math.random() * 400000),
  })),
  yearly: Array.from({ length: 5 }, (_, i) => ({
    year: (2021 + i).toString(),
    production: 3500000 + Math.floor(Math.random() * 1000000),
  })),
};

interface OeeTileProps {
  title: string;
  value: number;
  delta: number;
  unit?: string;
  onClick?: () => void;
}

const OeeTile = ({ title, value, delta, unit = '%', onClick }: OeeTileProps) => {
  const isPositive = delta >= 0;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 flex flex-col ${onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="mt-2 flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
        {delta !== undefined && (
          <span className={`ml-2 text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  );
};

type AlertStatus = 'Critical' | 'Warning' | 'Info';

interface AlertBadgeProps {
  status: string;
}

const AlertBadge = ({ status }: AlertBadgeProps) => {
  const normalizedStatus = (status as AlertStatus) || 'Info';
  const statusColors: Record<AlertStatus, string> = {
    Critical: 'bg-red-100 text-red-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Info: 'bg-blue-100 text-blue-800',
  };
  
  const statusClass = statusColors[normalizedStatus as AlertStatus] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}>
      {status}
    </span>
  );
};

// Machine status component
interface MachineStatusProps {
  machines: Machine[];
  onTotalMachinesClick?: (e: React.MouseEvent) => void;
}

const MachineStatus = ({ machines, onTotalMachinesClick }: MachineStatusProps) => {
  const statusCounts = machines.reduce<Record<string, number>>((acc, machine) => {
    acc[machine.status] = (acc[machine.status] || 0) + 1;
    return acc;
  }, {});

  const totalMachines = machines.length;
  const runningCount = statusCounts['running'] || 0;
  const idleCount = statusCounts['idle'] || 0;
  const maintenanceCount = statusCounts['maintenance'] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div 
        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
        onClick={(e) => onTotalMachinesClick?.(e)}
      >
        <div className="text-sm font-medium text-gray-500">Total Machines</div>
        <div className="text-2xl font-bold">{totalMachines}</div>
        <div className="text-xs text-blue-600 mt-1">View details →</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-500">Active</div>
            <div className="text-2xl font-bold">{runningCount}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
      <Link href="/maintenance" className="hover:opacity-90 transition-opacity">
        <div className="bg-white p-4 rounded-lg shadow h-full cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Maintenance</div>
              <div className="text-2xl font-bold">{maintenanceCount}</div>
              <div className="text-xs text-blue-600 mt-1">View details →</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </Link>
    </div>);
};

// Role-based views
const getRoleBasedView = (role: Role) => {
  const views = {
    owner: {
      title: 'Executive Overview',
      description: 'Key metrics and financial performance',
      metrics: ['oee', 'revenue', 'costs', 'profit']
    },
    supervisor: {
      title: 'Production Floor',
      description: 'Real-time production monitoring',
      metrics: ['oee', 'production', 'downtime', 'efficiency']
    },
    maintenance: {
      title: 'Maintenance',
      description: 'Equipment status and maintenance',
      metrics: ['downtime', 'maintenance', 'mtbf', 'mttr']
    },
    quality: {
      title: 'Quality Control',
      description: 'Quality metrics and defects',
      metrics: ['quality', 'rejection', 'defects', 'inspection']
    }
  };
  
  return role === 'all' ? null : views[role];
};

// Quality metrics component
interface QualityMetricsProps {
  isFullScreen?: boolean;
  selectedRole?: Role;
  toggleFullScreen?: () => void;
}

const QualityMetrics = ({ isFullScreen = false, selectedRole = 'all', toggleFullScreen = () => {} }: QualityMetricsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Quality Metrics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rejection Rate:</span>
          <span className="text-lg font-semibold text-red-600">{qualityData.rejectionRate}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Total Produced</div>
          <div className="text-2xl font-bold">
            {qualityData.totalProduced.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Units</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-600">Rejected Parts</div>
          <div className="text-2xl font-bold">
            {qualityData.totalRejected.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            ({(qualityData.totalRejected / qualityData.totalProduced * 100).toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-2">Top Rejection Reasons</h3>
          <div className="space-y-6">
            {qualityData.topRejectionReasons.map((item, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>{item.reason}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Rejection Rate Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityData.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Rejection Rate']} />
                <Line 
                  type="monotone" 
                  dataKey="rejectionRate" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Production count component
interface ProductionData {
  today: number;
  yesterday: number;
  week: number;
  month: number;
  quarter: number;
  year: number;
}

interface ProductionCountProps {
  data: ProductionData;
}

const ProductionCount = ({ data }: ProductionCountProps) => {
  const [timeframe, setTimeframe] = useState('today');
  const [chartTimeframe, setChartTimeframe] = useState('daily');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getChartData = () => {
    switch (chartTimeframe) {
      case 'daily':
        return productionTrendData.daily;
      case 'weekly':
        return productionTrendData.weekly;
      case 'monthly':
        return productionTrendData.monthly;
      case 'quarterly':
        return productionTrendData.quarterly;
      case 'yearly':
        return productionTrendData.yearly;
      default:
        return productionTrendData.daily;
    }
  };

  const getXAxisDataKey = () => {
    switch (chartTimeframe) {
      case 'daily': return 'date';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'quarterly': return 'quarter';
      case 'yearly': return 'year';
      default: return 'date';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Overview</h2>
      
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'quarter', 'year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Production Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">Today</div>
          <div className="text-2xl font-bold">{formatNumber(data.today)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {data.today > data.yesterday ? '↑' : '↓'} {Math.abs(Math.round(((data.today - data.yesterday) / data.yesterday) * 100))}% from yesterday
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-2xl font-bold">{formatNumber(data.week)}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold">{formatNumber(data.month)}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">This Year</div>
          <div className="text-2xl font-bold">{formatNumber(data.year)}</div>
        </div>
      </div>

      {/* Production Trend Chart */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium">Production Trend</h3>
          <div className="flex space-x-2">
            {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setChartTimeframe(tf)}
                className={`px-2 py-1 rounded text-xs ${
                  chartTimeframe === tf
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey={getXAxisDataKey()}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip 
                formatter={(value) => [value, 'Production']}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="production"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorProduction)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Machine List Component
interface MachineListProps {
  machines: Machine[];
  onBack: () => void;
}

const MachineList = ({ machines, onBack }: MachineListProps) => {
  // Group machines by line
  const machinesByLine = machines.reduce((acc, machine) => {
    if (!acc[machine.line]) {
      acc[machine.line] = [];
    }
    acc[machine.line].push(machine);
    return acc;
  }, {} as Record<string, typeof machines>);

  // Calculate line statistics
  const lineStats = Object.entries(machinesByLine).map(([line, lineMachines]) => {
    const totalOEE = lineMachines.reduce((sum, m) => sum + m.oee, 0);
    const avgOEE = Math.round((totalOEE / lineMachines.length) * 10) / 10;
    
    const running = lineMachines.filter(m => m.status === 'running').length;
    const idle = lineMachines.filter(m => m.status === 'idle').length;
    const maintenance = lineMachines.filter(m => m.status === 'maintenance').length;

    return {
      line,
      avgOEE,
      running,
      idle,
      maintenance,
      total: lineMachines.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Production Line Overview</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Line Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {lineStats.map((stats) => (
          <div key={stats.line} className="bg-white rounded-xl shadow-md overflow-hidden">
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
        {Object.entries(machinesByLine).map(([line, lineMachines]) => (
          <div key={line} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Line {line} - Machine Details</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {lineMachines.map((machine) => (
                <div key={machine.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{machine.name}</h4>
                      <p className="text-sm text-gray-500">ID: {machine.id}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{machine.oee}%</div>
                        <div className="text-xs text-gray-500">OEE</div>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              machine.oee >= 85 ? 'bg-green-500' : 
                              machine.oee >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${machine.oee}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {machine.oee >= 85 ? 'Excellent' : 
                           machine.oee >= 70 ? 'Good' : 'Needs Attention'}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        machine.status === 'running' 
                          ? 'bg-green-100 text-green-800' 
                          : machine.status === 'idle' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
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
}

// Main dashboard component
export default function OEEDashboard() {
  // State management
  const [selectedLine] = useState('All Lines');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('day');
  const [selectedRole, setSelectedRole] = useState<Role>('all');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'machineList'>('dashboard');
  const [recommendations] = useState([
    { id: 1, text: 'Optimize changeover process for Line A', priority: 'high', completed: false },
    { id: 2, text: 'Schedule maintenance for Injection Molder B1', priority: 'medium', completed: false },
    { id: 3, text: 'Review quality control parameters for Line C', priority: 'low', completed: true },
  ]);
  const [selectedKpi, setSelectedKpi] = useState('oee');
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [kpiOptions] = useState([
    { id: 'oee', label: 'OEE' },
    { id: 'availability', label: 'Availability' },
    { id: 'performance', label: 'Performance' },
    { id: 'quality', label: 'Quality' },
  ]);

  const toggleRecommendation = (id: number) => {
    setExpandedRecommendation(expandedRecommendation === id ? null : id);
  };

  const toggleFullScreen = useCallback(() => {
    if (isClient) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(console.error);
        setIsFullScreen(true);
        // Adjust scale for TV display
        const scale = Math.min(
          window.innerWidth / 1920, 
          window.innerHeight / 1080,
          1.5 // Max scale to prevent text from becoming too large
        );
        setContentScale(scale);
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullScreen(false);
        setContentScale(1);
      }
    }
  }, [isClient, isFullScreen]);

  const roleView = getRoleBasedView(selectedRole);

  // Calculate dynamic height for fullscreen view
  const fullscreenStyles = isFullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: 'white',
    overflow: 'hidden',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    width: '100vw',
    transform: `scale(${contentScale})`,
    transformOrigin: 'top left',
    transition: 'transform 0.2s ease-in-out'
  } : {};

  return (
    <div 
      className={`min-h-screen bg-gray-50 p-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
      style={fullscreenStyles as React.CSSProperties}
    >
      <header className={`mb-8 ${isFullScreen ? 'px-4 py-2 bg-gray-50 rounded-lg' : ''}`}>
        <div className="flex justify-between items-center">
          {isFullScreen && (
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedRole === 'all' ? 'OEE Dashboard' : 
               selectedRole === 'owner' ? 'Executive Overview' :
               selectedRole === 'supervisor' ? 'Production Floor' :
               selectedRole === 'maintenance' ? 'Maintenance View' : 'Quality Control'}
            </h1>
          )}
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 relative flex items-center">
                <span className="relative">
                  Analytics
                  <svg 
                    className="absolute -right-6 top-0 w-16 h-8 text-blue-500 pointer-events-none overflow-visible"
                    viewBox="0 0 100 40"
                    fill="none"
                  >
                    <defs>
                      <path id="arcPath" d="M0,10 Q40,-40 80,10" />
                    </defs>
                    {/* First dot */}
                    <circle r="1.5" fill="currentColor" className="opacity-0">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      >
                        <mpath xlinkHref="#arcPath" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.9;1"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    
                    {/* Second dot */}
                    <circle r="1.5" fill="currentColor" className="opacity-0">
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.9;1"
                        dur="3s"
                        repeatCount="indefinite"
                        begin="-1s"
                      />
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        begin="-1s"
                      >
                        <mpath xlinkHref="#arcPath" />
                      </animateMotion>
                    </circle>
                    
                    {/* Third dot */}
                    <circle r="1.5" fill="currentColor" className="opacity-0">
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.9;1"
                        dur="3s"
                        repeatCount="indefinite"
                        begin="-2s"
                      />
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        begin="-2s"
                      >
                        <mpath xlinkHref="#arcPath" />
                      </animateMotion>
                    </circle>
                  </svg>
                </span>
                <span className="text-blue-600 ml-1">IQ</span>
              </h1>
            </div>
            {roleView && (
              <div className="mt-1">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {roleView.title} View
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="relative group">
              <button 
                onClick={() => setSelectedRole(prev => prev === 'all' ? 'owner' : 'all')}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                title="Switch View"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button 
                  onClick={() => setSelectedRole('owner')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Executive View
                </button>
                <button 
                  onClick={() => setSelectedRole('supervisor')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Floor Supervisor
                </button>
                <button 
                  onClick={() => setSelectedRole('maintenance')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Maintenance Team
                </button>
                <button 
                  onClick={() => setSelectedRole('quality')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Quality Team
                </button>
              </div>
            </div>
            <button 
              onClick={toggleFullScreen}
              className="p-2 rounded-lg hover:bg-gray-100"
              title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullScreen ? (
                <Minimize2 className="h-5 w-5 text-gray-600" />
              ) : (
                <Maximize2 className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between mt-2 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>
              {currentTime.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              <span className="ml-2">
                {currentTime.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </span>
            <span className="text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              All systems operational
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span className="hidden sm:inline">Time Range:</span>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['day', 'week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedTimeRange === range ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Plant OEE Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <OeeTile 
          title="Plant OEE" 
          value={85.2} 
          delta={1.2} 
          onClick={() => {
            setSelectedPlantOee('all');
            setView('machineList');
          }}
        />
        <OeeTile 
          title="Availability" 
          value={92.5} 
          delta={0.8}
          onClick={() => {
            setSelectedPlantOee('all');
            setView('machineList');
          }}
        />
        <OeeTile 
          title="Performance" 
          value={91.8} 
          delta={-0.5}
          onClick={() => {
            setSelectedPlantOee('all');
            setView('machineList');
          }}
        />
      </div>

      {/* Role-based content */}
      {selectedRole === 'all' && (
        <>
          <Link href="/all-machines" className="block">
            <MachineStatus 
              machines={machinesData} 
              onTotalMachinesClick={(e) => {
                e.preventDefault();
                // The Link component will handle the navigation
              }} 
            />
          </Link>
          <ProductionCount data={productionData} />
          <QualityMetrics 
            isFullScreen={isFullScreen}
            selectedRole={selectedRole}
            toggleFullScreen={toggleFullScreen}
          />
        </>
      )}

      {selectedRole === 'owner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Revenue (MTD)</span>
                <span className="font-medium">$1,245,678</span>
              </div>
              <div className="flex justify-between">
                <span>Production Cost</span>
                <span className="font-medium">$845,231</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Gross Profit</span>
                <span className="text-green-600">$400,447</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>OEE</span>
                  <span className="font-medium">78.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Quality Rate</span>
                  <span className="font-medium">97.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.5%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRole === 'supervisor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Production Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Output</span>
                <span className="font-medium">245 units/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Target Output</span>
                <span className="font-medium">300 units/hr</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <span>Efficiency</span>
                  <span className="font-medium">81.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '81.7%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Line B - Temperature High</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Material Low - Resin A</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRole === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Equipment Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>MTBF (Mean Time Between Failures)</span>
                  <span className="font-medium">142 hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>MTTR (Mean Time To Repair)</span>
                  <span className="font-medium">2.7 hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Hydraulic System Check</p>
                  <p className="text-sm text-gray-500">Press #4 - Line B</p>
                </div>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Due in 2 days
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="font-medium">Conveyor Belt Inspection</p>
                  <p className="text-sm text-gray-500">Assembly Line 3</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Due in 5 days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRole === 'quality' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>First Pass Yield</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Defect Rate</span>
                  <span className="font-medium">2.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '2.8%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Defect Categories</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Surface Defects</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Dimensional Issues</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Assembly Errors</span>
                  <span className="font-medium">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'machineList' && (
        <MachineList 
          machines={selectedLine === 'All Lines' 
            ? machinesData 
            : machinesData.filter(m => m.line === selectedLine)
          } 
          onBack={() => setView('dashboard')} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* OEE Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">OEE Trend (30 Days)</h2>
            <div className="flex space-x-2">
              {(['day', 'week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedTimeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={plantOeeData}>
                <defs>
                  <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis 
                  domain={[60, 100]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value) => [`${value}%`, 'OEE']}
                />
                <Area
                  type="monotone"
                  dataKey="oee"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorOee)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operator Efficiency */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operator Efficiency</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={operatorEfficiencyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Efficiency']}
                />
                <Bar dataKey="efficiency" fill="#4F46E5" radius={[0, 4, 4, 0]}>
                  {operatorEfficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(99, 102, 241, ${0.6 + (index * 0.1)})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
                  onClick={() => toggleRecommendation(rec.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">{rec.icon}</div>
                    <span className="font-medium">{rec.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority}
                    </span>
                    {expandedRecommendation === rec.id ? (
                      <ChevronDown className="ml-2 text-gray-400" size={18} />
                    ) : (
                      <ChevronRight className="ml-2 text-gray-400" size={18} />
                    )}
                  </div>
                </button>
                {expandedRecommendation === rec.id && (
                  <div className="p-4 pt-0 text-sm text-gray-600 border-t">
                    {rec.description}
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      View details
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Month-on-Month Comparison */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Month-on-Month Comparison</h2>
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {kpiOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedKpi(option.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    selectedKpi === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {kpiOptions.map((kpi) => (
              <div 
                key={kpi.id}
                className={`p-4 rounded-lg ${
                  selectedKpi === kpi.id ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{kpi.label}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200">
                    {kpi.label === 'OEE' ? '%' : kpi.label === 'Availability' ? '%' : kpi.label === 'Performance' ? '%' : '%'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {kpiComparison.currentMonth[kpi.id as keyof typeof kpiComparison.currentMonth]}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">%</span>
                  </div>
                  <div className="flex items-center
                    ${
                      kpiComparison.currentMonth[kpi.id as keyof typeof kpiComparison.currentMonth] >=
                      kpiComparison.previousMonth[kpi.id as keyof typeof kpiComparison.previousMonth]
                        ? 'text-green-600'
                        : 'text-red-600'
                    }"
                  >
                    {kpiComparison.currentMonth[kpi.id as keyof typeof kpiComparison.currentMonth] >=
                    kpiComparison.previousMonth[kpi.id as keyof typeof kpiComparison.previousMonth] ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(
                        kpiComparison.currentMonth[kpi.id as keyof typeof kpiComparison.currentMonth] -
                        kpiComparison.previousMonth[kpi.id as keyof typeof kpiComparison.previousMonth]
                      )}%
                    </span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  vs {kpiComparison.previousMonth[kpi.id as keyof typeof kpiComparison.previousMonth]}% last month
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Alarms */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Alerts & Alarms</h2>
            <div className="flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              {alerts.length} Active Alerts
            </div>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  {alert.status === 'Critical' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : alert.status === 'Warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{alert.issue}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    <span className="text-xs text-gray-500">{alert.machine}</span>
                  </div>
                </div>
                <div className="ml-2">
                  <AlertBadge status={alert.status} />
                </div>
              </div>
            ))}
            <button className="w-full mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center">
              View all alerts
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Pareto Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Downtime Reasons</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={downtimeReasons}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Bar dataKey="value" name="Percentage">
                {downtimeReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
