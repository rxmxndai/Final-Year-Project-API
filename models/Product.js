const mongoose = require("mongoose")

const productSchema = new mongoose.Schema( {
        title: {
            type: String, 
            required: true,
        },
        description: {
            type: String, 
            required: true,
        },
        img: {
            type: buffer, 
            required: true,
        }, 
        category: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: "Category"
        }, 
        specification: {
            type: Object, 
            required: true,
        }, 
        price: {
            type: Number, 
            required: true,
        }, 

    }, 

    { timestamps : true }
);

module.exports = mongoose.model('Product', productSchema);