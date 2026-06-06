import { motion } from 'framer-motion';
import { AnimatedHeading, AnimatedText } from './AnimatedTypography';

export default function PageHeader({
  title,
  description,
  badge,
  actions,
  meta,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="space-y-1.5 min-w-0">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
            {badge}
          </span>
        )}
        <AnimatedHeading as="h1" className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </AnimatedHeading>
        {description && (
          <AnimatedText delay={0.05} className="text-sm text-muted-foreground sm:text-base max-w-2xl">
            {description}
          </AnimatedText>
        )}
        {meta && (
          <p className="text-xs text-muted-foreground/80">{meta}</p>
        )}
      </div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 shrink-0"
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}
