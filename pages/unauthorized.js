import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Unauthorized.module.css';
import Head from 'next/head';

export default function Unauthorized() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Function to handle going back
  const handleBack = () => {
    router.back();
  };
  
  // Function to go to dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Unauthorized Access | Geaux HelpED</title>
        <meta name="description" content="You do not have permission to access this page" />
      </Head>
      
      <main className={styles.main}>
        <div className={styles.errorContainer}>
          <h1 className={styles.title}>Access Denied</h1>
          
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              <circle cx="12" cy="16" r="1"></circle>
            </svg>
          </div>
          
          <p className={styles.message}>
            You don&apos;t have permission to access this page.
          </p>
          
          {user && (
            <p className={styles.userInfo}>
              You are signed in as <strong>{user.firstName} {user.lastName}</strong> with {user.role} permissions.
            </p>
          )}
          
          <div className={styles.actions}>
            <button onClick={handleBack} className={styles.secondaryButton}>
              Go Back
            </button>
            <button onClick={goToDashboard} className={styles.primaryButton}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}