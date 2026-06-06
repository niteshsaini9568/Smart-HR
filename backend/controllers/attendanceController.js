const Attendance = require('../models/Attendance');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// Helper function to get dates in range as YYYY-MM-DD strings
const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let curr = new Date(startDate);
  const end = new Date(endDate);
  
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

// @desc    Clock In
// @route   POST /api/v1/attendance/clock-in
// @access  Private
exports.clockIn = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // Check if today's record already exists
  let record = await Attendance.findOne({ user: req.user.id, date: dateStr });

  if (record) {
    if (record.clockIn) {
      return next(new ErrorResponse('You have already clocked in for today', 400));
    }
    // If it was created as a pending/approved leave, handle it
    if (record.leaveRequest && record.leaveRequest.isLeave && record.leaveRequest.status === 'Approved') {
      return next(new ErrorResponse('Cannot clock in on an approved leave day', 400));
    }
  }

  // Determine status (Late if after 9:30 AM)
  const clockInHour = now.getHours();
  const clockInMinutes = now.getMinutes();
  let status = 'Present';

  if (clockInHour > 9 || (clockInHour === 9 && clockInMinutes > 30)) {
    status = 'Late';
  }

  if (record) {
    // If record exists (e.g. rejected leave or placeholder), update it
    record.clockIn = now;
    record.status = status;
    await record.save();
  } else {
    // Create new record
    record = await Attendance.create({
      user: req.user.id,
      date: dateStr,
      clockIn: now,
      status
    });
  }

  res.status(200).json({
    success: true,
    data: record
  });
});

// @desc    Clock Out
// @route   POST /api/v1/attendance/clock-out
// @access  Private
exports.clockOut = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const record = await Attendance.findOne({ user: req.user.id, date: dateStr });

  if (!record) {
    return next(new ErrorResponse('You must clock in first', 400));
  }

  if (record.clockOut) {
    return next(new ErrorResponse('You have already clocked out for today', 400));
  }

  record.clockOut = now;

  // Calculate work hours
  const hours = (record.clockOut - record.clockIn) / (1000 * 60 * 60);
  record.workHours = Math.round(hours * 100) / 100; // round to 2 decimal places

  // Update status to Half-Day if worked less than 4 hours
  if (record.workHours < 4) {
    record.status = 'Half-Day';
  }

  await record.save();

  res.status(200).json({
    success: true,
    data: record
  });
});

// @desc    Get current user's today status
// @route   GET /api/v1/attendance/today
// @access  Private
exports.getTodayStatus = asyncHandler(async (req, res, next) => {
  const dateStr = new Date().toISOString().split('T')[0];
  const record = await Attendance.findOne({ user: req.user.id, date: dateStr });

  res.status(200).json({
    success: true,
    data: record || null
  });
});

// @desc    Get current user's attendance history
// @route   GET /api/v1/attendance/my-history
// @access  Private
exports.getMyAttendance = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 31; // default to a month
  const skip = (page - 1) * limit;

  const records = await Attendance.find({ user: req.user.id })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Attendance.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: records.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: records
  });
});

// @desc    Submit leave request
// @route   POST /api/v1/attendance/leaves
// @access  Private
exports.submitLeaveRequest = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, type, reason } = req.body;

  if (!startDate || !endDate || !type || !reason) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return next(new ErrorResponse('Start date must be before end date', 400));
  }

  const dates = getDatesInRange(start, end);
  const records = [];

  for (const dateStr of dates) {
    // Check if attendance already exists on this day with actual clock-in
    const existing = await Attendance.findOne({ user: req.user.id, date: dateStr });
    if (existing && existing.clockIn) {
      return next(new ErrorResponse(`Cannot request leave for ${dateStr} as you have already clocked in on that day`, 400));
    }

    const record = await Attendance.findOneAndUpdate(
      { user: req.user.id, date: dateStr },
      {
        user: req.user.id,
        date: dateStr,
        status: 'On-Leave',
        leaveRequest: {
          isLeave: true,
          status: 'Pending',
          type,
          reason,
          startDate: start,
          endDate: end
        }
      },
      { upsert: true, new: true, runValidators: true }
    );
    records.push(record);
  }

  res.status(201).json({
    success: true,
    count: records.length,
    data: records
  });
});

// @desc    Get all pending leave requests (Consolidated)
// @route   GET /api/v1/attendance/admin/pending
// @access  Private (HR/Manager/Admin)
exports.getPendingLeaves = asyncHandler(async (req, res, next) => {
  // Use aggregation to group individual leave days into consolidated requests
  const leaves = await Attendance.aggregate([
    { 
      $match: { 
        'leaveRequest.isLeave': true, 
        'leaveRequest.status': 'Pending' 
      } 
    },
    {
      $group: {
        _id: {
          user: '$user',
          startDate: '$leaveRequest.startDate',
          endDate: '$leaveRequest.endDate',
          type: '$leaveRequest.type',
          reason: '$leaveRequest.reason'
        },
        records: { $push: '$_id' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    { $unwind: '$userDetails' },
    {
      $project: {
        _id: 0,
        userId: '$_id.user',
        firstName: '$userDetails.firstName',
        lastName: '$userDetails.lastName',
        email: '$userDetails.email',
        department: '$userDetails.department',
        startDate: '$_id.startDate',
        endDate: '$_id.endDate',
        type: '$_id.type',
        reason: '$_id.reason',
        records: '$records'
      }
    },
    { $sort: { startDate: 1 } }
  ]);

  res.status(200).json({
    success: true,
    count: leaves.length,
    data: leaves
  });
});

// @desc    Action leave request (Approve/Reject)
// @route   PUT /api/v1/attendance/admin/leaves
// @access  Private (HR/Manager/Admin)
exports.actionLeaveStatus = asyncHandler(async (req, res, next) => {
  const { userId, startDate, endDate, status } = req.body;

  if (!userId || !startDate || !endDate || !status) {
    return next(new ErrorResponse('Please provide userId, startDate, endDate, and status', 400));
  }

  if (!['Approved', 'Rejected'].includes(status)) {
    return next(new ErrorResponse('Status must be Approved or Rejected', 400));
  }

  const startStr = new Date(startDate).toISOString().split('T')[0];
  const endStr = new Date(endDate).toISOString().split('T')[0];

  // Update Mongoose records
  const result = await Attendance.updateMany(
    {
      user: userId,
      date: { $gte: startStr, $lte: endStr },
      'leaveRequest.isLeave': true
    },
    {
      $set: {
        'leaveRequest.status': status,
        status: status === 'Approved' ? 'On-Leave' : 'Absent'
      }
    }
  );

  res.status(200).json({
    success: true,
    message: `Leave request successfully ${status.toLowerCase()} for ${result.modifiedCount} days.`,
    modifiedCount: result.modifiedCount
  });
});

// @desc    Get daily attendance for all users (Manager/HR/Admin dashboard view)
// @route   GET /api/v1/attendance/admin/daily
// @access  Private (HR/Manager/Admin)
exports.getAllAttendance = asyncHandler(async (req, res, next) => {
  const dateStr = req.query.date || new Date().toISOString().split('T')[0];
  
  const query = { date: dateStr };

  // If manager, only display records for users in their department
  if (req.user.role === 'manager' && req.user.department) {
    const departmentUsers = await User.find({ department: req.user.department }).select('_id');
    const userIds = departmentUsers.map(u => u._id);
    query.user = { $in: userIds };
  }

  const attendanceRecords = await Attendance.find(query)
    .populate('user', 'firstName lastName email department position');

  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    date: dateStr,
    data: attendanceRecords
  });
});
