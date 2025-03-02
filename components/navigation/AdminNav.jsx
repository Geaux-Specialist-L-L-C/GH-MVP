import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

export default function AdminNav() {
  return (
    <div className={styles.roleNav}>
      <Link href="/admin/dashboard">
        <a className={styles.navItem}>Admin Dashboard</a>
      </Link>
      <Link href="/admin/users">
        <a className={styles.navItem}>User Management</a>
      </Link>
      <Link href="/admin/analytics">
        <a className={styles.navItem}>Analytics</a>
      </Link>
      <Link href="/admin/settings">
        <a className={styles.navItem}>System Settings</a>
      </Link>
      <Link href="/admin/logs">
        <a className={styles.navItem}>System Logs</a>
      </Link>
    </div>
  );
}