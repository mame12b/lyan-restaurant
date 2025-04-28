import Order from "../models/Order.js";

export const getOrders = async (req, res)=>{

    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: "Error fetching orders", error:error.message});

    }
};
 // get a single order 
 export const getOrderById = async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({message: "order not found", error: error.message}) 
        
    res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: "error fetching order", error: error.message})
    }
 };

 export const updateOrder = async (req, res) =>{
    try {
        const {orderStatus, paymentStatus}= req.body;
        const order= await Order.findByIdAndUpdate(req.params.id, 
            {orderStatus,paymentStatus},
        {new :true}
    );
     if (!order) return res.status(404).json({message:"order not found"});

     res.status(200).json({message: "order updated", order})
    } catch (error) {
        res.status(500).json({message:" error updating order", error: error.message});
    }
 };
// Delete an order 
export const deleteOrder = async (req, res) =>{
    try {
        const order= await Order.findByIdAndDelete(req.params.id);
        if(!order) return res.status(404).json({message: "order nor found", error: error.message});

        res.status(200).json({message: "order delete successfully"});
    } catch (error) {
        res.status(500).json({message: "error delete order", error: error.message});
    }
};