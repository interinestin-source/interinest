"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export type StatItem = {
  id: string;
  title: string;
  value: number | string;
  sub: string;
  icon: LucideIcon;
  accent: string;      // bg color for icon box
  iconColor: string;   // icon stroke color
  stripe: string;      // top border color
};

type StatsProps = {
  stats: StatItem[];
  loading?: boolean;
  accentColor?: string;
};

const Stats: React.FC<StatsProps> = ({ stats, loading = false, accentColor = "#CAAB06" }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.id}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Accent stripe */}
            <div className="h-1 w-full" style={{ backgroundColor: s.stripe }} />

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.accent }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>

              <div>
                {loading ? (
                  <div className="h-7 w-16 bg-slate-100 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                )}
                <p className="text-xs text-slate-500 mt-0.5">{s.title}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Stats;
