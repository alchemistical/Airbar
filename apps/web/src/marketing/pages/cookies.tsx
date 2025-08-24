import Layout from "../components/Layout";

export default function Cookies() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
            <p className="mb-4">Required for the website to function properly.</p>
            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cookie Name</th>
                  <th className="text-left p-2">Purpose</th>
                  <th className="text-left p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">auth_token</td>
                  <td className="p-2">User authentication</td>
                  <td className="p-2">Session</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">csrf_token</td>
                  <td className="p-2">Security protection</td>
                  <td className="p-2">Session</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">user_intent</td>
                  <td className="p-2">Remember user role preference</td>
                  <td className="p-2">30 days</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
            <p className="mb-4">Help us understand how visitors interact with our website.</p>
            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cookie Name</th>
                  <th className="text-left p-2">Purpose</th>
                  <th className="text-left p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">_ga</td>
                  <td className="p-2">Google Analytics tracking</td>
                  <td className="p-2">2 years</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">_gid</td>
                  <td className="p-2">Google Analytics tracking</td>
                  <td className="p-2">24 hours</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold mb-2">Functional Cookies</h3>
            <p className="mb-4">Enable personalized features and remember your preferences.</p>
            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cookie Name</th>
                  <th className="text-left p-2">Purpose</th>
                  <th className="text-left p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">language</td>
                  <td className="p-2">Language preference</td>
                  <td className="p-2">1 year</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">currency</td>
                  <td className="p-2">Currency preference</td>
                  <td className="p-2">1 year</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              We work with trusted third parties who may set cookies on your device:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
              <li><strong>Google Analytics:</strong> Website usage analysis</li>
              <li><strong>Cloudflare:</strong> Security and performance optimization</li>
              <li><strong>Intercom:</strong> Customer support chat</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
            <p className="mb-4">
              You have several options for managing cookies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings menu</li>
              <li><strong>Cookie Banner:</strong> Use our cookie consent banner to accept or reject non-essential cookies</li>
              <li><strong>Opt-Out Links:</strong> Use the opt-out links provided by our analytics partners</li>
            </ul>
            <p className="mb-4">
              Note: Blocking essential cookies may prevent you from using certain features of our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookie Settings by Browser</h2>
            <p className="mb-4">Here's how to manage cookies in popular browsers:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-primary hover:underline">Safari</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-primary hover:underline">Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" className="text-primary hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@airbar.com<br />
              Address: Airbar Inc., 123 Market Street, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}