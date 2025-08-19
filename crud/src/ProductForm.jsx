import React, { useState } from "react";
import { Button, Modal, DatePicker, Input, InputNumber } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ProductTable from "./ProductTable";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import api from "./axiosInstance";
import LogoutButton from "./LogoutButton";

const ProductForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    mfd: "",
    mrp: "",
    details: [],
  });
  const [detailForm, setDetailForm] = useState({
    flavour: "",
    instock: "",
    sales: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailEditIndex, setDetailEditIndex] = useState(null);

  const resetForm = () => {
    setForm({ name: "", category: "", mfd: "", mrp: "", details: [] });
    setIsEditing(false);
    setEditId(null);
  };

  const resetDetailForm = () => {
    setDetailForm({ flavour: "", instock: "", sales: "" });
    setIsEditing(false);
    setDetailEditIndex(null);
  };

  const handleAdd = async () => {
    if (!form.name || !form.category || !form.mfd || !form.mrp) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await api.post("/v1/product/post-product", form);
      if (res.data.success) {
        console.log("while adding", res.data);
        toast.success("Product added successfully");
        resetForm();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  const handleAddDetail = () => {
    if (!detailForm.flavour || !detailForm.instock || !detailForm.sales) {
      toast.error("Please fill all fields");
      return;
    }

    const updatedDetails = [...form.details];
    if (detailEditIndex !== null) {
      updatedDetails[detailEditIndex] = detailForm;
      toast.success("Detail updated");
    } else {
      updatedDetails.push(detailForm);
      toast.success("Detail added");
    }
    setForm({ ...form, details: updatedDetails });
    resetDetailForm();
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put("/v1/product/put-product", {
        id: editId,
        ...form,
      });

      if (res.data.success) {
        toast.success("Product updated successfully");
        resetForm();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = async (product) => {
    try {
      await api.delete("/v1/product/delete-product", {
        data: { id: product._id },
      });
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
    }
  };

  const handleEdit = (product) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      mfd: product.mfd,
      mrp: product.mrp,
      details: product.details,
    });
  };

  const handleDetailDelete = async (index) => {
    const updatedDetails = form.details.filter((item, idx) => idx !== index);
    setForm({ ...form, details: updatedDetails });
    resetDetailForm();
  };

  const handleDetailEdit = (detail, index) => {
    setDetailForm(detail);
    setDetailEditIndex(index);
  };

  return (
    <div>
      <div className="flex justify-between mt-10 mx-60">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add New Product
        </Button>
        <LogoutButton />
      </div>

      <Modal
        title="Enter Product Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-5 w-96">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Food Item"
          />
          <Input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
          />
          <DatePicker
            value={form.mfd ? dayjs(form.mfd) : null}
            onChange={(date) =>
              setForm({ ...form, mfd: date.toDate().toISOString() })
            }
            placeholder="Manufacture Date"
          />

          <InputNumber
            value={form.mrp}
            onChange={(value) => setForm({ ...form, mrp: value })}
            style={{ width: "100%" }}
            min={1}
            max={10000}
            placeholder="MRP"
          />
          <h3 className="mt-4">Add Flavour Details</h3>
          <div className="flex flex-col gap-2">
            <Input
              value={detailForm.flavour}
              onChange={(e) =>
                setDetailForm({ ...detailForm, flavour: e.target.value })
              }
              placeholder="Flavour"
            />
            <InputNumber
              value={detailForm.instock}
              onChange={(value) =>
                setDetailForm({ ...detailForm, instock: value })
              }
              style={{ width: "100%" }}
              min={1}
              max={10000}
              placeholder="InStock"
            />
            <InputNumber
              value={detailForm.sales}
              onChange={(value) =>
                setDetailForm({ ...detailForm, sales: value })
              }
              style={{ width: "100%" }}
              min={1}
              max={10000}
              placeholder="Sales"
            />
            {isEditing ? (
              <div className="flex gap-4">
                <Button onClick={handleUpdate} type="primary">
                  Update
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={handleAddDetail} type="primary">
                Add Details
              </Button>
            )}

            <div className="mt-4">
              <h4>Added Details:</h4>
              {form.details?.length === 0 && <p>No details added.</p>}
              {form.details.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border p-2 my-1"
                >
                  <span>
                    {item.flavour} - InStock: {item.instock}, Sales:{item.sales}
                  </span>
                  <div>
                    <EditIcon
                      style={{ cursor: "pointer", marginRight: 8 }}
                      onClick={() => handleDetailEdit(item, index)}
                    />
                    <DeleteOutlineIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDetailDelete(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-4">
              <Button onClick={handleUpdate} type="primary">
                Update
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={handleAdd} type="primary">
              Add
            </Button>
          )}
        </div>
      </Modal>

      <ProductTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleDetailEdit={handleDetailEdit}
        handleDetailDelete={handleDetailDelete}
      />
    </div>
  );
};

export default ProductForm;
