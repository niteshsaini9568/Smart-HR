import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../ui/utils';

const colorClasses = {
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  green: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  orange: { bg: 'bg-amber-500/15', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  purple: { bg: 'bg-violet-500/15', text: 'text-violet-400', ring: 'ring-violet-500/20' },
  red: { bg: 'bg-red-500/15', text: 'text-red-400', ring: 'ring-red-500/20' },
};

export default function StatsCard({ title, value, icon, trend, color = 'blue', index = 0 }) {
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="surface-card overflow-hidden group">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
              <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {value}
              </p>
              {trend && (
                <div className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {trend.isPositive ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                  <span className="text-muted-foreground font-normal">vs last month</span>
                </div>
              )}
            </div>
            <div className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105',
              colors.bg, colors.text, colors.ring
            )}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
