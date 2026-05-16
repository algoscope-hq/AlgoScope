import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const IPTracker = () => {
  const [ipData, setIpData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setIpData(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch IP data')
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
          IP Address Tracker
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoItem label="IP Address" value={ipData.ip} />
              <InfoItem label="Version" value={ipData.version} />
              <InfoItem label="ISP" value={ipData.org} />
              <InfoItem label="ASN" value={ipData.asn} />
            </div>
            <div className="space-y-4">
              <InfoItem label="Location" value={`${ipData.city}, ${ipData.region}, ${ipData.country_name}`} />
              <InfoItem label="Latitude / Longitude" value={`${ipData.latitude} / ${ipData.longitude}`} />
              <InfoItem label="Timezone" value={ipData.timezone} />
              <InfoItem label="Currency" value={`${ipData.currency_name} (${ipData.currency})`} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

const InfoItem = ({ label, value }) => (
  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
    <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-medium text-white">{value || 'N/A'}</p>
  </div>
)

export default IPTracker
