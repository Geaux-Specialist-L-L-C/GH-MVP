import React from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

export default function PublicNav() {
  return (
    <div className={styles.roleNav}>
      <Link href="/about">
        <a className={styles.navItem}>About</a>
      </Link>
      <Link href="/features">
        <a className={styles.navItem}>Features</a>
      </Link>
      <Link href="/login">
        <a className={styles.navItem}>Login</a>
      </Link>
      <Link href="/register">
        <a className={styles.navButtonPrimary}>Sign Up</a>
      </Link>
    </div>
  );
}