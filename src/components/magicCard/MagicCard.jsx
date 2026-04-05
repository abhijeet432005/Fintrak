import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const MagicCard = ({
  children,
  className = "",
  gradientSize = 200,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
  gradientOpacity = 0.8,
  mode = "gradient",
  glowFrom = "#ee4f27",
  glowTo = "#6b21ef",
  glowAngle = 90,
  glowSize = 420,
  glowBlur = 60,
  glowOpacity = 0.9,
}) => {
  const [isDark, setIsDark] = useState(false);

  // Sync with document dark class
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Mouse tracking
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  // Smooth orb motion
  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30 });
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30 });
  const orbVisible = useMotionValue(0);

  const sizeRef = useRef(gradientSize);
  useEffect(() => { sizeRef.current = gradientSize; }, [gradientSize]);

  const reset = (type = "leave") => {
    if (mode === "orb") {
      orbVisible.set(type === "enter" ? glowOpacity : 0);
      return;
    }
    const off = -sizeRef.current;
    mouseX.set(off);
    mouseY.set(off);
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // ── Theme-aware values ────────────────────────────────────────────────────
  // Card surface: white in light, near-black in dark
  const cardBg = isDark ? "#0f0f12" : "#ffffff";

  // Border glow: bright in dark mode, more saturated/visible in light mode
  const borderFrom = isDark ? gradientFrom : gradientFrom;
  const borderTo   = isDark ? gradientTo   : gradientTo;

  // Static base border when not hovering
  // In dark: subtle white border. In light: subtle gray border.
  const baseBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.10)";

  // Inner hover glow color — needs to contrast against the card surface
  // Dark mode: use a light translucent blob. Light mode: slightly darker blob.
  const glowOverlayFrom = isDark
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.06)";

  // Border gradient: animated on hover, static base otherwise
  const borderGradient = useMotionTemplate`
    radial-gradient(
      ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${borderFrom},
      ${borderTo},
      ${baseBorder} 80%
    )
  `;

  // Inner glow overlay
  const innerGradient = useMotionTemplate`
    radial-gradient(
      ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${glowOverlayFrom},
      transparent 80%
    )
  `;

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => reset("leave")}
      onMouseEnter={() => reset("enter")}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
      style={{
        // Animated border via background-clip trick
        padding: "1px",
        background: borderGradient,
      }}
    >
      {/* Card surface */}
      <div
        className="relative h-full w-full rounded-2xl overflow-hidden"
        style={{ background: cardBg }}
      >
        {/* Inner hover glow — gradient mode */}
        {mode === "gradient" && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: innerGradient }}
          />
        )}

        {/* Orb glow mode */}
        {mode === "orb" && (
          <motion.div
            className="pointer-events-none absolute"
            style={{
              width: glowSize,
              height: glowSize,
              x: orbX,
              y: orbY,
              translateX: "-50%",
              translateY: "-50%",
              borderRadius: "50%",
              filter: `blur(${glowBlur}px)`,
              opacity: orbVisible,
              background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};