import React from 'react';
import { Users, Briefcase, ArrowRight } from 'lucide-react';

function App() {
  const handleRedirect = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TalentConnect</h1>
            </div>
            <div className="text-sm text-gray-500">
              Recruitment Portal
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TalentConnect
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive recruitment platform connecting talented candidates with great employers
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 ml-4">For Candidates</h3>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                Browse job opportunities
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                Apply with one-click applications
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                Get AI-powered job recommendations
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                Chat support for guidance
              </li>
            </ul>
            <button
              onClick={() => handleRedirect('/index.html')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Access Candidate Portal
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Briefcase className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 ml-4">For HR Teams</h3>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-indigo-500 mr-2" />
                Manage applicant pipeline
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-indigo-500 mr-2" />
                AI-powered candidate screening
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-indigo-500 mr-2" />
                Automated personalized emails
              </li>
              <li className="flex items-center text-gray-700">
                <ArrowRight className="h-4 w-4 text-indigo-500 mr-2" />
                Advanced analytics dashboard
              </li>
            </ul>
            <button
              onClick={() => handleRedirect('/index.html')}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Access HR Dashboard
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Platform Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,500+</div>
              <div className="text-gray-600">Active Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">250+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 TalentConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;