const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
let VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const getAllCategories = async (req, res) => {
  try {
    const cateList = await CategoryModel.find();
    res.status(200).json({ status: 200, message: "ListCate", data: cateList });
  } catch (e) {
    res.status(500).send("Lỗi truy vấn dữ liệu");
    console.log(e);
  }
};

const addCate = async (req, res) => {
  const { CateName } = req.body;
  try {
    const cre = await CategoryModel.create({
      CateName: CateName,
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
  const {
    ProductName,
    ProductPrice,
    ProductDes,
    discount,
    categoryId,
    inStock,
    featured,
    image
  } = req.body;

  try {
    const newProduct = await ProductModel.create({
      ProductName,
      ProductPrice,
      ProductDes,
      discount,
      categoryId,
      inStock,
      featured,
      image,
    });

    res.status(200).json({ message: "Thêm sản phẩm thành công", data: newProduct });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm" });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  console.log("ID: ", id)
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: "Sửa sản phẩm thành công", data: updatedProduct });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
  }
};
const deleteProduct = async (req,res) => {
  const {id} = req.params;
  try {
    await ProductModel.deleteOne({ _id: id});
    return res.status(200).json({message: "xóa thành công sản phẩm"})
  }catch (e) {
    console.log(e)
    return res.status(500).json({message: 'Lỗi khi xóa sản phẩm', e})
  }
}

const uploadProductImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Không có ảnh nào được upload!" });
  }
  try {
    const filenames = req.files.map(file => file.filename);
    console.log("fileName",filenames)
    return res.status(200).json({
      message: "Upload ảnh thành công",
      images: filenames
    });
  } catch (err) {
    console.error("Lỗi upload ảnh sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getTopSoldProduct = async (req, res) => {
  try {
    const productList = await ProductModel.find().sort({ sold: -1 }).limit(10); // Limit to top 10 products
    const totalProducts = await ProductModel.countDocuments();
    res.status(200).json({
      status: 200,
      message: "Top sold products retrieved successfully",
      data: productList,
      totalProducts: totalProducts,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving top sold products",
      error: e.message,
    });
    console.error("Error in getTopSoldProduct:", e);
  }
};

const getProductByCategory = async (req, res) => {
  const categoryQuery = req.query.category;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!categoryQuery) {
    return res.status(400).json({ error: "Thiếu tham số category" });
  }

  // Tách chuỗi thành mảng và lọc những id hợp lệ
  const categoryIds = categoryQuery
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id);

  try {
    const products = await ProductModel.find({
      categoryId: { $in: categoryIds },
    })
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "GetProduct", status: 200, data: products });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getProductDetail = async (req, res) => {
  const cId = req.params.ProductID;
  try {
    await ProductModel.findOne({ _id: cId }).then((productDetail) => {
      res.status(200).json({
        status: 200,
        message: "GetProductDetail",
        data: productDetail,
      });
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};
const getAll = async (req, res) => {
  const keyWord = req.query.keyWord;
  const { page = 1, limit = 10 } = req.query;

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
      totalProducts: totalProducts,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving products",
      error: e.message,
    });
    console.error("Error in getAllProduct:", e);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const productList = await await ProductModel.find()
    res.status(200).json({
      status: 200,
      message: "List",
      data: productList,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving products",
      error: e.message,
    });
    console.error("Error in getAllProduct:", e);
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await ProductModel.find({
      featured: true,
    })
    res
      .status(200)
      .json({ status: 200, message: "List", data: featuredProducts });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving products",
      error: e.message,
    });
    console.error("Error in getFeaturedProducts:", e);
  }
};

const getDiscountedProducts = async (req, res) => {
  try {
    const discountedProducts = await ProductModel.find({
      discount: { $gt: 0 },
    })
    res
      .status(200)
      .json({ status: 200, message: "List", data: discountedProducts });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving products",
      error: e.message,
    });
    console.error("Error in getDiscountedProducts:", e);
  }
};

module.exports = {
  addCate,
  editCate,
  deleteCate,
  getAllCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getProductByCategory,
  getProductDetail,
  getTopSoldProduct,
  getAll,
  getAllProduct,
  getFeaturedProducts,
  getDiscountedProducts,
};
