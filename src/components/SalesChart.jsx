import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import ErrorBoundary from './ErrorBoundary';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesChart = ({ reportData, formatCurrency, chartType = "line" }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // Cleanup function to destroy chart instance on unmount
    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);
  
  if (!reportData) return null;
  
  // Validasi data berdasarkan chart type
  if (chartType === "sales" && (!reportData.dailyAnalysis || reportData.dailyAnalysis.length === 0)) {
    return null;
  }
  
  if (chartType === "payment" && (!reportData.paymentSummary || Object.keys(reportData.paymentSummary).length === 0)) {
    return null;
  }
  
  if (chartType === "products" && (!reportData.productSummary || reportData.productSummary.length === 0)) {
    return null;
  }

  // Data untuk grafik penjualan harian
  const salesChartData = {
    labels: (reportData.dailyAnalysis || []).map(day => 
      new Date(day.date).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short' 
      })
    ),
    datasets: [
      {
        label: 'Penjualan',
        data: (reportData.dailyAnalysis || []).map(day => day.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Refund',
        data: (reportData.dailyAnalysis || []).map(day => day.refunds),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ],
  };

  // Data untuk grafik profit
  const profitChartData = {
    labels: (reportData.dailyAnalysis || []).map(day => 
      new Date(day.date).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short' 
      })
    ),
    datasets: [
      {
        label: 'Revenue',
        data: (reportData.dailyAnalysis || []).map(day => day.revenue || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Profit',
        data: (reportData.dailyAnalysis || []).map(day => day.profit || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ],
  };

  // Data untuk grafik metode pembayaran
  const paymentMethodData = {
    labels: Object.keys(reportData.paymentSummary || {}),
    datasets: [
      {
        data: Object.values(reportData.paymentSummary || {}).map(method => method.amount),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#F97316', // Orange
          '#06B6D4', // Cyan
          '#84CC16', // Lime
        ],
        borderWidth: 0,
        hoverOffset: 10,
      }
    ],
  };

  // Data untuk grafik produk terlaris
  const topProductsData = {
    labels: (reportData.productSummary || []).slice(0, 5).map(product => product.name),
    datasets: [
      {
        label: 'Revenue',
        data: (reportData.productSummary || []).slice(0, 5).map(product => product.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    onHover: (event, elements) => {
      // Safely handle hover events
      try {
        if (event?.native?.target) {
          event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      } catch (error) {
        // Ignore hover errors
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        filter: function(tooltipItem) {
          // Prevent tooltip errors
          return tooltipItem && tooltipItem.parsed !== undefined;
        },
        callbacks: {
          label: function(context) {
            try {
              return `${context.dataset.label}: ${formatCurrency(context.parsed.y || context.parsed)}`;
            } catch (error) {
              return 'Data tidak tersedia';
            }
          }
        }
      }
    },
    scales: chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            try {
              return formatCurrency(value);
            } catch (error) {
              return value;
            }
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    } : {}
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false
    },
    onHover: (event, elements) => {
      // Safely handle hover events
      try {
        if (event?.native?.target) {
          event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      } catch (error) {
        // Ignore hover errors
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        filter: function(tooltipItem) {
          return tooltipItem && tooltipItem.parsed !== undefined;
        },
        callbacks: {
          label: function(context) {
            try {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
            } catch (error) {
              return 'Data tidak tersedia';
            }
          }
        }
      }
    },
    cutout: '60%',
  };

  if (chartType === "sales") {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📈 Tren Penjualan & Refund</h3>
          <div style={{ height: '300px' }}>
            <Line ref={chartRef} data={salesChartData} options={chartOptions} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (chartType === "profit") {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">💰 Tren Revenue & Profit</h3>
          <div style={{ height: '300px' }}>
            <Line ref={chartRef} data={profitChartData} options={chartOptions} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (chartType === "payment") {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">💳 Metode Pembayaran</h3>
          <div style={{ height: '300px' }}>
            <Doughnut ref={chartRef} data={paymentMethodData} options={doughnutOptions} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (chartType === "products") {
    return (
      <ErrorBoundary>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">🏆 Top 5 Produk Terlaris</h3>
          <div style={{ height: '300px' }}>
            <Bar ref={chartRef} data={topProductsData} options={chartOptions} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Default: All charts in grid
  return (
    <ErrorBoundary>
      <div className="space-y-6">
      {/* Sales Trend Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📈</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Tren Penjualan & Refund</h3>
        </div>
        <div style={{ height: '350px' }}>
          <Line ref={chartRef} data={salesChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Chart */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Metode Pembayaran</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Doughnut data={paymentMethodData} options={doughnutOptions} />
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl shadow-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Top 5 Produk</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Bar data={topProductsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default SalesChart;