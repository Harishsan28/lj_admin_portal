"use client";

import React, { useState, useEffect } from 'react';
import AdminCard from '../../components/AdminCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const summaryData = [
  { label: 'Total Users', value: 1200, color: '#1976d2' },
  { label: 'Total Products', value: 340, color: '#43a047' },
  { label: 'Total Customers', value: 210, color: '#ffa726' },
  { label: 'Total Orders', value: 180, color: '#e53935' },
  { label: 'Revenue (₹)', value: 125000, color: '#8e24aa' },
];

const orderStatusData = [
  { name: 'Pending', value: 10 },
  { name: 'Shipped', value: 5 },
  { name: 'Delivered', value: 15 },
  { name: 'Cancelled', value: 2 },
];

const paymentsData = [
  { name: 'Jan', amount: 20000 },
  { name: 'Feb', amount: 30000 },
  { name: 'Mar', amount: 25000 },
  { name: 'Apr', amount: 40000 },
];

const COLORS = ['#1976d2', '#43a047', '#ffa726', '#e53935'];

const topCities = [
  { city: 'Mumbai', count: 120 },
  { city: 'Delhi', count: 95 },
  { city: 'Bangalore', count: 80 },
  { city: 'Chennai', count: 60 },
  { city: 'Hyderabad', count: 45 },
];
const deviceUsage = [
  { device: 'Desktop', percent: 62 },
  { device: 'Mobile', percent: 33 },
  { device: 'Tablet', percent: 5 },
];
const supportTickets = [
  { id: 'TCK001', subject: 'Order not delivered', status: 'Open' },
  { id: 'TCK002', subject: 'Payment issue', status: 'Closed' },
  { id: 'TCK003', subject: 'Account locked', status: 'Pending' },
];

const salesTrend = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 15000 },
  { month: 'Mar', sales: 18000 },
  { month: 'Apr', sales: 22000 },
  { month: 'May', sales: 20000 },
  { month: 'Jun', sales: 25000 },
];

const areaData = [
  { month: 'Jan', users: 400, products: 240 },
  { month: 'Feb', users: 300, products: 139 },
  { month: 'Mar', users: 200, products: 980 },
  { month: 'Apr', users: 278, products: 390 },
  { month: 'May', users: 189, products: 480 },
  { month: 'Jun', users: 239, products: 380 },
];

const radarData = [
  { subject: 'Support', A: 120, B: 110, fullMark: 150 },
  { subject: 'Sales', A: 98, B: 130, fullMark: 150 },
  { subject: 'Marketing', A: 86, B: 130, fullMark: 150 },
  { subject: 'Development', A: 99, B: 100, fullMark: 150 },
  { subject: 'HR', A: 85, B: 90, fullMark: 150 },
  { subject: 'Finance', A: 65, B: 85, fullMark: 150 },
];

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        {summaryData.map((item) => (
          <AdminCard
            key={item.label}
            style={{
              flex: '1 1 180px',
              minWidth: 180,
              textAlign: 'center',
              padding: 20,
              background: activeCard === item.label ? item.color : '#fff',
              color: activeCard === item.label ? '#fff' : '#1976d2',
              cursor: 'pointer',
              boxShadow: activeCard === item.label ? '0 4px 24px rgba(25, 118, 210, 0.18)' : undefined,
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={() => setActiveCard(item.label)}
            onMouseLeave={() => setActiveCard(null)}
            onClick={() => alert(`${item.label}: ${item.value}`)}
          >
            <div style={{ fontSize: 15, color: activeCard === item.label ? '#fff' : '#888', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontWeight: 700, fontSize: 28 }}>{item.label === 'Revenue (₹)' ? `₹${item.value.toLocaleString()}` : item.value}</div>
          </AdminCard>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <AdminCard title="Order Status" style={{ minWidth: 360, flex: '1 1 360px' }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value" 
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name }) => `${name}`}
                onClick={(_, idx) => alert(`Status: ${orderStatusData[idx].name}`)}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AdminCard>
        <AdminCard title="Monthly Revenue" style={{ minWidth: 360, flex: '1 1 360px' }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paymentsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#1976d2" radius={[6, 6, 0, 0]} onClick={(_, idx) => alert(`Month: ${paymentsData[idx].name}, Revenue: ₹${paymentsData[idx].amount}`)} />
            </BarChart>
          </ResponsiveContainer>
        </AdminCard>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 32 }}>
        <AdminCard title="Top Cities">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {topCities.map(c => (
              <li
                key={c.city}
                style={{ marginBottom: 6, cursor: 'pointer', color: selectedCity === c.city ? '#1976d2' : '#333', fontWeight: selectedCity === c.city ? 700 : 400 }}
                onClick={() => setSelectedCity(c.city)}
              >
                <span style={{ fontWeight: 600 }}>{c.city}</span> — {c.count} customers
                {selectedCity === c.city && <span style={{ marginLeft: 8, color: '#1976d2' }}>(Selected)</span>}
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard title="Device Usage">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {deviceUsage.map(d => (
              <li key={d.device} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{d.device}</span> — {d.percent}%
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard title="Support Tickets">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {supportTickets.map(t => (
              <li key={t.id} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{t.id}</span> — {t.subject} <span style={{ color: t.status === 'Closed' ? '#43a047' : t.status === 'Pending' ? '#ffa726' : '#e53935' }}>({t.status})</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 32 }}>
        <AdminCard title="Sales Trend (Line Chart)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#1976d2" strokeWidth={3} activeDot={{ r: 8 }} onClick={(_, idx) => alert(`Month: ${salesTrend[idx].month}, Sales: ₹${salesTrend[idx].sales}`)} />
            </LineChart>
          </ResponsiveContainer>
        </AdminCard>
        <AdminCard title="Users vs Products (Area Chart)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData} onClick={(_, idx) => alert(`Month: ${areaData[idx]?.month}`)}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#1976d2" fill="#1976d2" />
              <Area type="monotone" dataKey="products" stackId="1" stroke="#43a047" fill="#43a047" />
            </AreaChart>
          </ResponsiveContainer>
        </AdminCard>
      </div>
    </div>
  );
} 