import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import AdminNav from './AdminNav';
import CaregiverNav from './CaregiverNav';
import CareRecipientNav from './CareRecipientNav';
import PublicNav from './PublicNav';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  // Show simplified navigation while loading
  if (loading) {
    return (
      <nav className={styles.navigation}>
        <div className={styles.logo}>
          <Link href="/">Geaux HelpED</Link>
        </div>
        <div className={styles.navItems}>
          <div className={styles.navItem}>Loading...</div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className={styles.navigation}>
      <div className={styles.logo}>
        <Link href="/">
          <a>Geaux HelpED</a>
        </Link>
      </div>
      
      <div className={styles.navItems}>
        {isAuthenticated ? (
          <>
            {/* Show different navigation based on user role */}
            {user.role === 'admin' && <AdminNav />}
            {user.role === 'caregiver' && <CaregiverNav />}
            {user.role === 'care_recipient' && <CareRecipientNav />}
            
            {/* User menu - common for all authenticated users */}
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <div className={styles.userActions}>
                <Link href="/profile">
                  <a className={styles.navItem}>Profile</a>
                </Link>
                <button onClick={logout} className={styles.logoutButton}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <PublicNav />
        )}
      </div>
    </nav>
  );
}