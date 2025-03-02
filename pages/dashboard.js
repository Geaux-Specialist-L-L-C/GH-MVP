import React from 'react';
import Head from 'next/head';
import withAuth from '../utils/withAuth';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Dashboard.module.css';

function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard | Geaux HelpED</title>
        <meta name="description" content="Geaux HelpED dashboard" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome, {user.firstName}!</h1>
        
        <div className={styles.roleInfo}>
          <p>You are signed in as a <strong>{user.role}</strong></p>
        </div>
        
        {/* Content specific to user role */}
        {user.role === 'admin' && (
          <div className={styles.adminSection}>
            <h2>Admin Dashboard</h2>
            <p>This content is only visible to administrators.</p>
            {/* Admin-specific dashboard components would go here */}
          </div>
        )}
        
        {user.role === 'caregiver' && (
          <div className={styles.caregiverSection}>
            <h2>Caregiver Dashboard</h2>
            <p>This content is only visible to caregivers.</p>
            {/* Caregiver-specific dashboard components would go here */}
          </div>
        )}
        
        {user.role === 'care_recipient' && (
          <div className={styles.careRecipientSection}>
            <h2>Care Recipient Dashboard</h2>
            <p>This content is only visible to care recipients.</p>
            {/* Care recipient-specific dashboard components would go here */}
          </div>
        )}
        
        <div className={styles.dashboardGrid}>
          {/* Common dashboard components for all users */}
          <div className={styles.dashboardCard}>
            <h3>Upcoming Appointments</h3>
            <p>No upcoming appointments</p>
          </div>
          
          <div className={styles.dashboardCard}>
            <h3>Tasks</h3>
            <p>No pending tasks</p>
          </div>
          
          <div className={styles.dashboardCard}>
            <h3>Recent Activity</h3>
            <p>No recent activity</p>
          </div>
          
          <div className={styles.dashboardCard}>
            <h3>Quick Actions</h3>
            <div className={styles.quickActions}>
              <button className={styles.actionButton}>New Task</button>
              <button className={styles.actionButton}>New Appointment</button>
              <button className={styles.actionButton}>Ask AI Assistant</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Protect this page for authenticated users only
export default withAuth(Dashboard);