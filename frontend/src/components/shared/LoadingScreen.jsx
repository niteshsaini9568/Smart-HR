import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading SmartHR...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-[500px] w-[500px] rounded-full bg-slate-500/5 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-14 w-14 rounded-2xl border-2 border-accent/20 border-t-accent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="font-display font-semibold text-foreground">{message}</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            className="h-0.5 bg-accent/40 rounded-full mx-auto"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function DashboardLoading({ message = 'Loading dashboard...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-10 w-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-muted border-t-accent"
          />
        </div>
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </motion.div>
    </div>
  );
}
