import { useState, useEffect } from 'react';

import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom';

import toast from 'react-hot-toast';

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

import {

  Briefcase, Users, Brain, BarChart3, Zap, Shield,

  FileText, Inbox, Bot, Calendar, CheckCircle,

  UserCog, UserCheck, Building2, Search,

  ChevronRight, Menu, X, Linkedin, Twitter, Facebook, Mail,

  ArrowRight, LayoutGrid, Star, Quote,

  TrendingUp, Clock, Globe, Lock, Layers,

  MessageSquare, Target, Award, ChevronDown,

} from 'lucide-react';

import { Button } from '../ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { AnimatedText, FadeIn } from '../shared/AnimatedTypography';
import FeatureCard from '../shared/FeatureCard';



const ROLE_MAP = {

  admin: 'admin',

  hr_recruiter: 'hr_recruiter',

  manager: 'manager',

  employee: 'employee',

};



function AnimatedCounter({ value, suffix = '' }) {

  const num = parseFloat(value.replace(/[^0-9.]/g, ''));

  const prefix = value.match(/^[^0-9]*/)?.[0] || '';

  const count = useMotionValue(0);

  const rounded = useTransform(count, (v) => {

    if (value.includes('.')) return `${prefix}${v.toFixed(1)}${suffix}`;

    if (value.includes('K')) return `${prefix}${Math.round(v)}K+`;

    if (value.includes('%')) return `${Math.round(v)}%`;

    return `${prefix}${Math.round(v)}${suffix}`;

  });

  const [display, setDisplay] = useState(value);



  useEffect(() => {

    const controls = animate(count, num, { duration: 2, ease: 'easeOut' });

    const unsub = rounded.on('change', (v) => setDisplay(v));

    return () => { controls.stop(); unsub(); };

  }, [count, num, rounded, value]);



  return <span>{display}</span>;

}



function HeroBackground() {

  const orbs = [

    { size: 320, x: '75%', y: '20%', delay: 0, color: 'bg-blue-600/10' },

    { size: 240, x: '10%', y: '60%', delay: 1.5, color: 'bg-blue-500/8' },

    { size: 180, x: '55%', y: '75%', delay: 0.8, color: 'bg-sky-500/6' },

  ];



  return (

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="absolute inset-0 hero-glow" />

      {orbs.map((orb, i) => (

        <motion.div

          key={i}

          className={`absolute rounded-full blur-3xl ${orb.color}`}

          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}

          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}

          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}

        />

      ))}

      <motion.div

        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"

        style={{ top: '40%' }}

        animate={{ opacity: [0.3, 0.7, 0.3] }}

        transition={{ duration: 4, repeat: Infinity }}

      />

    </div>

  );

}



function DashboardPreview() {

  const bars = [35, 55, 42, 72, 48, 65, 85, 58];



  return (

    <motion.div

      initial={{ opacity: 0, x: 40 }}

      animate={{ opacity: 1, x: 0 }}

      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}

      className="relative"

    >

      <motion.div

        className="absolute -inset-3 rounded-2xl border border-blue-500/20"

        animate={{ opacity: [0.4, 0.8, 0.4] }}

        transition={{ duration: 3, repeat: Infinity }}

      />



      <div className="relative rounded-xl border border-border bg-card overflow-hidden">

        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/50">

          <div className="flex gap-1.5">

            <span className="h-2 w-2 rounded-full bg-red-500/50" />

            <span className="h-2 w-2 rounded-full bg-amber-500/50" />

            <span className="h-2 w-2 rounded-full bg-emerald-500/50" />

          </div>

          <span className="flex-1 text-center text-[10px] text-muted-foreground">SmartHR Dashboard</span>

        </div>



        <div className="p-4 space-y-4">

          <div className="grid grid-cols-3 gap-3">

            {[

              { label: 'Open Roles', val: '24', color: 'text-blue-400' },

              { label: 'Candidates', val: '1.2K', color: 'text-sky-400' },

              { label: 'Hired', val: '89', color: 'text-blue-300' },

            ].map((s, i) => (

              <motion.div

                key={s.label}

                initial={{ opacity: 0, y: 12 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.5 + i * 0.1 }}

                className="rounded-lg border border-border bg-secondary/40 p-3"

              >

                <p className="text-[10px] text-muted-foreground">{s.label}</p>

                <p className={`font-display font-bold text-lg ${s.color}`}>{s.val}</p>

              </motion.div>

            ))}

          </div>



          <div className="rounded-lg border border-border bg-secondary/30 p-3 relative overflow-hidden">

            <div className="flex justify-between items-center mb-3">

              <span className="text-xs font-medium">Hiring Activity</span>

              <span className="text-[10px] text-blue-400">+18% this month</span>

            </div>

            <div className="flex items-end gap-1.5 h-20">

              {bars.map((h, i) => (

                <motion.div

                  key={i}

                  initial={{ height: 0 }}

                  animate={{ height: `${h}%` }}

                  transition={{ delay: 0.7 + i * 0.06, duration: 0.5, ease: 'easeOut' }}

                  className="flex-1 rounded-sm bg-blue-600/80 min-h-[4px]"

                />

              ))}

            </div>

            <motion.div

              className="absolute left-0 right-0 h-8 bg-gradient-to-b from-blue-400/10 to-transparent pointer-events-none"

              animate={{ top: ['-10%', '110%'] }}

              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}

            />

          </div>



          <div className="space-y-2">

            {['Senior Engineer — Screened', 'Product Designer — Interview', 'Data Analyst — Offer'].map((item, i) => (

              <motion.div

                key={i}

                initial={{ opacity: 0, x: -12 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ delay: 0.9 + i * 0.12 }}

                className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2"

              >

                <div className="h-6 w-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-semibold text-blue-400">

                  {item.charAt(0)}

                </div>

                <span className="text-[11px] text-muted-foreground flex-1 truncate">{item}</span>

                <span className="text-[10px] text-blue-400 font-medium">Active</span>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </motion.div>

  );

}



const headlineWords = ['Enterprise', 'HR', 'management,', 'simplified.'];



export default function LandingPage() {

  const location = useLocation();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const [activeFaq, setActiveFaq] = useState(null);



  useEffect(() => {

    if (location.state?.message) {

      navigate('/login?role=employee', { state: { message: location.state.message } });

    }

  }, [location, navigate]);



  useEffect(() => {

    const error = searchParams.get('error');

    if (error) {

      toast.error(decodeURIComponent(error));

      searchParams.delete('error');

      setSearchParams(searchParams, { replace: true });

    }

  }, [searchParams, setSearchParams]);



  useEffect(() => {

    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const features = [

    { icon: Brain, title: 'AI Resume Analysis', description: 'Intelligent candidate matching with ML-powered scoring.', accent: 'blue' },

    { icon: BarChart3, title: 'Pipeline Analytics', description: 'Track every stage of your recruitment funnel in real time.', accent: 'sky' },

    { icon: Users, title: 'Team Collaboration', description: 'Shared scorecards, notes, and structured approval flows.', accent: 'indigo' },

    { icon: Zap, title: 'Automated Workflows', description: 'Automated screening, communications, and scheduling.', accent: 'cyan' },

    { icon: Shield, title: 'Enterprise Security', description: 'Role-based access control with full audit logging.', accent: 'indigo' },

    { icon: FileText, title: 'Smart Reporting', description: 'Export-ready analytics for leadership and compliance.', accent: 'sky' },

  ];



  const steps = [

    { icon: Briefcase, title: 'Post Jobs', description: 'Create and publish across channels' },

    { icon: Inbox, title: 'Applications', description: 'Centralized candidate intake' },

    { icon: Bot, title: 'AI Screening', description: 'Automated resume analysis' },

    { icon: Calendar, title: 'Interview', description: 'Schedule and conduct interviews' },

    { icon: CheckCircle, title: 'Hire', description: 'Offers and onboarding' },

  ];



  const roles = [

    { icon: UserCog, title: 'Admin', description: 'System control and user management', role: 'admin' },

    { icon: UserCheck, title: 'HR Manager', description: 'Full recruitment lifecycle', role: 'hr_recruiter' },

    { icon: Building2, title: 'Manager', description: 'Department hiring and approvals', role: 'manager' },

    { icon: Search, title: 'Employee', description: 'Job search and applications', role: 'employee' },

  ];



  const stats = [

    { value: '500+', label: 'Companies' },

    { value: '10K+', label: 'Jobs / Month' },

    { value: '95%', label: 'Faster Hiring' },

    { value: '4.9', label: 'User Rating', suffix: '/5' },

  ];



  const testimonials = [

    { quote: 'SmartHR reduced our time-to-hire significantly. The pipeline visibility alone transformed how we operate.', author: 'Sarah Chen', role: 'VP of People, TechFlow' },

    { quote: 'A platform our managers actually adopt. Approval workflows are clear and efficient.', author: 'Marcus Webb', role: 'HR Director, Nexus Corp' },

    { quote: 'Reliable, structured, and easy to administer. Exactly what enterprise HR needs.', author: 'Priya Sharma', role: 'Talent Lead, Innovate Labs' },

  ];



  const faqs = [

    { q: 'How does AI screening work?', a: 'ML models score candidates against your job requirements. Thresholds are configurable and all recommendations can be overridden by your team.' },

    { q: 'Can we integrate existing tools?', a: 'SmartHR supports integrations with ATS systems, calendars, and communication tools. Enterprise plans include API access.' },

    { q: 'How is data secured?', a: 'Encryption at rest and in transit, RBAC, and comprehensive audit logs. Built with enterprise compliance requirements in mind.' },

  ];



  const navLinks = [

    { href: '#features', label: 'Features' },

    { href: '#how-it-works', label: 'How It Works' },

    { href: '#roles', label: 'Roles' },

    { href: '#contact', label: 'Contact' },

  ];



  const handleRoleSelect = (role) => {

    navigate(`/login?role=${ROLE_MAP[role] || role}`);

  };



  return (

    <div className="min-h-screen bg-background text-foreground">

      {/* Navigation */}

      <header className={`fixed w-full z-50 transition-colors duration-200 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : ''}`}>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <a href="#" className="flex items-center gap-2.5">

            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">

              <LayoutGrid className="h-4 w-4 text-white" />

            </div>

            <span className="font-display font-semibold text-foreground">SmartHR</span>

          </a>



          <nav className="hidden md:flex items-center gap-7">

            {navLinks.map(link => (

              <a key={link.href} href={link.href} className="nav-link">{link.label}</a>

            ))}

          </nav>



          <div className="hidden md:flex items-center gap-3">

            <Popover>

              <PopoverTrigger asChild>

                <Button variant="outline" size="sm">Sign In</Button>

              </PopoverTrigger>

              <PopoverContent className="w-52 p-2" align="end">

                {roles.map(r => (

                  <Button key={r.role} variant="ghost" className="w-full justify-start gap-2 h-9" onClick={() => handleRoleSelect(r.role)}>

                    <r.icon className="h-4 w-4 text-muted-foreground" />

                    {r.title}

                  </Button>

                ))}

              </PopoverContent>

            </Popover>

            <Button size="sm" asChild><Link to="/opportunities">View Opportunities</Link></Button>

          </div>



          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted">

            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}

          </button>

        </div>



        <AnimatePresence>

          {isMobileMenuOpen && (

            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-border bg-card overflow-hidden">

              <div className="px-4 py-3 space-y-1">

                {navLinks.map(link => (

                  <a key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted">{link.label}</a>

                ))}

                <Button className="w-full mt-2" onClick={() => handleRoleSelect('employee')}>Sign In</Button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </header>



      {/* Hero */}

      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">

        <HeroBackground />



        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div>

              <motion.div

                initial={{ opacity: 0, y: 8 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.4 }}

                className="inline-flex items-center gap-2 rounded-md border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 mb-6"

              >

                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />

                Trusted by 500+ organizations

              </motion.div>



              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight mb-6">

                {headlineWords.map((word, i) => (

                  <motion.span

                    key={i}

                    initial={{ opacity: 0, y: 24 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}

                    className={`inline-block mr-[0.3em] ${i >= 2 ? 'text-blue-400' : ''}`}

                  >

                    {word}

                  </motion.span>

                ))}

              </h1>



              <AnimatedText delay={0.45} className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">

                A complete HR platform for recruitment, onboarding, and workforce management — built for teams that need structure, not gimmicks.

              </AnimatedText>



              <FadeIn delay={0.55} className="flex flex-wrap gap-3 mb-10">

                <Button size="lg" asChild>
                  <Link to="/opportunities">
                    Browse Opportunities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" onClick={() => handleRoleSelect('employee')}>

                  Sign In to Portal

                </Button>

              </FadeIn>



              <FadeIn delay={0.65} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">

                {stats.map((stat, i) => (

                  <motion.div

                    key={stat.label}

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: 0.8 + i * 0.1 }}

                  >

                    <p className="font-display text-xl font-bold text-foreground">

                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />

                    </p>

                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>

                  </motion.div>

                ))}

              </FadeIn>

            </div>



            <DashboardPreview />

          </div>

        </div>

      </section>



      {/* Features */}

      <section id="features" className="py-20 lg:py-24 border-t border-border">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-14 max-w-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Platform</p>

            <h2 className="font-display text-3xl font-bold mb-3">Core capabilities</h2>

            <p className="text-muted-foreground text-sm leading-relaxed">Everything required to run a professional hiring operation, in one system.</p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {features.map((feature, i) => (

              <FeatureCard

                key={feature.title}

                icon={feature.icon}

                title={feature.title}

                description={feature.description}

                index={i}

                accent={feature.accent}

              />

            ))}

          </div>

        </div>

      </section>



      {/* How it works */}

      <section id="how-it-works" className="py-20 bg-card/30 border-t border-border">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-12 text-center max-w-lg mx-auto">

            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Workflow</p>

            <h2 className="font-display text-3xl font-bold mb-3">How it works</h2>

            <p className="text-sm text-muted-foreground">A clear, five-step process from job posting to hire.</p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            {steps.map((step, i) => (

              <div key={step.title} className="info-card text-center h-full">

                <div className="info-card-icon mx-auto mb-4">

                  <step.icon className="h-[18px] w-[18px] stroke-[1.75]" />

                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/70 mb-1.5">Step {i + 1}</p>

                <h3 className="font-display font-semibold text-[15px] mb-1.5">{step.title}</h3>

                <p className="text-[13px] text-muted-foreground leading-relaxed">{step.description}</p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Roles */}

      <section id="roles" className="py-20 border-t border-border">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="mb-12 max-w-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Access</p>

            <h2 className="font-display text-3xl font-bold mb-3">Built for every role</h2>

            <p className="text-sm text-muted-foreground">Dedicated dashboards with role-appropriate permissions.</p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {roles.map(role => (

              <button

                key={role.role}

                onClick={() => handleRoleSelect(role.role)}

                className="info-card text-left group cursor-pointer h-full"

              >

                <div className="info-card-icon mb-5">

                  <role.icon className="h-[18px] w-[18px] stroke-[1.75]" />

                </div>

                <h3 className="font-display font-semibold text-[15px] mb-1.5">{role.title}</h3>

                <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">{role.description}</p>

                <span className="inline-flex items-center text-xs font-medium text-blue-400 group-hover:gap-1.5 transition-all">

                  Sign in <ChevronRight className="h-3.5 w-3.5" />

                </span>

              </button>

            ))}

          </div>

        </div>

      </section>



      {/* Testimonials */}

      <section className="py-20 bg-card/30 border-t border-border">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <h2 className="font-display text-2xl font-bold text-center mb-10">What teams say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {testimonials.map(t => (

              <div key={t.author} className="info-card h-full flex flex-col">

                <Quote className="h-5 w-5 text-blue-500/25 mb-4" />

                <p className="text-[13px] text-muted-foreground leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>

                <div className="border-t border-border/60 pt-4">

                  <p className="text-sm font-medium text-foreground">{t.author}</p>

                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* FAQ */}

      <section className="py-20 border-t border-border">

        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          <h2 className="font-display text-2xl font-bold text-center mb-8">Common questions</h2>

          <div className="space-y-2">

            {faqs.map((faq, i) => (

              <div key={i} className="rounded-lg border border-border bg-card">

                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-secondary/30 transition-colors">

                  {faq.q}

                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2 ${activeFaq === i ? 'rotate-180' : ''}`} />

                </button>

                <AnimatePresence>

                  {activeFaq === i && (

                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">

                      <p className="px-4 pb-3.5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* CTA */}

      <section className="py-20 border-t border-border bg-blue-600/5">

        <div className="max-w-xl mx-auto px-4 text-center">

          <h2 className="font-display text-3xl font-bold mb-3">Get started with SmartHR</h2>

          <p className="text-sm text-muted-foreground mb-6">Sign in to your portal or explore open positions.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Button size="lg" onClick={() => handleRoleSelect('employee')}>Sign In</Button>

            <Button size="lg" variant="outline" asChild><Link to="/opportunities">View Opportunities</Link></Button>

          </div>

        </div>

      </section>



      {/* Footer */}

      <footer id="contact" className="border-t border-border py-12">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            <div>

              <div className="flex items-center gap-2 mb-3">

                <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">

                  <LayoutGrid className="h-3.5 w-3.5 text-white" />

                </div>

                <span className="font-display font-semibold text-sm">SmartHR</span>

              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">Enterprise HR and recruitment management.</p>

            </div>

            {[

              { title: 'Product', links: ['Features', 'Security', 'Integrations'] },

              { title: 'Company', links: ['About', 'Careers', 'Contact'] },

              { title: 'Legal', links: ['Privacy', 'Terms'] },

            ].map(col => (

              <div key={col.title}>

                <h4 className="text-xs font-semibold mb-3">{col.title}</h4>

                <ul className="space-y-2">

                  {col.links.map(link => (

                    <li key={link}><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>

                  ))}

                </ul>

              </div>

            ))}

          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SmartHR</p>

            <div className="flex gap-4">

              {[Linkedin, Twitter, Facebook, Mail].map((Icon, i) => (

                <a key={i} href="#" className="text-muted-foreground hover:text-blue-400 transition-colors"><Icon className="h-4 w-4" /></a>

              ))}

            </div>

          </div>

        </div>

      </footer>



    </div>

  );

}


