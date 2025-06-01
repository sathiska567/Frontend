import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Users,
  Grid3X3,
  List,
  Crown,
  RefreshCw,
} from "lucide-react";

const TrendsPage = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Category data based on user keyword preferences
  const categoryData = [
    {
      name: "Nature",
      users: 23945,
      growth: 18.5,
      color: "#f472b6",
      keywords: ["landscape", "forest", "mountains", "sunset", "wilderness"],
      trend: [840, 920, 1050, 1120, 1240, 1330],
    },
    {
      name: "Architecture",
      users: 18762,
      growth: 12.3,
      color: "#818cf8",
      keywords: ["buildings", "urban", "skyscraper", "modern", "historic"],
      trend: [720, 760, 810, 880, 920, 980],
    },
    {
      name: "People",
      users: 15321,
      growth: -2.7,
      color: "#38bdf8",
      keywords: ["portrait", "face", "smile", "lifestyle", "group"],
      trend: [680, 650, 630, 610, 590, 580],
    },
    {
      name: "Food",
      users: 14653,
      growth: 22.1,
      color: "#4ade80",
      keywords: ["restaurant", "cuisine", "meal", "cooking", "ingredients"],
      trend: [420, 480, 560, 610, 650, 720],
    },
    {
      name: "Travel",
      users: 12875,
      growth: 8.9,
      color: "#facc15",
      keywords: ["destination", "vacation", "tourism", "beach", "city"],
      trend: [520, 540, 570, 590, 610, 630],
    },
    {
      name: "Technology",
      users: 11240,
      growth: 15.6,
      color: "#fb923c",
      keywords: ["digital", "device", "computer", "smartphone", "electronic"],
      trend: [380, 410, 450, 490, 520, 560],
    },
    {
      name: "Fashion",
      users: 9876,
      growth: 5.3,
      color: "#e879f9",
      keywords: ["clothing", "style", "dress", "model", "trendy"],
      trend: [410, 420, 430, 440, 450, 460],
    },
    {
      name: "Abstract",
      users: 8762,
      growth: 7.4,
      color: "#2dd4bf",
      keywords: ["minimal", "pattern", "shapes", "texture", "artistic"],
      trend: [320, 330, 350, 360, 380, 390],
    },
  ];

  // Pie chart data based on user counts
  const pieData = categoryData.slice(0, 5).map((category) => ({
    name: category.name,
    value: category.users,
    color: category.color,
  }));

  // Add "Others" category for the pie chart
  const othersValue = categoryData
    .slice(5)
    .reduce((sum, item) => sum + item.users, 0);
  if (othersValue > 0) {
    pieData.push({
      name: "Others",
      value: othersValue,
      color: "#6b7280",
    });
  }

  // Trending keywords by usage
  const trendingKeywords = [
    { keyword: "mountains", category: "Nature", volume: 8765, change: 12.4 },
    {
      keyword: "skyline",
      category: "Architecture",
      volume: 6543,
      change: -3.7,
    },
    { keyword: "beach", category: "Travel", volume: 5432, change: 8.2 },
    { keyword: "pasta", category: "Food", volume: 4321, change: 15.8 },
    { keyword: "portrait", category: "People", volume: 3210, change: 5.3 },
  ];

  // User growth over time
  const userGrowthData = [
    { month: "Jan", users: 65000 },
    { month: "Feb", users: 68000 },
    { month: "Mar", users: 72000 },
    { month: "Apr", users: 75000 },
    { month: "May", users: 82000 },
    { month: "Jun", users: 87000 },
  ];

  // Stats summary
  const stats = [
    {
      title: "Total Users",
      value: "115K",
      change: 8.5,
      icon: <Users size={20} />,
    },
    {
      title: "Categories",
      value: "32",
      change: 3.2,
      icon: <Grid3X3 size={20} />,
    },
    {
      title: "Top Category",
      value: "Nature",
      change: 18.5,
      icon: <Crown size={20} />,
    },
    {
      title: "Keyword Growth",
      value: "+12.4%",
      change: 12.4,
      icon: <TrendingUp size={20} />,
    },
  ];

  // Custom tooltips for charts
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md p-3 rounded-lg border border-gray-800/80 shadow-xl">
          <p className="text-gray-200 font-medium">{payload[0].name}</p>
          <p className="text-pink-400 text-sm">
            <span className="font-semibold">Users:</span>{" "}
            {payload[0].value.toLocaleString()}
          </p>
          <p className="text-blue-400 text-sm">
            <span className="font-semibold">Share:</span>{" "}
            {`${(
              (payload[0].value /
                categoryData.reduce((sum, item) => sum + item.users, 0)) *
              100
            ).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md p-3 rounded-lg border border-gray-800/80 shadow-xl">
          <p className="text-gray-200 font-medium">{label}</p>
          <p className="text-purple-400 text-sm">
            <span className="font-semibold">Users:</span>{" "}
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div
          className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
          style={{
            backgroundSize: "30px 30px",
            backgroundImage:
              "linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">
          Keyword Trends
        </h1>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Analyze how users are categorizing their content with keywords and
          track trending topics across your platform.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden backdrop-blur-sm p-5 group transition-all duration-500 ${
                isLoading
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card background with glass effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>

              {/* Inner glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

              <div className="relative">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-gray-400 text-sm font-medium">
                    {stat.title}
                  </div>
                  <div className="p-1.5 rounded-lg bg-gray-800/80">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1.5">
                  {stat.value}
                </div>
                <div
                  className={`flex items-center text-xs ${
                    stat.change > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change > 0 ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                  <span className="ml-1">{Math.abs(stat.change)}%</span>
                  <span className="ml-2 text-gray-400">vs last period</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories Distribution (Pie Chart) */}
          <div
            className={`relative rounded-2xl overflow-hidden backdrop-blur-sm p-5 lg:col-span-1 transition-all duration-500 ${
              isLoading
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Card background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-50"></div>

            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Category Distribution
                </h2>
                <div className="flex items-center text-xs text-gray-400">
                  <RefreshCw size={14} className="mr-1" />
                  <span>Updated today</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryData.slice(0, 4).map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-xs text-gray-300 truncate">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Growth Line Chart */}
          <div
            className={`relative rounded-2xl overflow-hidden backdrop-blur-sm p-5 lg:col-span-2 transition-all duration-500 ${
              isLoading
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            {/* Card background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-50"></div>

            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">User Growth</h2>

                <div className="flex space-x-2 bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-gray-700/40">
                  {["month", "quarter", "year"].map((range) => (
                    <button
                      key={range}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-300 ${
                        timeRange === range
                          ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#333"
                    />
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />
                    <YAxis tick={{ fill: "#9ca3af" }} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ec4899"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ec4899"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#ec4899",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#ec4899",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      strokeWidth={0}
                      fill="url(#colorUsers)"
                      fillOpacity={0.2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div
          className={`mt-6 transition-all duration-500 ${
            isLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Popular Categories by User Count
            </h2>

            <div className="flex space-x-2">
              <div className="flex bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-gray-700/40 mr-2">
                <button
                  className={`p-1.5 rounded-md transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-gray-700/50 text-white"
                      : "text-gray-400"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  className={`p-1.5 rounded-md transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gray-700/50 text-white"
                      : "text-gray-400"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm border border-gray-700/40">
                  <Filter size={16} className="mr-2 text-gray-400" />
                  <span>Filter</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryData.map((category, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group cursor-pointer"
                  onClick={() =>
                    setSelectedCategory(
                      category.name === selectedCategory ? null : category.name
                    )
                  }
                >
                  {/* Card background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>

                  {/* Top color band */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: category.color }}
                  ></div>

                  <div className="relative p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-white mb-0.5">
                          {category.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {category.users.toLocaleString()} users
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <span
                          className="text-xl"
                          style={{ color: category.color }}
                        >
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Growth indicator */}
                    <div
                      className={`flex items-center text-xs mb-3 ${
                        category.growth > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {category.growth > 0 ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                      <span className="ml-1 font-medium">
                        {Math.abs(category.growth)}% from last month
                      </span>
                    </div>

                    {/* Mini sparkline trend */}
                    <div className="h-8 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={category.trend.map((value, i) => ({
                            name: i,
                            value,
                          }))}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={category.color}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {category.keywords.slice(0, 3).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-300 border border-gray-700/40"
                        >
                          {keyword}
                        </span>
                      ))}
                      {category.keywords.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-300 border border-gray-700/40">
                          +{category.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
              {/* List background */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>

              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/40">
                    <tr className="text-left text-gray-300 border-b border-gray-800/50">
                      <th className="p-4 font-medium rounded-tl-2xl">
                        Category
                      </th>
                      <th className="p-4 font-medium text-right">Users</th>
                      <th className="p-4 font-medium text-right">Growth</th>
                      <th className="p-4 font-medium">Top Keywords</th>
                      <th className="p-4 font-medium text-right rounded-tr-2xl">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30">
                    {categoryData.map((category, index) => (
                      <tr
                        key={index}
                        className="text-white transition-all duration-300 hover:bg-gray-800/30 cursor-pointer"
                        onClick={() =>
                          setSelectedCategory(
                            category.name === selectedCategory
                              ? null
                              : category.name
                          )
                        }
                      >
                        <td className="p-4">
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <span
                                className="text-sm font-bold"
                                style={{ color: category.color }}
                              >
                                {category.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium">
                          {category.users.toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className={`inline-flex items-center ${
                              category.growth > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {category.growth > 0 ? (
                              <ArrowUp size={14} className="mr-1" />
                            ) : (
                              <ArrowDown size={14} className="mr-1" />
                            )}
                            <span>{Math.abs(category.growth)}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {category.keywords
                              .slice(0, 3)
                              .map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-300 whitespace-nowrap"
                                >
                                  {keyword}
                                </span>
                              ))}
                            {category.keywords.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{category.keywords.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 w-32">
                          <div className="h-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={category.trend.map((value, i) => ({
                                  name: i,
                                  value,
                                }))}
                              >
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke={category.color}
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Trending Keywords Table */}
        <div
          className={`mt-6 relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 ${
            isLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 border border-gray-800/50 rounded-2xl"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-50"></div>

          <div className="relative p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Trending Keywords
              </h2>

              <div className="flex space-x-2 bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-gray-700/40">
                {["all", "rising", "falling"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-300 ${
                      activeFilter === filter
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800/50">
                    <th className="pb-4 font-medium">#</th>
                    <th className="pb-4 font-medium">Keyword</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium text-right">Volume</th>
                    <th className="pb-4 font-medium text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {trendingKeywords.map((trend, index) => {
                    const categoryObj = categoryData.find(
                      (cat) => cat.name === trend.category
                    );
                    return (
                      <tr
                        key={index}
                        className="group hover:bg-gray-800/30 transition-colors duration-300"
                      >
                        <td className="py-4 pr-4 font-medium text-gray-500">
                          {index + 1}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-lg mr-3 group-hover:from-purple-900 group-hover:to-pink-900 transition-colors duration-300">
                              <Hash size={16} className="text-white" />
                            </span>
                            <span className="font-medium text-white">
                              {trend.keyword}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${categoryObj?.color}20`,
                              color: categoryObj?.color || "white",
                            }}
                          >
                            {trend.category}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right font-medium text-white">
                          {trend.volume.toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${
                              trend.change > 0
                                ? "bg-green-900/30 text-green-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {trend.change > 0 ? (
                              <ArrowUp size={14} className="mr-1" />
                            ) : (
                              <ArrowDown size={14} className="mr-1" />
                            )}
                            <span>{Math.abs(trend.change)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
