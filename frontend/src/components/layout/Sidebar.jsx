import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const accentColors = {
  blue: 'bg-blue-500',
  purple: 'bg-blue-600',
  green: 'bg-sky-500',
  orange: 'bg-blue-400',
};

export default function Sidebar({ items, theme = 'blue', isCollapsed, onToggle, isMobileOpen, onMobileClose }) {
  const accent = accentColors[theme] || accentColors.blue;

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground flex-shrink-0 flex flex-col border-r border-sidebar-border transition-all duration-300 ease-out',
          'lg:relative lg:translate-x-0',
          'fixed inset-y-0 left-0 z-50 w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0',
          isCollapsed && 'lg:justify-center lg:px-2'
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className={cn('min-w-0', isCollapsed && 'lg:hidden')}>
            <p className="font-display font-bold text-sm text-white truncate">SmartHR</p>
            <p className="text-[10px] text-slate-400 truncate">Enterprise Portal</p>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                item.onClick();
                if (isMobileOpen) onMobileClose();
              }}
              className={cn(
                'sidebar-item relative w-full',
                item.active ? 'sidebar-item-active' : 'sidebar-item-inactive',
                isCollapsed && 'lg:justify-center lg:px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {item.active && (
                <motion.span
                  layoutId="sidebar-active"
                  className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full', accent)}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className={cn('flex-shrink-0', item.active && 'text-blue-400')}>
                {item.icon}
              </span>
              <span className={cn('flex-1 text-left truncate', isCollapsed && 'lg:hidden')}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white',
                  isCollapsed && 'lg:absolute lg:-top-0.5 lg:-right-0.5 lg:h-4 lg:min-w-4 lg:text-[9px]'
                )}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Collapse toggle - desktop */}
        <div className="hidden lg:block p-3 border-t border-sidebar-border">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
