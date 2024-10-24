import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useState } from "react";
import { cn } from '../../../lib/util'; // Ensure you have classnames installed or adjust accordingly
import { AiOutlineTool, AiOutlineRobot  } from 'react-icons/ai';
import {MdOutlineMonitor , MdSensors } from 'react-icons/md' ;
import { VscGraphScatter } from "react-icons/vsc";
import { GiArtificialHive } from "react-icons/gi";
import { GrHostMaintenance } from "react-icons/gr";
export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10", className)}>
      {items.map((item, idx) => (
        <Link
          to={item?.link} // Using 'to' prop instead of 'href'
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gray-500 dark:bg-gray-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex items-center space-x-4">
              {/* Logo/Icon for Predictive Maintenance or AI */}
              {item.icon === "maintenance" && <AiOutlineTool size={40} className="text-blue-500" />}
              {item.icon === "ai" && <GiArtificialHive size={40} className="text-green-500" />}
              {item.icon === "monitoring" && <MdOutlineMonitor size={40} className="text-green-500" />}
              {item.icon === "sensor" && <MdSensors  size={40} className="text-green-500" />}
              {item.icon === "graph" && <VscGraphScatter  size={40} className="text-green-500" />}
              {item.icon === "maintain" && <GrHostMaintenance  size={40} className="text-green-500" />}
              {/* Add other icons as needed */}
            </div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-slate-900 border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn("mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};
