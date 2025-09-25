"use client";
import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import BookingFilter from "../booking/BookingFilter";
import OrderListView from "../booking/OrderListView";
import OrderDetailView from "../booking/OrderDetailView";
import { useBookingStore } from "../../stores/bookingStore";
import { useAuthStore } from "../../stores/authStore";
import { Order } from "../../types";

const BookingManageScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const { orders, fetchOrders, loading, error } = useBookingStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchOrders(user.id);
    }
  }, [fetchOrders, user?.id]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    // Note: Date filtering is not applicable for orders as they don't have a direct date field
    // We could filter by booking dates if needed

    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
  };

  const handleBackToList = () => {
    setViewingOrder(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSelectedDate("");
  };

  const handleExportReport = () => {
    console.log("Exporting report...");
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => user?.id && fetchOrders(user.id)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Show order detail view if viewing an order */}
      {viewingOrder ? (
        <OrderDetailView
          order={viewingOrder}
          onBack={handleBackToList}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
              <p className="text-gray-600">
                Theo dõi và quản lý tất cả các đơn hàng
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>

          {/* Filter and List */}
          <BookingFilter
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            selectedDate={selectedDate}
            onSearchTermChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onSelectedDateChange={setSelectedDate}
            onClearFilters={handleClearFilters}
          />
          <OrderListView
            orders={filteredOrders}
            onViewOrder={handleViewOrder}
          />
        </>
      )}
    </div>
  );
};

export default BookingManageScreen;