'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { attendanceAPI } from '@/lib/api';
import { socketService } from '@/lib/socket';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AttendanceRecord {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
    position: string;
  };
  action: 'punch_in' | 'punch_out';
  timestamp: string;
  location?: string;
  notes?: string;
}

export default function AttendanceManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadAttendance();

    // Connect to WebSocket for real-time updates
    socketService.connect();
    socketService.joinAdminRoom();
    
    socketService.onAttendanceUpdate((data) => {
      loadAttendance(); // Refresh attendance when updates occur
    });

    return () => {
      socketService.leaveAdminRoom();
      socketService.disconnect();
    };
  }, [router]);

  const loadAttendance = async () => {
    try {
      const response = await attendanceAPI.getAll({
        startDate,
        endDate
      });
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    setLoading(true);
    loadAttendance();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getActionColor = (action: string) => {
    return action === 'punch_in' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const groupAttendanceByEmployee = () => {
    const grouped: { [key: string]: AttendanceRecord[] } = {};
    
    attendance.forEach(record => {
      const employeeId = record.employee._id;
      if (!grouped[employeeId]) {
        grouped[employeeId] = [];
      }
      grouped[employeeId].push(record);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-8 border-primary/10"></div>
          <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  const groupedAttendance = groupAttendanceByEmployee();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="glass-effect shadow-sm border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Attendance Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-gray-500 capitalize">{user?.role.replace('_', ' ')}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Enhanced Navigation */}
          <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white/60 rounded-2xl border border-white/30 backdrop-blur-sm">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/employees')}
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Employees
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/tasks')}
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tasks
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/attendance')}
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-4 8H9m0 0v3m0-3h3m-3 0l-3-3m3 3l3-3M4 9h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V11a2 2 0 012-2z" />
              </svg>
              Attendance
            </Button>
            <Button 
              onClick={() => router.push('/attendance')}
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Punch Terminal
            </Button>
          </div>

          {/* Date Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Attendance</CardTitle>
              <CardDescription>Select date range to view attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleDateFilter}>
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Records</CardTitle>
                <CardDescription>All punch in/out records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendance.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unique Employees</CardTitle>
                <CardDescription>Employees with attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(groupedAttendance).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>Records for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendance.filter(record => 
                    new Date(record.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Records by Employee */}
          <div className="space-y-6">
            {Object.entries(groupedAttendance).map(([employeeId, records]) => {
              const employee = records[0].employee;
              return (
                <Card key={employeeId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{employee.name}</span>
                      <span className="text-sm font-normal text-gray-600">
                        {employee.position}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {records.length} record(s) in selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {records.map((record) => (
                        <div key={record._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded text-sm font-medium ${getActionColor(record.action)}`}>
                              {record.action.replace('_', ' ').toUpperCase()}
                            </span>
                            <div>
                              <p className="font-medium">{formatTime(record.timestamp)}</p>
                              {record.location && (
                                <p className="text-sm text-gray-600">Location: {record.location}</p>
                              )}
                              {record.notes && (
                                <p className="text-sm text-gray-600">Notes: {record.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {attendance.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No attendance records found for the selected period</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
