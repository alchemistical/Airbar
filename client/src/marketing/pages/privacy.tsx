import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Profile photo and government-issued ID (for verification)</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Address details for package pickup and delivery</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Trip details and package delivery history</li>
              <li>Communication between users through our platform</li>
              <li>Device information and IP addresses</li>
              <li>Analytics data about how you use our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Facilitate connections between senders and travelers</li>
              <li>Process payments and manage escrow services</li>
              <li>Verify user identities for safety and trust</li>
              <li>Send notifications about your deliveries</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-4">We share your information only in these circumstances:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>With other users:</strong> Basic profile information and ratings are visible to facilitate trust</li>
              <li><strong>With service providers:</strong> Payment processors, identity verification services, and cloud storage providers</li>
              <li><strong>For legal reasons:</strong> When required by law or to protect rights and safety</li>
              <li><strong>With your consent:</strong> When you explicitly agree to specific sharing</li>
            </ul>
            <p className="mb-4">We never sell your personal information to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure access controls and authentication</li>
              <li>PCI DSS compliance for payment processing</li>
              <li>Regular employee security training</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized experiences</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings, but some features may not work properly without them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
            <p className="mb-4">
              As a global platform, we may transfer your data across borders. We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Standard contractual clauses approved by regulatory authorities</li>
              <li>Data processing agreements with all service providers</li>
              <li>Compliance with local data protection laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Specific retention periods:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information: Until account deletion + 30 days</li>
              <li>Transaction records: 7 years for tax and legal compliance</li>
              <li>Communications: 2 years or as required by law</li>
              <li>Analytics data: 2 years in anonymized form</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of material changes via email or platform notification at least 30 days before they take effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@airbar.com<br />
              Data Protection Officer: dpo@airbar.com<br />
              Address: Airbar Inc., 123 Market Street, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}