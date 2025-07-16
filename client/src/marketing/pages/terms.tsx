import Layout from "../components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Effective Date: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Airbar ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="mb-4">
              Airbar is a peer-to-peer delivery platform that connects people who need to send packages ("Senders") with travelers who have available luggage space ("Travelers"). We facilitate these connections but are not responsible for the actual delivery of packages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <h3 className="text-xl font-semibold mb-2">For Senders:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate package descriptions and contents</li>
              <li>Ensure packages comply with all applicable laws and regulations</li>
              <li>Not send prohibited items as outlined in our Safety Guidelines</li>
              <li>Package items securely and appropriately</li>
              <li>Meet travelers at agreed times and locations</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">For Travelers:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Honor all accepted delivery commitments</li>
              <li>Handle packages with reasonable care</li>
              <li>Deliver packages within agreed timeframes</li>
              <li>Comply with all customs and transportation regulations</li>
              <li>Maintain communication with senders throughout the journey</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Prohibited Items</h2>
            <p className="mb-4">
              Users may not send or carry any illegal items, hazardous materials, weapons, explosives, flammable substances, drugs, currency over legal limits, or any items prohibited by airline regulations or destination country laws. See our complete list in the Safety Guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>All payments are processed through our secure escrow system</li>
              <li>Funds are held in escrow until successful delivery is confirmed</li>
              <li>Airbar charges a service fee of 15% on each transaction</li>
              <li>Refunds are handled according to our Refund Policy</li>
              <li>Users are responsible for any applicable taxes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Liability and Insurance</h2>
            <p className="mb-4">
              Airbar provides a platform for connections but is not liable for lost, damaged, or delayed packages. We strongly recommend:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Purchasing additional insurance for valuable items</li>
              <li>Documenting package condition with photos</li>
              <li>Using our dispute resolution process for any issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
            <p className="mb-4">
              We reserve the right to terminate accounts that violate these terms, engage in fraudulent activity, receive multiple valid complaints, or pose risks to our community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes between users should first be addressed through our internal dispute resolution process. If unresolved, disputes will be subject to binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Privacy and Data</h2>
            <p className="mb-4">
              Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification. Continued use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@airbar.com<br />
              Address: Airbar Inc., 123 Market Street, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}