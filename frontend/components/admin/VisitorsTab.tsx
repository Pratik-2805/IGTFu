"use client";

import { Search, Filter } from "lucide-react";
import { VisitorRegistration } from "@/utils/api";

interface VisitorsTabProps {
  visitors: VisitorRegistration[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  filterStatus: string;
  setFilterStatus: (v: string) => void;

  stats: {
    totalVisitors: number;
    paidVisitors: number;
    contactedVisitors: number;
    pendingVisitors: number;
    rejectedVisitors: number;
  };

  updateStatus: (id: number, status: VisitorRegistration["status"]) => void;
  isUpdating: boolean;
  loading: boolean;
}

export default function VisitorsTab({
  visitors,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  updateStatus,
  isUpdating,
  stats,
  loading,
}: VisitorsTabProps) {
  if (isUpdating) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-40 flex justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading visitors...</p>
        </div>
      </div>
    );
  }

  // --- UI Helpers ---
  const getStatusColor = (status: VisitorRegistration["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 border-green-500 text-green-700";
      case "contacted":
        return "bg-blue-500/10 border-blue-500 text-blue-700";
      case "pending":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-700";
      case "rejected":
        return "bg-red-500/10 border-red-500 text-red-700";
      default:
        return "bg-muted border-border";
    }
  };

  const getStatusBadgeColor = (status: VisitorRegistration["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500 text-white";
      case "contacted":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const safeList = Array.isArray(visitors) ? visitors : [];

  const filteredVisitors = safeList.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.first_name.toLowerCase().includes(q) ||
      v.last_name.toLowerCase().includes(q) ||
      v.company_name.toLowerCase().includes(q) ||
      v.email_address.toLowerCase().includes(q) ||
      v.phone_number.toLowerCase().includes(q) ||
      v.industry_interest.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-purple-500/10 border border-purple-500 p-6 rounded-lg">
          <p className="text-sm text-purple-700 mb-1">Total Visitors</p>
          <p className="text-3xl font-bold text-purple-700">
            {stats.totalVisitors}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500 p-6 rounded-lg">
          <p className="text-sm text-green-700 mb-1">Paid</p>
          <p className="text-3xl font-bold text-green-700">
            {stats.paidVisitors}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500 p-6 rounded-lg">
          <p className="text-sm text-blue-700 mb-1">Contacted</p>
          <p className="text-3xl font-bold text-blue-700">
            {stats.contactedVisitors}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500 p-6 rounded-lg">
          <p className="text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">
            {stats.pendingVisitors}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg">
          <p className="text-sm text-red-700 mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-700">
            {stats.rejectedVisitors}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Visitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-md bg-background border border-border focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-md bg-background border border-border focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="contacted">Contacted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* visitor List */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl mb-4">
          visitor Registrations ({filteredVisitors.length})
        </h2>

        {filteredVisitors.map((visitor) => (
          <div
            key={visitor.id}
            className={`border-2 rounded-lg p-6 hover:shadow-lg transition ${getStatusColor(
              visitor.status
            )}`}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Left Section */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-serif text-xl">
                      {visitor.first_name} {visitor.last_name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Registered on{" "}
                      {new Date(visitor.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      visitor.status
                    )}`}
                  >
                    {visitor.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{visitor.company_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{visitor.industry_interest}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{visitor.email_address}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{visitor.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Event Location
                    </p>
                    <p className="font-medium">{visitor.event_location}</p>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="lg:w-48">
                <p className="text-sm font-medium mb-3">Update Status</p>
                <div className="space-y-2">
                  <button
                    onClick={() => updateStatus(visitor.id, "pending")}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      visitor.status === "pending"
                        ? "bg-yellow-600 text-white cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                    disabled={visitor.status === "pending"}
                  >
                    {visitor.status === "pending"
                      ? "Currently Pending"
                      : "Mark Pending"}
                  </button>
                  <button
                    onClick={() => updateStatus(visitor.id, "contacted")}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      visitor.status === "contacted"
                        ? "bg-blue-600 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={visitor.status === "contacted"}
                  >
                    {visitor.status === "contacted"
                      ? "Currently Contacted"
                      : "Mark Contacted"}
                  </button>
                  <button
                    onClick={() => updateStatus(visitor.id, "paid")}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      visitor.status === "paid"
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    disabled={visitor.status === "paid"}
                  >
                    {visitor.status === "paid" ? "Currently Paid" : "Mark Paid"}
                  </button>
                  <button
                    onClick={() => updateStatus(visitor.id, "rejected")}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      visitor.status === "rejected"
                        ? "bg-red-600 text-white cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    disabled={visitor.status === "rejected"}
                  >
                    {visitor.status === "rejected"
                      ? "Currently Rejected"
                      : "Mark Rejected"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredVisitors.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No matching Visitors found.
          </div>
        )}
      </div>
    </div>
  );
}
