import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

export default function CaregiverNav() {
  return (
    <div className={styles.roleNav}>
      <Link href="/dashboard">
        <a className={styles.navItem}>Dashboard</a>
      </Link>
      <Link href="/care-recipients">
        <a className={styles.navItem}>Care Recipients</a>
      </Link>
      <Link href="/tasks">
        <a className={styles.navItem}>Tasks</a>
      </Link>
      <Link href="/medications">
        <a className={styles.navItem}>Medications</a>
      </Link>
      <Link href="/appointments">
        <a className={styles.navItem}>Appointments</a>
      </Link>
      <Link href="/health-tracking">
        <a className={styles.navItem}>Health Tracking</a>
      </Link>
      <Link href="/ai-assistant">
        <a className={styles.navItem}>AI Assistant</a>
      </Link>
    </div>
  );
}