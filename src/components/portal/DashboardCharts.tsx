"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Props {
  practiceData: { name: string; value: number }[];
  activeCount: number;
  completedCount: number;
}

const COLORS = ["#0B1F3A", "#C9A24B", "#2563EB", "#059669", "#D97706"];

export function DashboardCharts({ practiceData, activeCount, completedCount }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 h-72 animate-pulse bg-gray-100" />
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 h-72 animate-pulse bg-gray-100" />
      </div>
    );
  }

  const ratioData = [
    { name: "Active Litigation", value: activeCount, color: "#059669" },
    { name: "Completed Decrees", value: completedCount, color: "#2563EB" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Practice Area Distribution */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#071526]">
              Litigation Caseload by Practice Area
            </h2>
            <p className="text-[11px] text-gray-500">
              Distribution across Civil, Revenue, Consumer, Criminal, and MACT matters
            </p>
          </div>
          <span className="text-xs font-bold text-[#C9A24B] bg-[#C9A24B]/10 px-2.5 py-1 rounded-lg">
            High Court & District Benches
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={practiceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#071526",
                  color: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #C9A24B",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {practiceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active vs Completed Ratio */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm flex flex-col justify-between">
        <div>
          <div className="pb-4 border-b border-gray-100 mb-4">
            <h2 className="font-serif text-lg font-bold text-[#071526]">
              Active vs Completed
            </h2>
            <p className="text-[11px] text-gray-500">
              Trial efficiency & decree disposition
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`ratio-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#071526",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #C9A24B",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-serif text-xl font-bold text-[#071526]">
                {(activeCount + completedCount).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">
                Total Matters
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-center">
            <p className="font-bold text-sm">{activeCount.toLocaleString()}</p>
            <p className="text-[10px]">Active ({Math.round((activeCount / (activeCount + completedCount || 1)) * 100)}%)</p>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-800 text-center">
            <p className="font-bold text-sm">{completedCount.toLocaleString()}</p>
            <p className="text-[10px]">Completed ({Math.round((completedCount / (activeCount + completedCount || 1)) * 100)}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
