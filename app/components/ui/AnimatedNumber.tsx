"use client";

import { useSpring, useInView, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  formatter = (n) => String(Math.round(n)),
  className = "",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 70, damping: 22 });
  const [display, setDisplay] = useState(formatter(0));

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(formatter(latest));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spring]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
