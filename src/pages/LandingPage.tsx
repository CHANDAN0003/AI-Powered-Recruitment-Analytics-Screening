import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 text-gray-800">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1920&auto=format&fit=crop&s=1b3b6c7d6f4a2e8b" alt="team" className="w-full h-full object-cover brightness-75"/>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/30 via-transparent to-emerald-400/20 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="text-white">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">Hire faster. Hire smarter.</h1>
              <p className="mt-4 text-lg max-w-xl opacity-90">TalentConnect uses lightweight AI screening and personalized outreach to help teams find their next great hire — without the busywork.</p>

              <div className="mt-8 flex gap-4">
                <Link to="/signup" className="inline-flex items-center gap-3 bg-white text-indigo-700 font-semibold px-5 py-3 rounded-lg shadow hover:translate-y-[-2px] transition-transform">Create account</Link>
                <Link to="/login" className="inline-flex items-center gap-3 border border-white/60 text-white px-5 py-3 rounded-lg hover:bg-white/10 transition">Sign in</Link>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm opacity-95">
                <div className="bg-white/10 px-3 py-2 rounded">Smart screening</div>
                <div className="bg-white/10 px-3 py-2 rounded">Resume parsing</div>
                <div className="bg-white/10 px-3 py-2 rounded">Email automation</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>
              <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop&s=0c4d0d72a8a0c2f4" alt="avatar" className="w-16 h-16 rounded-full object-cover"/>
                  <div>
                    <div className="font-semibold">Acme Corp</div>
                    <div className="text-sm text-gray-600">Senior Backend Engineer</div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">We're looking for an engineer who loves scalable systems. Candidates are pre-screened with AI to highlight relevant experience and predicted fit.</p>
                  <div className="mt-4 flex gap-3">
                    <a className="text-indigo-600 font-medium">View job</a>
                    <a className="text-sm text-gray-500">1,234 applicants</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {title: 'AI screening', desc: 'Quick candidate ranking and highlights.' , icon: '🤖'},
            {title: 'Email automation', desc: 'Personalize and send at scale.' , icon: '✉️'},
            {title: 'Analytics', desc: 'Understand pipeline health.' , icon: '📊'},
          ].map(f=> (
            <div key={f.title} className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ready to get hiring?</h3>
            <p className="text-sm text-gray-600">Create your account and test TalentConnect for free.</p>
          </div>
          <div>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:brightness-105 transition">Get started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
