import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({

    name: {
        type : String, 
        required : true
    },
    location :{
        type : String,
        required: true
    },
    description: {
        type: String

    },
    contact :{
        type:String

    },
    cuisine :{
        type :String,
        required: true
    },
    owner :{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required : true
    }
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;