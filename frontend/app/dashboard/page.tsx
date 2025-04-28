"use client";

import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Tenant Admin Dashboard</h1>
      <p>Welcome to your dashboard. Manage your blog here.</p>
      <ul>
        <li><a href="/dashboard/posts">Manage Posts</a></li>
        <li><a href="/dashboard/categories">Manage Categories</a></li>
        <li><a href="/dashboard/tags">Manage Tags</a></li>
        <li><a href="/dashboard/profile">Update Profile</a></li>
      </ul>
    </div>
  );
}