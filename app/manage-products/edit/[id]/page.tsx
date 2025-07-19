"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  created_at: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        const prod = Array.isArray(data) ? data.find((p: Product) => p.id === Number(id)) : data;
        setProduct(prod);
        setName(prod.name);
        setDescription(prod.description);
        setPrice(prod.price.toString());
        setStock(prod.stock.toString());
        setImagePreview(prod.imageUrl);
      } catch {
        setError("Failed to load product.");
      }
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) formData.append("image", image);
      const res = await fetch("/api/products", {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product updated successfully!');
        router.push("/manage-products");
      } else {
        toast.error(data.message || "Failed to update product.");
        setError(data.message || "Failed to update product.");
      }
    } catch {
      toast.error("Failed to update product.");
      setError("Failed to update product.");
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: '#e53935' }}>{error}</div>;
  if (!product) return <div style={{ padding: 32 }}>Product not found.</div>;

  return (
    <div style={{
      maxWidth: 480,
      margin: "3rem auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px rgba(25, 118, 210, 0.08)",
      padding: "2.5rem 2rem"
    }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, color: "#1976d2" }}>
        Edit Product
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label>
          <span style={{ fontWeight: 500 }}>Product Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
            required
            placeholder="Enter product name"
          />
        </label>
        <label>
          <span style={{ fontWeight: 500 }}>Description</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            placeholder="Enter product description"
          />
        </label>
        <label>
          <span style={{ fontWeight: 500 }}>Price (₹)</span>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={inputStyle}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </label>
        <label>
          <span style={{ fontWeight: 500 }}>Stock</span>
          <input
            type="number"
            value={stock}
            onChange={e => setStock(e.target.value)}
            style={inputStyle}
            min="0"
            step="1"
            placeholder="0"
          />
        </label>
        <label>
          <span style={{ fontWeight: 500 }}>Product Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: 6 }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ marginTop: 12, maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }}
            />
          )}
        </label>
        {error && <div style={{ color: "#e53935", marginBottom: 8 }}>{error}</div>}
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "linear-gradient(90deg, #1976d2 0%, #0f2027 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
            fontSize: 18,
            padding: "12px 0",
            marginTop: 10,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 16,
  marginTop: 6,
  marginBottom: 2,
  background: "#f7f7f7",
  color: "#333",
  boxSizing: "border-box"
}; 