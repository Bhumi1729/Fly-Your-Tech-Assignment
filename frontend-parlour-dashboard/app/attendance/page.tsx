'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { attendanceAPI } from '@/lib/api';
import { socketService } from '@/lib/socket';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  isCheckedIn: boolean;
  lastActivity: string | null;
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
    
    // Connect to WebSocket for real-time updates
    socketService.connect();
    
    socketService.onAttendanceUpdate((data) => {
      loadEmployees(); // Refresh employee list when attendance updates
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await attendanceAPI.getEmployeeStatus();
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePunch = async (employeeId: string, action: 'punch_in' | 'punch_out') => {
    setProcessingId(employeeId);
    
    try {
      await attendanceAPI.punchInOut({
        employeeId,
        action,
        location: 'Front Desk'
      });
      
      // Refresh employee list
      await loadEmployees();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to record attendance');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Loading Attendance Terminal</h2>
            <p className="text-gray-600 animate-pulse">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Employee Attendance Terminal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to the attendance terminal. Select your profile below to punch in or out for your shift.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live tracking enabled</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee, index) => (
            <Card key={employee._id} className="glass-effect border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="text-center pb-4">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                    employee.isCheckedIn 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    <span className="text-white text-2xl font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-md ${
                    employee.isCheckedIn ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{employee.name}</CardTitle>
                <CardDescription className="text-gray-600 font-medium text-base">{employee.position}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                    employee.isCheckedIn 
                      ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-2 border-gray-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      employee.isCheckedIn ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    {employee.isCheckedIn ? 'Currently Checked In' : 'Currently Checked Out'}
                  </span>
                </div>
                
                {employee.lastActivity && (
                  <div className="bg-white/60 rounded-lg p-3 border border-white/30">
                    <p className="text-sm text-gray-600 font-medium">Last Activity</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {new Date(employee.lastActivity).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {employee.isCheckedIn ? (
                    <Button
                      onClick={() => handlePunch(employee._id, 'punch_out')}
                      disabled={processingId === employee._id}
                      variant="destructive"
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {processingId === employee._id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Punch Out</span>
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePunch(employee._id, 'punch_in')}
                      disabled={processingId === employee._id}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {processingId === employee._id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Punch In</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-6">There are no employees available for attendance tracking at this time.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
