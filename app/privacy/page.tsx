"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-black-alpha-64 mb-12">
            Last updated: January 6, 2026
          </p>

          <div className="space-y-10 text-accent-black">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                RapidScreen ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including SUARA, KrackedDevs, and I.G.M.E solutions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-black-alpha-72 leading-relaxed mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-black-alpha-72 leading-relaxed space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and company information when you register or contact us.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our services, including access times and pages viewed.</li>
                <li><strong>Voice Data:</strong> For SUARA services, voice recordings and transcriptions as necessary to provide the service.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Data Sovereignty & Ownership</h2>
              <p className="text-black-alpha-72 leading-relaxed mb-4">
                For public-sector and government deployments, we follow a sovereignty-first approach:
              </p>
              <ul className="list-disc list-inside text-black-alpha-72 leading-relaxed space-y-2 ml-4">
                <li>Data can be hosted on GovCloud or government-approved infrastructure</li>
                <li>Government retains ownership and access control over their data</li>
                <li>Privacy-by-design principles are implemented throughout</li>
                <li>Only anonymised, aggregated signals are used for dashboards and insights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. How We Use Your Information</h2>
              <p className="text-black-alpha-72 leading-relaxed mb-4">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside text-black-alpha-72 leading-relaxed space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Respond to your comments, questions, and support requests</li>
                <li>Monitor and analyze usage patterns to enhance user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. This includes access control, role-based permissions, audit trails, data encryption, and secure deployment practices aligned with industry standards and compliance requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Data retention policies can be customized for enterprise and government deployments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                We may employ third-party companies and individuals to facilitate our services. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
              <p className="text-black-alpha-72 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-black-alpha-72 leading-relaxed space-y-2 ml-4">
                <li>Right to access your personal information</li>
                <li>Right to rectify inaccurate data</li>
                <li>Right to erasure (right to be forgotten)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-black-alpha-72 leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us at:
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
              <Link href="/terms" className="hover:text-accent-black transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-accent-black font-medium">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

