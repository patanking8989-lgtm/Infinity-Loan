import React, { useState } from 'react';
import { Download, Check, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppDownloadButtonProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export const AppDownloadButton: React.FC<AppDownloadButtonProps> = ({
  className = '',
  variant = 'full',
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (downloading) return;

    setDownloading(true);

    const apkUrl = 'https://github.com/patanking8989-lgtm/LoanApps/releases/download/Infinity/Infinity.Loan.apk';

    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.href = apkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = 'Infinity.Loan.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Download error:', err);
        window.open(apkUrl, '_blank');
      }

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 5000);
    }, 600);
  };

  return (
    <div className={`mt-2.5 w-full ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden border ${
          downloaded
            ? 'bg-emerald-600 border-emerald-500 text-white'
            : downloading
            ? 'bg-slate-900 border-slate-700 text-emerald-300'
            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 group'
        }`}
      >
        {/* PlayStore / Android Icon */}
        <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 fill-current text-emerald-400" viewBox="0 0 24 24">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.61-1.583V3.397c0-.608.223-1.164.609-1.583zm11.602 11.602l2.365 2.365-12.08 6.94 9.715-9.305zm0-2.832L5.496 1.279l12.08 6.94-2.365 2.365zM17.82 12l3.415-1.96a1.5 1.5 0 0 1 0 3.92L17.82 12z" />
          </svg>
        </div>

        {downloading ? (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <span>Downloading KYC App...</span>
          </div>
        ) : downloaded ? (
          <div className="flex items-center space-x-1.5 text-xs text-white font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>KYC App Downloaded (.APK)</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs text-slate-200 group-hover:text-white font-medium">
            <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
            <span>Get KYC Download</span>
          </div>
        )}
      </motion.button>

      {/* Success Banner when APK downloaded */}
      <AnimatePresence>
        {downloaded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1.5 text-center text-[10px] text-emerald-600 font-medium flex items-center justify-center space-x-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Infinity.Loan.apk ready to install</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

