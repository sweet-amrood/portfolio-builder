export const EASE_OUT = [0.22, 1, 0.36, 1];

export const motionVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: EASE_OUT },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: 0.45, delay, ease: EASE_OUT },
    }),
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, delay, ease: EASE_OUT },
    }),
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay, ease: EASE_OUT },
    }),
  },
};

export const cardHover = {
  y: -5,
  transition: { duration: 0.22, ease: EASE_OUT },
};

export const pressTap = { scale: 0.97 };

export function useTemplateMotion(preview, editable) {
  return !preview && !editable;
}
