import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  branchId: {
     type: String,
     required: true
     },
  date: { 
    type: String, 
    required: true 
},
  timeSlots: [{
    time: String,
    available: Boolean
  }]
});

export default mongoose.model('Availability', availabilitySchema);