// import mongoose from "mongoose";

// const menuSchema = new mongoose.Schema({
//     branchId: { 
//         type: mongoose.Schema.Types.ObjectId, ref: "Branch", 
//         required: true 
//     },
//     itemName: { 
//         type: String, 
//         required: true 
//     },
//     price: { 
//         type: Number, 
//         required: true 
//     },
//     description: { 
//         type: String 
//     },
//     category: { 
//         type: String, 
//         required: true
//     },
// }, { timestamps: true });

// export default mongoose.model("Menu", menuSchema);


import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'main-courses', 'desserts', 'beverages']
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  tags: {
    type: [String],
    enum: ['vegetarian', 'vegan', 'gluten-free', 'spicy', 'chef-special'],
    default: []
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
menuSchema.index({ branch: 1, category: 1 });
menuSchema.index({ name: 'text', description: 'text', tags: 'text' }, {
  weights: {
    name: 5,
    description: 2,
    tags: 3
  }
});

export default mongoose.model("Menu", menuSchema);
