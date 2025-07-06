import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  action: 'punch_in' | 'punch_out';
  timestamp: Date;
  location?: string;
  notes?: string;
  createdAt: Date;
}

const attendanceSchema = new Schema<IAttendance>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  action: {
    type: String,
    enum: ['punch_in', 'punch_out'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
attendanceSchema.index({ employee: 1, timestamp: -1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
