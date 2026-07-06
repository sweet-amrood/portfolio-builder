import { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { cardHover, pressTap, useTemplateMotion, EASE_OUT } from './motionPresets';

const TemplateMotionContext = createContext(true);

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  button: motion.button,
  a: motion.a,
};

export function TemplateMotionProvider({ preview, editable, children }) {
  const animate = useTemplateMotion(preview, editable);
  return (
    <TemplateMotionContext.Provider value={animate}>{children}</TemplateMotionContext.Provider>
  );
}

function useAnimate() {
  return useContext(TemplateMotionContext);
}

function resolveComponent(as) {
  return MOTION_TAGS[as] || motion.div;
}

export function MotionReveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  as = 'div',
  ...props
}) {
  const animate = useAnimate();
  const Component = resolveComponent(as);

  return (
    <Component
      className={className}
      initial={animate ? { opacity: 0, y } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionHero({ children, className = '', delay = 0, as = 'div', ...props }) {
  const animate = useAnimate();
  const Component = resolveComponent(as);

  return (
    <Component
      className={className}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionTitle({ children, className = '', delay = 0, as = 'h2' }) {
  return (
    <MotionReveal as={as} className={className} delay={delay} y={18}>
      {children}
    </MotionReveal>
  );
}

export function MotionCard({ children, className = '', delay = 0, hover = true }) {
  const animate = useAnimate();

  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y: 20, scale: 0.97 } : false}
      whileInView={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      whileHover={hover && animate ? cardHover : undefined}
    >
      {children}
    </motion.div>
  );
}

export function MotionPressable({ children, className = '', as = 'button', ...props }) {
  const animate = useAnimate();
  const Component = resolveComponent(as);

  return (
    <Component className={className} whileTap={animate ? pressTap : undefined} {...props}>
      {children}
    </Component>
  );
}

export function MotionStagger({ children, className = '' }) {
  const animate = useAnimate();

  return (
    <motion.div
      className={className}
      initial={animate ? 'hidden' : false}
      whileInView={animate ? 'visible' : undefined}
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children, className = '' }) {
  const animate = useAnimate();

  return (
    <motion.div
      className={className}
      variants={
        animate
          ? {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
