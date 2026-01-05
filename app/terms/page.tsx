"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background-base">
      {/* Header */}
      <header className="border-b-2 border-border-muted">
        <div className="container mx-auto max-w-[900px] px-6 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-black-alpha-64 hover:text-accent-black transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-[900px] px-6 py-16 md:py-24 border-x-2 border-border-muted">
        <div className="max-w-[700px]">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-black mb-4">
            Terms of Service
          </h1>
          <p className="text-black-alpha-64 mb-12">
            Last updated: January 6, 2026
          </p>

          <div className="space-y-10 text-accent-black">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                By accessing or using RapidScreen's services, including SUARA, KrackedDevs, and I.G.M.E (Innovative Government, Military & Enterprise) solutions, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
              <p className="text-black-alpha-72 leading-relaxed mb-4">
                RapidScreen provides:
              </p>
              <ul className="list-disc list-inside text-black-alpha-72 leading-relaxed space-y-2 ml-4">
                <li><strong>SUARA:</strong> Malaysia's national-grade Voice AI platform supporting Bahasa Malaysia, English, and local dialects.</li>
                <li><strong>KrackedDevs:</strong> AI-augmented developer guild and delivery operating system.</li>
                <li><strong>I.G.M.E:</strong> Government, Military & Enterprise solution delivery for mission-critical deployments.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by RapidScreen and are protected by Malaysian and international intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Privacy</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                Your use of our services is also governed by our Privacy Policy. For public-sector deployments, we follow sovereignty-first principles with government ownership and access control, and privacy-by-design architecture.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Service Availability</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                We strive to maintain high availability of our services but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                To the fullest extent permitted by law, RapidScreen shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-heat-100 mt-2">
                hello@rapidscreen.io
              </p>
              <p className="text-black-alpha-64 mt-2 text-sm">
                Level 6, Menara Darussalam, 12, Jalan Pinang, Kuala Lumpur, 50450
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border-muted">
        <div className="container mx-auto max-w-[900px] px-6 py-8 border-x-2 border-border-muted">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black-alpha-64">
            <p>© 2026 Rapidscreen. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-accent-black font-medium">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-accent-black transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

