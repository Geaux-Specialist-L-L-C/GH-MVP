import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner component
 * @returns {JSX.Element} - A loading spinner animation
 */
export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}