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
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8, padding: 4 }}
                        title="Edit"
                        onClick={() => router.push(`/manage-products/edit/${product.id}`)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffa726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                      </button>
                      <button
                        style={{ background: 'none', border: 'none', cursor: deletingId === product.id ? 'not-allowed' : 'pointer', opacity: deletingId === product.id ? 0.7 : 1, padding: 4 }}
                        title="Delete"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 7V15C6 15.55 6.45 16 7 16H13C13.55 16 14 15.55 14 15V7M9 10V13M11 10V13M4 7H16M8 4H12C12.55 4 13 4.45 13 5V6H7V5C7 4.45 7.45 4 8 4Z" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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