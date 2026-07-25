'use client';

import * as React from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, TextArea } from '@/components/ui/input';

const CONTACT_ITEMS = [
  {
    icon: <Mail size={22} strokeWidth={1.5} />,
    label: 'Email',
    value: 'contact@nexiora.com',
    note: 'Direct inquiries & corporate mandates',
  },
  {
    icon: <Phone size={22} strokeWidth={1.5} />,
    label: 'Phone',
    value: '+91 80 4567 8900',
    note: 'Mon–Fri, 9:00 AM – 6:00 PM IST',
  },
  {
    icon: <MapPin size={22} strokeWidth={1.5} />,
    label: 'Headquarters',
    value: 'Bengaluru & Mumbai, India',
    note: 'Serving enterprise & startup hiring globally',
  },
  {
    icon: <Clock size={22} strokeWidth={1.5} />,
    label: 'Response SLA',
    value: 'Within 24 Hours',
    note: 'Guaranteed response from a talent partner',
  },
];

export default function ContactPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast({
        type: 'error',
        title: 'Required fields missing',
        message: 'Please fill out all required fields before sending your message.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/contact', formData);

      setIsSuccess(true);
      addToast({
        type: 'success',
        title: 'Inquiry Received!',
        message: 'Thank you for contacting NEXIORA. A talent consultant will reach out within 24 hours.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.response?.data?.message || 'Could not send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <section
        className="py-20 text-white border-b border-[rgba(255,255,255,0.1)] relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)' }}
      >
        <div className="container-nexiora relative z-10">
          <div className="mb-3">
            <Badge variant="gold-dark">Get In Touch</Badge>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white max-w-xl leading-tight"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            Contact NEXIORA
          </h1>
          <p className="text-white/80 mt-4 max-w-xl text-lg font-normal">
            Whether you are looking to post hiring mandates or advance your career — our talent consultants are ready to assist.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="section-padding bg-[var(--nexiora-off-white)]" aria-label="Contact information and form">
        <div className="container-nexiora">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact info cards */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--nexiora-navy)] mb-8">
                Reach Us Directly
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {CONTACT_ITEMS.map((item) => (
                  <div key={item.label} className="card-base p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--nexiora-navy)] shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--nexiora-gold-start), var(--nexiora-gold-end))' }}
                      >
                        {item.icon}
                      </div>
                      <span className="text-sm font-semibold text-[var(--nexiora-navy)]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--nexiora-navy)] font-semibold">
                      {item.value}
                    </p>
                    <p className="text-xs text-[var(--nexiora-slate-light)]">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs">
                <h3 className="text-base font-bold text-[var(--nexiora-navy)] mb-2">
                  Guaranteed Response SLA
                </h3>
                <p className="text-xs text-[var(--nexiora-slate)] leading-relaxed">
                  Every inquiry submitted via our portal is routed to a dedicated NEXIORA client account manager. We review requirements promptly and respond within one business day.
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--nexiora-navy)] mb-8">
                Send Us a Message
              </h2>

              <div className="card-base p-8 bg-white shadow-xs">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[rgba(46,125,91,0.1)] flex items-center justify-center text-[var(--status-success)]">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3
                      className="text-2xl font-bold text-[var(--nexiora-navy)]"
                      style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
                    >
                      Message Sent Successfully!
                    </h3>
                    <p className="text-sm text-[var(--nexiora-slate)] max-w-md">
                      Thank you for contacting NEXIORA. Our team has received your message and will respond shortly.
                    </p>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setIsSuccess(false)}
                      className="mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      type="text"
                      placeholder="e.g. Hiring Mandate / Staffing Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      required
                    />

                    <TextArea
                      label="Message"
                      rows={5}
                      placeholder="Describe your staffing requirements or career inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      required
                    />

                    <div className="flex justify-end mt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        <Send size={16} className="mr-1.5" /> Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
