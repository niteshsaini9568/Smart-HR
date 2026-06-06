import { motion } from 'framer-motion';

import { ArrowUpRight } from 'lucide-react';



const accents = {

  blue: {

    glow: 'from-blue-600/20 via-blue-500/5 to-transparent',

    icon: 'from-blue-600/30 to-blue-500/10',

    iconText: 'text-blue-400',

    ring: 'group-hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.45)]',

    line: 'bg-blue-500',

    dotColor: 'rgba(59, 130, 246, 0.35)',

  },

  sky: {

    glow: 'from-sky-600/20 via-sky-500/5 to-transparent',

    icon: 'from-sky-600/30 to-sky-500/10',

    iconText: 'text-sky-400',

    ring: 'group-hover:shadow-[0_0_20px_-4px_rgba(14,165,233,0.45)]',

    line: 'bg-sky-500',

    dotColor: 'rgba(14, 165, 233, 0.35)',

  },

  indigo: {

    glow: 'from-indigo-600/20 via-indigo-500/5 to-transparent',

    icon: 'from-indigo-600/30 to-indigo-500/10',

    iconText: 'text-indigo-400',

    ring: 'group-hover:shadow-[0_0_20px_-4px_rgba(99,102,241,0.45)]',

    line: 'bg-indigo-500',

    dotColor: 'rgba(99, 102, 241, 0.35)',

  },

  cyan: {

    glow: 'from-cyan-600/20 via-cyan-500/5 to-transparent',

    icon: 'from-cyan-600/30 to-cyan-500/10',

    iconText: 'text-cyan-400',

    ring: 'group-hover:shadow-[0_0_20px_-4px_rgba(6,182,212,0.45)]',

    line: 'bg-cyan-500',

    dotColor: 'rgba(6, 182, 212, 0.35)',

  },

};



export default function FeatureCard({

  icon: Icon,

  title,

  description,

  index = 0,

  accent = 'blue',

  className = '',

}) {

  const theme = accents[accent] || accents.blue;



  return (

    <motion.div

      initial={{ opacity: 0, y: 24 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true, margin: '-40px' }}

      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}

      whileHover={{ y: -6, scale: 1.01 }}

      className={`feature-card group ${theme.ring} ${className}`}

    >

      {/* Corner glow */}

      <div className={`absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />



      {/* Dot pattern */}

      <div

        className="absolute bottom-4 right-4 h-16 w-16 opacity-[0.15] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"

        style={{

          backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`,

          backgroundSize: '8px 8px',

        }}

      />



      {/* Top shine line */}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />



      <div className="relative flex items-start justify-between mb-5">

        <motion.div

          className={`feature-card-icon bg-gradient-to-br ${theme.icon} ${theme.iconText}`}

          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}

          transition={{ duration: 0.5 }}

        >

          <Icon className="h-[18px] w-[18px] stroke-[1.75]" />

        </motion.div>



        <motion.span

          className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"

          aria-hidden

        >

          <ArrowUpRight className="h-3.5 w-3.5" />

        </motion.span>

      </div>



      <h3 className="relative font-display font-semibold text-[15px] text-foreground mb-2 leading-snug group-hover:text-blue-100 transition-colors duration-300">

        {title}

      </h3>



      <p className="relative text-[13px] text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">

        {description}

      </p>



      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/30 overflow-hidden">
        <div className={`h-full w-0 group-hover:w-full ${theme.line} transition-all duration-500 ease-out`} />
      </div>



      <span className="absolute top-5 right-5 font-display text-[11px] font-bold text-border/80 group-hover:text-blue-500/30 transition-colors duration-300 select-none">

        {String(index + 1).padStart(2, '0')}

      </span>

    </motion.div>

  );

}


