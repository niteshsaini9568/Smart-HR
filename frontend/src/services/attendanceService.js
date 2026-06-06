import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

const attendanceService = {
  // Get today's attendance status
  async getTodayStatus() {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/today`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch today\'s attendance status');
    }

    return response.json();
  },

  // Clock in
  async clockIn() {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/clock-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to clock in');
    }

    return response.json();
  },

  // Clock out
  async clockOut() {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/clock-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to clock out');
    }

    return response.json();
  },

  // Get my attendance history
  async getMyAttendance(page = 1, limit = 31) {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/my-history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch attendance history');
    }

    return response.json();
  },

  // Submit leave request
  async submitLeaveRequest(leaveData) {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit leave request');
    }

    return response.json();
  },

  // Get all pending leave requests (Admins/Managers)
  async getPendingLeaves() {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/admin/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch pending leave requests');
    }

    return response.json();
  },

  // Approve or reject leave request (Admins/Managers)
  async actionLeaveStatus(leaveActionData) {
    const token = authService.getToken();
    const response = await fetch(`${API_ENDPOINTS.ATTENDANCE}/admin/leaves`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(leaveActionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to action leave request');
    }

    return response.json();
  },

  // Get daily attendance logs (Admins/Managers)
  async getDailyAttendance(date = '') {
    const token = authService.getToken();
    const url = date 
      ? `${API_ENDPOINTS.ATTENDANCE}/admin/daily?date=${date}`
      : `${API_ENDPOINTS.ATTENDANCE}/admin/daily`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch daily attendance logs');
    }

    return response.json();
  },
};

export default attendanceService;
