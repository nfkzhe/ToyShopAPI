const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
let VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const getAllCategories = async (req, res) => {
  try {
    const cateList = await CategoryModel.find();
    res.status(200)
    .json({ status: 200, message: "ListCate", data: cateList });
  }catch (e) {
    res.status(500).send("Lỗi truy vấn dữ liệu");
    console.log(e)
  }
}

const addCate = async (req, res) => {
  const { CateName } = req.body;
  try {
    const cre = await CategoryModel.create({
      CateName: CateName
    });
    return res
      .status(200)
      .json({ message: "them khoa hoc thanh cong", data: cre });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const editCate = async (req, res) => {
  const cId = req.params.CateID;
  console.log(req.params.CateID);
  const { CateName } = req.body;
  try {
    const updateData = {
      CateName: CateName,
    };
    await CategoryModel.findByIdAndUpdate(cId, updateData);
    return res
      .status(200)
      .json({ message: "Update Thanh Cong", data: updateData });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const deleteCate = async (req, res) => {
  const cId = req.params.CateID;
  await CategoryModel.deleteOne({ _id: cId });
  return res.status(200).json({ mesage: "xóa thành công " });
};

const addProduct = async (req, res) => {
  const { ProductName, ProductPrice, ProductDes, ProductQuantity, categoryId, image } = req.body;
  try {
    const cre = await ProductModel.create({
      ProductName: ProductName,
      ProductPrice: ProductPrice,
      ProductQuantity: ProductQuantity,
      ProductDes: ProductDes,
      categoryId: categoryId,
      image: image,
    });
    return res
      .status(200)
      .json({ message: "ĐÃ THÊM", data: cre });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

const getTopSoldProduct = async (req, res) => {
  try {
    const productList = await ProductModel.find()
      .sort({ sold: -1 })
      .limit(10); // Limit to top 10 products
    const totalProducts = await ProductModel.countDocuments();
    res.status(200).json({ 
      status: 200,
      message: "Top sold products retrieved successfully",
      data: productList,
      totalProducts: totalProducts
    });
  } catch (e) {
    res.status(500).json({ 
      status: 500,
      message: "Error retrieving top sold products",
      error: e.message 
    });
    console.error("Error in getTopSoldProduct:", e);
  }
};

const getProductByCategory = async (req, res) => {
    const cId = req.query.category;
    try {
    const filteredProducts = await ProductModel.find({ categoryId: cId });
    
    if (filteredProducts.length === 0) {
      return res.status(200).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' ,data: [null]});
    }
  
    res.status(200).json({ message: 'GetProduct',status: 200, data: filteredProducts });
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
};

const getProductDetail = async (req, res) => {
  const cId = req.params.ProductID;
  try {
  await ProductModel.findOne({ _id: cId }).then((productDetail) => {
    res.status(200).json({status: 200, message: 'GetProductDetail', data: productDetail});
  }); 
  } catch (e) {
    res.status(500).send(e);
    console.log(e)
  }
};
const getAll = async (req, res) => {
  const keyWord = req.query.keyWord;
  const { page = 1, limit = 2 } = req.query;

  // tim ten den tu query string
  let condition = {};
  if (keyWord && keyWord.length > 0) {
    condition.email = { $regex: keyWord, $options: "i" };
  }
  try {
    const productList = await await ProductModel.find(condition)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec(); // Limit to top 10 products
    const totalProducts = await ProductModel.countDocuments(condition);
    res.status(200).json({ 
      status: 200,
      message: "List",
      data: productList,
      totalProducts: totalProducts/limit,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).json({ 
      status: 500,
      message: "Error retrieving top sold products",
      error: e.message 
    });
    console.error("Error in getTopSoldProduct:", e);
  }
};


module.exports = {
  addCate,
  editCate,
  deleteCate,
  getAllCategories,
  addProduct,
  getProductByCategory,
  getProductDetail,
  getTopSoldProduct,
  getAll,
};
