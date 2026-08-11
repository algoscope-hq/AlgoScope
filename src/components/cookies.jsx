import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from './Footer' // Adjust import path according to your project structure

const CookiesPage = () => {
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
              Cookie Policy
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
                    { label: 'What Are Cookies?', id: 'what-are-cookies' },
                    { label: 'Types of Cookies', id: 'types-of-cookies' },
                    { label: 'How We Use Cookies', id: 'how-we-use' },
                    { label: 'Third-Party Cookies', id: 'third-party' },
                    { label: 'Cookie Retention Periods', id: 'retention' },
                    { label: 'Managing Your Cookies', id: 'managing' },
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
                {/* 1. What Are Cookies */}
                <motion.section
                  id="what-are-cookies"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    What Are Cookies?
                  </h2>
                  <p>
                    Cookies are small text files that are stored on your device
                    (computer, tablet, or mobile) when you visit a website. They
                    allow websites to remember your actions and preferences over
                    time, making your browsing experience more efficient and
                    personalized.
                  </p>
                  <p className="mt-4">
                    Cookies do not typically contain personally identifiable
                    information, but they can help us provide a better and more
                    tailored experience on AlgoScope.
                  </p>
                </motion.section>

                {/* 2. Types of Cookies */}
                <motion.section
                  id="types-of-cookies"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Types of Cookies We Use
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2">
                        Essential Cookies
                      </h4>
                      <p>
                        These are necessary for the website to function
                        properly. They enable core features like navigation and
                        access to secure areas.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                      <h4 className="font-semibold text-emerald-400 mb-2">
                        Functional Cookies
                      </h4>
                      <p>
                        Allow us to remember your preferences (such as theme
                        selection) and provide enhanced, personalized features.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                      <h4 className="font-semibold text-purple-400 mb-2">
                        Performance / Analytics Cookies
                      </h4>
                      <p>
                        Help us understand how visitors interact with AlgoScope
                        so we can improve performance and learning experience.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-2">
                        Session Cookies
                      </h4>
                      <p>
                        Temporary cookies that are deleted when you close your
                        browser. They help maintain your session during use.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* 3. How We Use Cookies */}
                <motion.section
                  id="how-we-use"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    How We Use Cookies
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span> Enable
                      smooth interactive algorithm visualizations
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span> Remember
                      your preferred theme (light/dark mode)
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span> Maintain
                      your progress and session state
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span> Analyze
                      usage to improve educational content
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span> Support
                      future features like user accounts
                    </li>
                  </ul>
                </motion.section>

                {/* 4. Third-Party Cookies */}
                <motion.section
                  id="third-party"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Third-Party Cookies
                  </h2>
                  <p>
                    We may use services from trusted third parties (such as
                    GitHub, Discord, and analytics providers). These services
                    may set their own cookies. We do not control these cookies
                    and recommend reviewing their privacy policies.
                  </p>
                </motion.section>

                {/* 5. Retention Periods */}
                <motion.section
                  id="retention"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Cookie Retention Periods
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b theme-border">
                          <th className="text-left py-4 pr-8">Cookie Type</th>
                          <th className="text-left py-4 pr-8">Example</th>
                          <th className="text-left py-4">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y theme-border">
                        <tr>
                          <td className="py-4 pr-8">Essential</td>
                          <td className="py-4 pr-8">session_id</td>
                          <td className="py-4">
                            Session (deleted on browser close)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8">Functional</td>
                          <td className="py-4 pr-8">theme_preference</td>
                          <td className="py-4">1 year</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8">Analytics</td>
                          <td className="py-4 pr-8">_ga (if used)</td>
                          <td className="py-4">2 years</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8">Performance</td>
                          <td className="py-4 pr-8">visitor_stats</td>
                          <td className="py-4">6 months</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.section>

                {/* 6. Managing Cookies */}
                <motion.section
                  id="managing"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Managing Your Cookies
                  </h2>
                  <p className="mb-6">
                    You can control and manage cookies through your browser
                    settings. Most browsers allow you to:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 mb-6">
                    <li>Block or allow all cookies</li>
                    <li>Delete cookies already stored on your device</li>
                    <li>Receive notifications before a cookie is set</li>
                    <li>Set preferences for specific websites</li>
                  </ul>
                  <p className="text-sm theme-text-subtle">
                    <strong>Note:</strong> Disabling essential cookies may
                    prevent some features (like algorithm visualizers) from
                    working properly.
                  </p>
                </motion.section>

                {/* 7. Policy Updates */}
                <motion.section
                  id="updates"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="theme-media-surface border theme-border rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-semibold theme-text-strong mb-6">
                    Updates to This Cookie Policy
                  </h2>
                  <p>
                    We may update this policy from time to time to reflect
                    changes in our practices or for legal reasons. The updated
                    version will be posted here with a new "Last updated" date.
                    We encourage you to review this page periodically.
                  </p>
                </motion.section>

                {/* 8. Contact Us */}
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
                    If you have any questions or concerns about our Cookie
                    Policy, please reach out to us:
                  </p>
                  <div className="flex flex-wrap gap-6 text-cyan-400">
                    <a
                      href="https://github.com/algoscope-hq/AlgoScope"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      GitHub Repository
                    </a>
                    <a
                      href="https://discord.gg/Yj43j7YV9T"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Discord Community
                    </a>
                    <a
                      href="https://github.com/Bimbok"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Maintainer: bimbok
                    </a>
                  </div>
                </motion.section>
              </div>

              {/* Return to Homepage Button - Bottom Only */}
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

      {/* Clean Footer */}
      <Footer />
    </div>
  )
}

export default CookiesPage
