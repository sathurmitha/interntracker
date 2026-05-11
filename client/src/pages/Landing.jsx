import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const features = [
  { title: 'Track Applications', desc: 'Manage all your internship applications in one place with real-time status updates.' },
  { title: 'Analytics Dashboard', desc: 'Visualize your application progress with charts and statistics.' },
  { title: 'Smart Reminders', desc: 'Never miss a deadline or interview with automated reminders.' },
  { title: 'Resume Management', desc: 'Upload and manage your resumes directly within the platform.' },
];

const testimonials = [
  { name: 'Alex Johnson', role: 'CS Student', text: 'InternTracker helped me land my dream internship at a top tech company!' },
  { name: 'Sarah Lee', role: 'Engineering Student', text: 'The analytics dashboard gave me insights to improve my application strategy.' },
  { name: 'Mike Chen', role: 'Business Student', text: 'I love how easy it is to track all my applications and deadlines.' },
];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">InternTracker</h1>
          <div className="flex items-center gap-4">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🚀 Your Internship Journey Starts Here
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Track Every <span className="text-blue-600">Internship</span> Application
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Stay organized, never miss deadlines, and land your dream internship with our powerful tracking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">Start Tracking Free</Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-blue-600">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-blue-600">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Organized?</h2>
        <p className="text-blue-100 mb-8 text-lg">Join thousands of students tracking their internship journey.</p>
        <Link to="/register" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
          Create Free Account
        </Link>
      </section>

      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} InternTracker. Built with ❤️ for students.
      </footer>
    </div>
  );
}
