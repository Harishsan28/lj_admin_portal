"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ManageProducts() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts(products => products.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
    } catch {
      toast.error('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Products</h1>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by product name..."
          style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 15, minWidth: 220 }}
        />
        <button
          style={{ padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}
          onClick={() => router.push('/manage-products/add_product')}
        >
          Add Product
        </button>
      </div>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4, background: '#fff' }}>
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Image</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Price (₹)</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Stock</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id}>
                    <td style={{ padding: '0.5rem' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>{product.name}</td>
                    <td style={{ padding: '0.5rem' }}>₹{product.price.toFixed(2)}</td>
                    <td style={{ padding: '0.5rem' }}>{product.stock}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button
                        style={{ padding: '4px 10px', background: '#ffa726', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer', marginRight: 8 }}
                        onClick={() => router.push(`/manage-products/edit/${product.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ padding: '4px 10px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: deletingId === product.id ? 'not-allowed' : 'pointer', opacity: deletingId === product.id ? 0.7 : 1 }}
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === 1 ? '#f4f4f4' : '#fff', color: '#1976d2', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              <span style={{ fontSize: 15 }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === totalPages ? '#f4f4f4' : '#fff', color: '#1976d2', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 