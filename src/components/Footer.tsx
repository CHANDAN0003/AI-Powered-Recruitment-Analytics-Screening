
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">© {new Date().getFullYear()} TalentConnect — AI hiring tools</div>
        <div className="flex items-center gap-4">
          <a className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
          <a className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
          <div className="flex items-center gap-3">
            <a className="text-gray-600 hover:text-gray-900">🐦</a>
            <a className="text-gray-600 hover:text-gray-900">🔗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
