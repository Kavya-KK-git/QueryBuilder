const Product = require("../models/productModels");

const handleGet = async (req, res) => {
  try {
    const {
      startRow = 0,
      endRow = 100,
      sortModel = "[]",
      filterModel = "{}",
    } = req?.body;
    const start = parseInt(startRow) || 0;
    const limit = parseInt(endRow) - start || 100;
    const quickFilter = req.body.quickFilter?.trim() || "";

    const sortObj = {};

    const sortModelParsed = JSON.parse(sortModel) || "[]";
    if (sortModelParsed.length > 0) {
      const sort = sortModelParsed[0].sort;
      const colId = sortModelParsed[0].colId;
      sortObj[colId] = sort === "asc" ? 1 : -1;
    }

    const filterObj = {};
    if (quickFilter) {
      filterObj.$or = [
        { name: { $regex: quickFilter, $options: "i" } },
        { category: { $regex: quickFilter, $options: "i" } },
        { "details.flavour": { $regex: quickFilter, $options: "i" } },
      ];
    }
    const filterModelParsed = JSON.parse(filterModel) || "{}";
    Object.entries(filterModelParsed).forEach(([field, fieldDetails]) => {
      const { filterType, type, filter, dateFrom } = fieldDetails;
      if (filterType === "text") {
        if (type === "contains") {
          filterObj[field] = { $regex: filter, $options: "i" };
        } else if (type === "notContains") {
          filterObj[field] = { $not: { $regex: filter, $options: "i" } };
        } else if (type === "equals") {
          filterObj[field] = { $eq: filter };
        } else if (type === "notEqual") {
          filterObj[field] = { $ne: filter };
        } else if (type === "startsWith") {
          filterObj[field] = { $regex: `^${filter}`, $options: "i" };
        } else if (type === "endsWith") {
          filterObj[field] = { $regex: `${filter}$`, $options: "i" };
        } else if (type === "blank") {
          filterObj[field] = { $in: [null] };
        } else if (type === "notBlank") {
          filterObj[field] = { $nin: [null] };
        }
      }

      if (filterType === "date") {
        const startOfDay = new Date(dateFrom);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        if (type === "equals") {
          filterObj[field] = {
            $gte: startOfDay,
            $lt: endOfDay,
          };
        } else if (type === "after") {
          filterObj[field] = { $gt: endOfDay };
        } else if (type === "before") {
          filterObj[field] = { $lt: startOfDay };
        }
      }

      if (filterType === "number") {
        const number = parseInt(filter);
        if (type === "equals") {
          filterObj[field] = { $eq: number };
        } else if (type === "greaterThan") {
          filterObj[field] = { $gt: number };
        } else if (type === "lessThan") {
          filterObj[field] = { $lt: number };
        } else if (type === "notEqual") {
          filterObj[field] = { $ne: number };
        }
      }
    });

    const products = await Product.find(filterObj)
      .sort(sortObj)
      .skip(start)
      .limit(limit);

    // console.log("Fetched products", JSON.stringify(products));

    const totalCount = await Product.countDocuments(filterObj);
    return res.status(200).json({
      data: products,
      lastRow: totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      data: [],
      lastRow: 0,
      message: "Failed to get product data",
    });
  }
};

const handlePost = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    const io = req.app.get("io");
    io.emit("productCreated", newProduct);

    return res.status(200).json({
      success: true,
      data: newProduct,
      message: "Successfully added product data",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      data: error.message,
      message: "Failed to add product data",
    });
  }
};

const handlePut = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Product ID doesn't exist.",
      });
    }
    const io = req.app.get("io");
    io.emit("productUpdated", updatedProduct);

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Successfully updated product data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      data: error,
      message: "Failed to update product data",
    });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Product ID doesn't exist.",
      });
    }
    const io = req.app.get("io");
    io.emit("productDeleted", { id });

    return res.status(200).json({
      success: true,
      data: deleteProduct,
      message: "Successfully deleted product data",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
      message: "Failed to delete product data",
    });
  }
};

module.exports = {
  handleGet,
  handlePost,
  handlePut,
  handleDelete,
};
