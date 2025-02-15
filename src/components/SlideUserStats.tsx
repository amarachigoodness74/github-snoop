import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import UserStats from "./UserStats";
import { Stat } from "@/interfaces/others";
import ScrollToTop from "./ScroolToTopBtn";

const SlideUserStats = ({
  title,
  selectedStat,
  setSelectedStat,
}: {
  title: string;
  selectedStat: Stat;
  setSelectedStat: (stat: Stat | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    const toggleVisibility = () => {
      if (container && container.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    if (container) {
      container.addEventListener("scroll", toggleVisibility);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 right-0 w-full h-full bg-gray-800 shadow-lg z-50 overflow-auto md:w-4/6"
      >
        {/* Sticky header */}
        <div className="sticky top-0 w-full bg-gray-900 p-4 flex justify-between items-center z-50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            className="text-white text-xl"
            onClick={() => setSelectedStat(null)}
          >
            ✖
          </button>
        </div>
        <div className="p-4">
          <UserStats selectedStat={selectedStat} />
        </div>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-[1000]"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </motion.div>
    </>
  );
};

export default SlideUserStats;
