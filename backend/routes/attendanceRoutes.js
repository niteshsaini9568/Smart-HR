const express = require('express');
const {
  clockIn,
  clockOut,
  getTodayStatus,
  getMyAttendance,
  submitLeaveRequest,
  getPendingLeaves,
  actionLeaveStatus,
  getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All attendance routes require authentication
router.use(protect);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/today', getTodayStatus);
router.get('/my-history', getMyAttendance);
router.post('/leaves', submitLeaveRequest);

// Admin / HR / Manager only routes
router.get('/admin/pending', authorize('hr_recruiter', 'manager', 'admin'), getPendingLeaves);
router.put('/admin/leaves', authorize('hr_recruiter', 'manager', 'admin'), actionLeaveStatus);
router.get('/admin/daily', authorize('hr_recruiter', 'manager', 'admin'), getAllAttendance);

module.exports = router;
