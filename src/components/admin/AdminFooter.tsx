export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>© {currentYear} PalmPort Admin</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2 md:mt-0">
            <span>System Status: <span className="text-green-600 font-medium">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}