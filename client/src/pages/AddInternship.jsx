import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipService } from '../services';
import InternshipForm from '../components/InternshipForm';
import toast from 'react-hot-toast';

const defaultForm = {
  companyName: '', role: '', location: '', internshipType: 'Remote',
  applicationDate: new Date().toISOString().split('T')[0],
  deadline: '', status: 'Applied', stipend: '', notes: '', interviewDate: '', offerDeadline: '', resume: null,
};

export default function AddInternship() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v && k !== 'resume') fd.append(k, v); });
      if (form.resume) fd.append('resume', form.resume);
      await internshipService.create(fd);
      toast.success('Application added!');
      navigate('/internships');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add Internship</h1>
      <div className="card">
        <InternshipForm form={form} onChange={handleChange} onSubmit={handleSubmit} loading={loading} submitLabel="Add Application" />
      </div>
    </div>
  );
}
