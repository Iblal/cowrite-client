import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const Logo = ({ className = "", size = "md", animated = false }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  const text = "Cowrite.";

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  if (animated) {
    return (
      <Link
        to="/"
        className={`font-serif font-bold tracking-tight text-black no-underline ${sizeClasses[size]} ${className} inline-block`}
      >
        <motion.div
          style={{ display: "flex" }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {text.split("").map((letter, index) => (
            <motion.span key={index} variants={child}>
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={`font-serif font-bold tracking-tight text-black no-underline ${sizeClasses[size]} ${className}`}
    >
      {text}
    </Link>
  );
};

export default Logo;
