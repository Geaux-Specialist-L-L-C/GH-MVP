import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/helped.module.css';
import Image from 'next/image';

export default function GeauxHelpED() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Here you would typically submit to an API
    // For now, we'll just simulate a successful submission
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Geaux HelpED - Empowering Caregivers, Honoring Legacies</title>
        <meta name="description" content="A caregiving platform designed to support caregivers with task management, health monitoring, and AI-powered assistance." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.comingSoonBanner}>
        Coming Soon - In Memory of Edward Hopkins
      </div>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Geaux HelpED</h1>
          <h2 className={styles.subtitle}>Empowering Caregivers, Honoring Legacies</h2>
          <p className={styles.description}>
            A caregiving platform designed to support caregivers like Cathy Smith with task management, 
            health monitoring, and AI-powered assistance.
          </p>
          <button 
            className={styles.ctaButton}
            onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
          >
            Join the Caregiver Waitlist
          </button>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2>Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image src="/icons/task-management.svg" alt="Task Management" width={60} height={60} />
              </div>
              <h3>Task Management</h3>
              <p>Streamline daily caregiving tasks with easy-to-use tools.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image src="/icons/schedule.svg" alt="Schedule Coordination" width={60} height={60} />
              </div>
              <h3>Schedule Coordination</h3>
              <p>Manage caregiving schedules and appointments effortlessly.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image src="/icons/health-monitor.svg" alt="Health Monitoring" width={60} height={60} />
              </div>
              <h3>Health Monitoring</h3>
              <p>Track vital signs and health metrics with integrated monitoring.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image src="/icons/ai-assistance.svg" alt="AI Assistance" width={60} height={60} />
              </div>
              <h3>AI Assistance</h3>
              <p>Get answers to medical questions and documentation support through AI.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <h2>How It Works</h2>
          <ol className={styles.stepList}>
            <li>Sign up as a caregiver.</li>
            <li>Set up profiles for those you care for.</li>
            <li>Access tools for task management, health tracking, and AI-powered support.</li>
          </ol>
        </section>

        {/* CTA Form Section */}
        <section id="waitlist-form" className={styles.ctaForm}>
          <h2>Join Our Caregiver Waitlist</h2>
          <p>Be among the first to experience Geaux HelpED when we launch.</p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={styles.input}
                />
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button type="submit" className={styles.submitButton}>
                Join Waitlist
              </button>
            </form>
          ) : (
            <div className={styles.thankYouMessage}>
              <h3>Thank you for joining our waitlist!</h3>
              <p>We'll keep you updated on our progress and notify you when Geaux HelpED launches.</p>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Geaux Specialist LLC. All rights reserved.</p>
        <p>In memory of Edward Hopkins</p>
      </footer>
    </div>
  );
}