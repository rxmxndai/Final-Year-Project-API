const Product = require("../../models/Product");
const { JOIproductSchemaValidate } = require("../../middlewares/JoiValidator");
const tryCatch = require("../../utils/tryCatch");
const customError = require("../../utils/customError");
const sharp = require("sharp")




// adding new products
const addProduct = tryCatch(async (req, res) => {

    const { title, description, category, price, quantity } = req.body;
    let images = [];

    if (req.files.length > 0) {
        images = await Promise.all(req.files.map(async file => {
            console.log(file);
            const buffer = await sharp(file.buffer).png().toBuffer()
            return buffer
        }));
    }

    const productValue = {
        title,
        description,
        images,
        category,
        quantity,
        price,
        createdBy: req.user._id
    }

    const { error, value } = await JOIproductSchemaValidate(productValue);

    if (error) throw new customError(`${error.details[0].message}`, 202)


    const saveProduct = new Product(value);

    const product = await saveProduct.save();

    return res.status(201).json({
        product
    });
})




// update product
const updateProduct = tryCatch(async (req, res) => {

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    )
    console.log("Product added!");
    return res.status(201).json(updatedProduct);
})




// delete product
const deleteProduct = tryCatch(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) throw new Error("No record found")


    const { ...product } = deletedProduct._doc;

    res.status(200).json({ ...product, msg: "Product deleted" })
})



// get particular product
const getOneProduct = tryCatch(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) throw new Error("No record found")

    res.set("Content-Type", "image/jpg")

    return res.status(200).json(product.images[0])
})








module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getOneProduct,
    getAllProducts
}
