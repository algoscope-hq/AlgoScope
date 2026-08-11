import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from './Footer' // Adjust the import path if needed

const PrivacyPage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold theme-text-strong mb-4 logo-font tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl theme-text-muted">
              Last updated: June 20, 2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sidebar - Table of Contents */}
            <div className="lg:col-span-4">
              <div className="theme-media-surface border theme-border rounded-2xl p-8 sticky top-28">
                <h3 className="font-semibold text-lg theme-text-strong mb-6">
                  Contents
                </h3>
                <nav className="space-y-2 text-sm">
                  {[
                    { label: 'Introduction', id: 'introduction' },
                    { label: 'Information We Collect', id: 'data-collection' },
                    { label: 'How We Use Your Information', id: 'data-usage' },
                    { label: 'Data Storage & Security', id: 'data-security' },
                    { label: 'Third-Party Services', id: 'third-party' },
                    { label: 'Your Rights & Choices', id: 'user-rights' },
                    { label: 'Cookies & Tracking', id: 'cookies' },
                    { label: 'Policy Updates', id: 'updates' },
                    { label: 'Contact Us', id: 'contact' },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all theme-text-muted hover:theme-text-strong"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-8">
              <div className="space-y-12 text-lg leading-relaxed theme-text-muted">
                <motion.section
                  id="introduction"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Introduction
                  </h2>
                  <p>
                    At AlgoScope, we are committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, store, and
                    protect your personal information when you use our website
                    and interactive algorithm visualization tools.
                  </p>
                </motion.section>

                <motion.section
                  id="data-collection"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Information We Collect
                  </h2>
                  <ul className="space-y-4">
                    <li>
                      <strong>Usage Data:</strong> Pages visited, time spent,
                      interactions with algorithm visualizers.
                    </li>
                    <li>
                      <strong>Technical Data:</strong> IP address, browser type,
                      device information, operating system.
                    </li>
                    <li>
                      <strong>Preference Data:</strong> Theme preference
                      (light/dark), saved settings.
                    </li>
                    <li>
                      <strong>Cookies &amp; Tracking:</strong> As detailed in
                      our{' '}
                      <Link
                        to="/cookiespage"
                        className="text-cyan-400 hover:underline"
                      >
                        Cookie Policy
                      </Link>
                      .
                    </li>
                  </ul>
                </motion.section>

                <motion.section
                  id="data-usage"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    How We Use Your Information
                  </h2>
                  <ul className="space-y-4">
                    <li>
                      To provide and improve our interactive learning experience
                    </li>
                    <li>
                      To personalize your interface and remember preferences
                    </li>
                    <li>
                      To analyze usage patterns and enhance educational content
                    </li>
                    <li>To maintain website security and prevent misuse</li>
                    <li>To communicate important updates (if you opt-in)</li>
                  </ul>
                </motion.section>

                <motion.section
                  id="data-security"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Data Storage &amp; Security
                  </h2>
                  <p>
                    We implement industry-standard security measures to protect
                    your data, including encryption, secure servers, and regular
                    security audits. Your personal data is stored for only as
                    long as necessary for the purposes outlined in this policy
                    or as required by law.
                  </p>
                </motion.section>

                <motion.section
                  id="third-party"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Third-Party Services
                  </h2>
                  <p>We use the following third-party services:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>GitHub (for project hosting and authentication)</li>
                    <li>Discord (community support)</li>
                    <li>Analytics tools (to understand usage)</li>
                  </ul>
                  <p className="mt-4">
                    These services have their own privacy policies. We encourage
                    you to review them.
                  </p>
                </motion.section>

                <motion.section
                  id="user-rights"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Your Rights
                  </h2>
                  <p className="mb-6">You have the right to:</p>
                  <ul className="space-y-3">
                    <li>Access, correct, or delete your personal data</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Withdraw consent at any time (where applicable)</li>
                    <li>Request data portability</li>
                  </ul>
                  <p className="mt-6 text-sm theme-text-subtle">
                    To exercise these rights, please contact us using the
                    details below.
                  </p>
                </motion.section>

                <motion.section
                  id="cookies"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Cookies &amp; Tracking Technologies
                  </h2>
                  <p>
                    We use cookies to enhance your experience. For detailed
                    information, please visit our
                    <Link
                      to="/cookiespage"
                      className="text-cyan-400 hover:underline"
                    >
                      {' '}
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </motion.section>

                <motion.section
                  id="updates"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Policy Updates
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time. The
                    revised version will be posted on this page with an updated
                    "Last updated" date. We recommend reviewing this policy
                    periodically.
                  </p>
                </motion.section>

                <motion.section
                  id="contact"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Contact Us
                  </h2>
                  <p className="mb-4">
                    If you have any questions or concerns about this Privacy
                    Policy, please reach out to us:
                  </p>
                  <div className="flex flex-wrap gap-6 text-cyan-400">
                    <a
                      href="https://github.com/algoscope-hq/AlgoScope"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://discord.gg/Yj43j7YV9T"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Discord
                    </a>
                    <a
                      href="https://github.com/Bimbok"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      bimbok
                    </a>
                    <a
                      href="https://github.com/adityapaul26"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      adityapaul26
                    </a>
                  </div>
                </motion.section>
              </div>

              {/* Back to Homepage Button */}
              <div className="mt-16 flex justify-center">
                <Link
                  to="/"
                  className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
                >
                  ← Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PrivacyPage
