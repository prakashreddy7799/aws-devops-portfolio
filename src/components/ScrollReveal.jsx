import { m } from 'motion/react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export default function ScrollReveal({ children, delay = 0, className = '', ...props }) {
  const { stopMotion } = useMotionPreferences();
  return (
    <m.div
      className={className}
      initial={stopMotion ? false : { opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay: stopMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </m.div>
  );
}
