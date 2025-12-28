import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Gitdocs AI",
  description:
    "Learn how Gitdocs AI collects, uses, stores, and protects your personal data when you use our services.",
  alternates: {
    canonical: "https://www.gitdocs.space/privacy",
  },
  robots: {
  index: true,
  follow: true,
},
};


const LandingPage = () => {
  
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <>
      <Navbar />

      <main className="container mx-auto px-6 py-32 max-w-4xl">
        <div className="space-y-10 text-foreground">
          <section className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground font-medium">Last updated: {lastUpdated}</p>
            <div className="mt-8 text-lg leading-relaxed">
              <p>
                Gitdocs AI (“Gitdocs AI”, “we”, “our”, or “us”) respects your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Gitdocs AI when you use our website and services.
              </p>
              <p className="mt-4">
                By using Gitdocs AI, you agree to the practices described in this policy.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">1. Introduction</h2>
            <p className="leading-relaxed">
              Gitdocs AI respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">a. Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Email address</li>
                  <li>Name or username</li>
                  <li>Authentication details (via GitHub or other providers)</li>
                  <li>Repository metadata you choose to connect</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">b. Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>IP address</li>
                  <li>Device and browser information</li>
                  <li>Usage data (pages visited, actions taken)</li>
                </ul>
                <p className="mt-2 italic text-sm">This data is used only to operate and improve the service.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. GitHub & Repository Data</h2>
            <p>When you connect a GitHub account:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>We access only the repositories you explicitly authorize</li>
              <li>We read repository structure and files for README generation</li>
              <li>We do not modify repositories without your explicit action</li>
              <li>We do not sell, rent, or share repository data with third parties.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. How We Use Your Information</h2>
            <p>We use your information for various purposes, including to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Authenticate users securely</li>
              <li>Generate and improve README files and documentation</li>
              <li>Improve product performance and reliability</li>
              <li>Communicate important service updates, technical notices, and support messages</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Data Storage & Security</h2>
            <p>We take reasonable measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Secure authentication methods and protocols</li>
              <li>Restricted access to user data for authorized personnel only</li>
              <li>Encrypted communication (SSL/TLS) where applicable</li>
            </ul>
            <p className="italic mt-2">However, no system is 100% secure. Use the service at your own risk.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Third-Party Services</h2>
            <p>Gitdocs AI may rely on third-party services for:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Authentication (e.g., GitHub OAuth)</li>
              <li>Hosting and infrastructure (e.g., Vercel, AWS)</li>
              <li>Email delivery services</li>
            </ul>
            <p>These services are used strictly to operate Gitdocs AI and are bound by their own respective privacy policies.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Cookies</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Maintain user sessions and authentication</li>
              <li>Improve and personalize user experience</li>
            </ul>
            <p>You can instruct your browser to refuse all cookies, but some features may not function correctly if you do so.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>The right to access, update, or delete the information we have on you</li>
              <li>The right of rectification (to correct inaccurate data)</li>
              <li>The right to object to our processing of your personal data</li>
              <li>The right of restriction (to request that we restrict processing)</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this page.</p>
          </section>

          <section className="space-y-6 pt-6 border-t border-border">
            <h2 className="text-2xl font-bold">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <div className="bg-muted p-6 rounded-xl border border-border inline-block min-w-[300px]">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <a href="mailto:abhas.kumar@gitdocs.space" className="text-primary hover:underline font-medium">abhas.kumar@gitdocs.space</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <a href="https://www.gitdocs.space" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.gitdocs.space</a>
                </div>
              </div>
              <p className="mt-6 font-bold text-foreground">Gitdocs AI</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};
export default LandingPage;
