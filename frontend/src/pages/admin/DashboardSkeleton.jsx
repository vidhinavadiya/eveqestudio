import AdminSidebar from '../../components/admin/AdminSidebar';

// ==============================
// DASHBOARD SKELETON
// ==============================

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="min-h-screen">

        {/* Sidebar remains visible */}
        <AdminSidebar active="dashboard" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 md:ml-72">
          <div className="max-w-7xl mx-auto">

            {/* Title Skeleton */}
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8"></div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div
                  key={item}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm"
                >
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded mt-3 animate-pulse"></div>
                </div>
              ))}

            </div>

            {/* Chart Skeleton */}
            <div className="mt-10 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">

              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6"></div>

              <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>

            </div>

            {/* Top Products Skeleton */}
            <div className="mt-10">

              <div className="h-6 w-52 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">

                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4"
                  >
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                ))}

              </div>

            </div>

            {/* Recent Orders Skeleton */}
            <div className="mt-10">

              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">

                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4"
                  >
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                  </div>
                ))}

              </div>

            </div>

            {/* Latest Users Skeleton */}
            <div className="mt-10">

              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">

                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4"
                  >
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                    <div className="h-4 w-52 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                ))}

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardSkeleton;