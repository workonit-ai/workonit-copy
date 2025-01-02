const mongoose = require("mongoose");

const weeklyScheduleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Initiated', 'Suggested', 'Finalized'],
    default: 'Initiated',
  },
  nextScheduleStart: {
    type: Date,
    required: true,
  },
  nextScheduleInitiationDate: {
    type: Date,
    required: true,
  },
  availabilitySubmissionDeadline: {
    type: Date,
    required: true,
  },
  // This will be in minutes
  checkInterval:{
    type: String,
    required: false,
  },
  nextCheck: {
    type: Date,
    required: false,
  }

}, { timestamps: true });


const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dayOfTheWeek: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
}, { _id: false });


const employeeAvailabilitySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  weeklyScheduleId: {
    type: String,
    required: true,
  },
  availabilities: [shiftSchema],
  submissionStatus: {
    type: String,
    enum: ['Pending', 'Submitted'],
    default: 'Pending',
  },
  lastChecked: {
    type: Date,
    required: false,
    default: () => new Date(),
  },
  updated_on_behalf_of_user: {
    type: String,
    required: false,
  }
}, { timestamps: true });

weeklyScheduleSchema.index({ companyId: 1, startDate: 1 });
employeeAvailabilitySchema.index({ employeeId: 1, weeklyScheduleId: 1 });

const WeeklySchedule = mongoose.model("weeklySchedule", weeklyScheduleSchema);
const EmployeeAvailability = mongoose.model("availability", employeeAvailabilitySchema);

module.exports = { 
  WeeklySchedule, 
  EmployeeAvailability 
};


async function getPendingEmployeesAvailibilities(weeklyScheduleId) {
  try {
    const availabilities = await EmployeeAvailability.find({ 
      weeklyScheduleId,
      submissionStatus: 'Pending'
    })
      .populate('employeeId', 'email') // Populate employeeId to get the email field
      .exec();

    // const emails = availabilities.map(availability => availability.employeeId.email);
    return availabilities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllEmployeesAvailabilities(weeklyScheduleId){
  try {
    const availabilities = await EmployeeAvailability.find({ 
      weeklyScheduleId
    })
      .populate('employeeId', 'email') // Populate employeeId to get the email field
      .exec();

    // const emails = availabilities.map(availability => availability.employeeId.email);
    return availabilities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports.getPendingEmployeesAvailibilities = getPendingEmployeesAvailibilities;
module.exports.getAllEmployeesAvailabilities = getAllEmployeesAvailabilities;