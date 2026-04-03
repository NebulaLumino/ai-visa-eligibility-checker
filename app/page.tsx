'use client';

import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    nationality: '',
    education: '',
    workExperience: '',
    visaType: '',
    timeline: '',
    budgetTier: 'Standard',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nationality) {
      setError('Applicant nationality is required.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🛂</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              AI Immigration Visa Eligibility Checker
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Analyze visa eligibility and generate a comprehensive immigration pathway report with timelines and requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Applicant Nationality *</label>
              <input type="text" name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g., India, China, Mexico, Philippines" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Education Level</label>
              <select name="education" value={form.education} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <option value="">Select education...</option>
                <option value="High school diploma">High school diploma</option>
                <option value="Bachelor's degree">Bachelor&apos;s degree</option>
                <option value="Master&apos;s degree">Master&apos;s degree</option>
                <option value="Doctorate / PhD">Doctorate / PhD</option>
                <option value="Professional degree (MD, JD)">Professional degree (MD, JD)</option>
                <option value="Trade/vocational certification">Trade/vocational certification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work Experience</label>
              <select name="workExperience" value={form.workExperience} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <option value="">Select experience...</option>
                <option value="None / Entry level">None / Entry level</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-7 years">3-7 years</option>
                <option value="7-15 years">7-15 years</option>
                <option value="15+ years (expert)">15+ years (expert)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Budget Tier</label>
              <select name="budgetTier" value={form.budgetTier} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <option value="Budget-constrained">Budget-constrained</option>
                <option value="Standard">Standard</option>
                <option value="Premium (willing to pay premium processing)">Premium (willing to pay premium processing)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visa Type Interest</label>
              <select name="visaType" value={form.visaType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <option value="General assessment (all types)">General assessment (all types)</option>
                <option value="Employment-based">Employment-based (H-1B, L-1, O-1)</option>
                <option value="Investor/Entrepreneur">Investor/Entrepreneur (E-2, EB-5)</option>
                <option value="Family-based">Family-based</option>
                <option value="Student">Student (F-1, M-1)</option>
                <option value="Diversity Visa">Diversity Visa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timeline Goal</label>
              <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <option value="">Select timeline...</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="Within 1 year">Within 1 year</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Analyzing Eligibility...' : 'Check Visa Eligibility'}
          </button>
        </form>

        {result && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Visa Eligibility Report</h2>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
