import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function VoiceAnimation({ isActive, size = 200 }) {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.5 + 0.5);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [isActive]);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative rounded-full"
        style={{ width: size, height: size }}
        animate={{
          scale: isActive ? 1 + pulseIntensity * 0.1 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Main orb */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700"
          animate={{
            opacity: isActive ? 0.9 : 0.6,
            boxShadow: isActive
              ? `0 0 ${40 + pulseIntensity * 20}px rgba(59, 130, 246, 0.5)`
              : "0 0 20px rgba(59, 130, 246, 0.3)",
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Animated rings */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-blue-300"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
