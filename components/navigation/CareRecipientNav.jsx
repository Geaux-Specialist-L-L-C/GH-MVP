import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

export default function CareRecipientNav() {
  return (
    <div className={styles.roleNav}>
      <Link href="/dashboard">
        <a className={styles.navItem}>Dashboard</a>
      </Link>
      <Link href="/caregivers">
        <a className={styles.navItem}>My Caregivers</a>
      </Link>
      <Link href="/my-tasks">
        <a className={styles.navItem}>My Tasks</a>
      </Link>
      <Link href="/my-medications">
        <a className={styles.navItem}>My Medications</a>
      </Link>
      <Link href="/my-appointments">
        <a className={styles.navItem}>My Appointments</a>
      </Link>
      <Link href="/my-health">
        <a className={styles.navItem}>My Health</a>
      </Link>
      <Link href="/ai-assistant">
        <a className={styles.navItem}>Ask AI Assistant</a>
      </Link>
    </div>
  );
}