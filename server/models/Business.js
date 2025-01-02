const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  role:{
    type: String,
    required: false,
  },
  updatedBy:{
    type: String,
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

const businessSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  roles:{
    type: Array,
    required: false,
  },
  userId:{
    type: String,
    required: false,
  },
  shifts: [shiftSchema],
}, { timestamps: true });

businessSchema.index({ userId: 1 });
employeeSchema.index({ companyId: 1 });

const Business = mongoose.model("company", businessSchema);
const Employee = mongoose.model("employee", employeeSchema);

module.exports = { Business, Employee };
