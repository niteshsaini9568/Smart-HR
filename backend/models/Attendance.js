const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  clockIn: {
    type: Date
  },
  clockOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half-Day', 'On-Leave'],
    default: 'Present'
  },
  workHours: {
    type: Number,
    default: 0 // calculated on clock out
  },
  leaveRequest: {
    isLeave: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['None', 'Pending', 'Approved', 'Rejected'],
      default: 'None'
    },
    type: {
      type: String,
      enum: ['Sick', 'Casual', 'Earned', 'Unpaid', 'None'],
      default: 'None'
    },
    reason: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Ensure a user only has one attendance/leave record per specific date
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
