const express=require('express');
const protect=require('../middleware/authMiddleware');
const admin=require('../middleware/adminMiddleware');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct}=require('../controller/productController');
const router=express.Router();
const multer=require('multer');
const upload=multer({dest:'uploads/'});
//all products:
router.get('/', getProducts);
router.get('/:id',getProductById);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/', protect, admin,upload.single('image'), createProduct);

module.exports = router;