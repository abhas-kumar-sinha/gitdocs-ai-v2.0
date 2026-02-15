import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Gitdocs AI",
  description:
    "Read the Terms of Service governing your use of Gitdocs AI, including user responsibilities, acceptable use, and legal obligations.",
  alternates: {
    canonical: "https://www.gitdocs.cloud/terms",
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
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground font-medium">Last updated: {lastUpdated}</p>
            <div className="mt-8 text-lg leading-relaxed">
              <p>
                Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the Gitdocs AI application and website (the &quot;Service&quot;) operated by Gitdocs AI (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
              </p>
              <p className="mt-4">
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              <p className="mt-4">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Use of the Service</h2>
            <p>Gitdocs AI is an AI-powered tool designed to generate, improve, and manage README.md files and repository documentation. When using our Service, you agree to follow these guidelines:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You will not use the Service for any illegal purposes.</li>
              <li>You will not send spam, duplicate, or unsolicited messages.</li>
              <li>You will not attempt to abuse, reverse-engineer, or exploit the service.</li>
              <li>You will not send or store viruses, malware, or other types of malicious software.</li>
              <li>You will not attempt to gain unauthorized access to any portion or feature of the Service.</li>
              <li>You will not interfere with or disrupt the integrity or performance of the Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. API Keys and Third-Party Services</h2>
            <p>Our Service may allow you to use your own API keys for third-party services or connect third-party accounts (e.g., GitHub). When you provide integrations:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You are responsible for securing your own API keys and account access.</li>
              <li>You must comply with the terms of service of those third-party providers.</li>
              <li>We are not responsible for any charges you may incur from those third-party services.</li>
              <li>We access permitted data solely to provide the service and you may revoke access at any time.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. Accounts</h2>
            <p>When you create an account with us or authenticate via GitHub, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
            <p>You are responsible for safeguarding your credentials and for any activities or actions under your account. You agree not to disclose your access to any third party and must notify us immediately upon becoming aware of any breach of security.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality (excluding user-provided repository data) are and will remain the exclusive property of Gitdocs AI and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
            <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Gitdocs AI.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. User-Generated Content & READMEs</h2>
            <p>Our Service allows you to generate documentation based on your repositories. You are responsible for the content used and generated, including its legality, reliability, and appropriateness.</p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="font-semibold text-foreground mb-2">Ownership of Generated Content:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Content generated specifically for your README files belongs to you.</li>
                <li>You are free to use, modify, and distribute it within your projects.</li>
                <li>By using the service, you grant us a limited license to process this content strictly for the purpose of providing the Service.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms or abuse the service.</p>
            <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account and data deletion.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Limitation of Liability</h2>
            <p>In no event shall Gitdocs AI, nor its directors, employees, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data (including repository data), use, goodwill, or other intangible losses, resulting from:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Your access to or use of or inability to access or use the Service;</li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>Any content obtained from the Service (including AI-generated text accuracy);</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Disclaimer</h2>
            <p>Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
            <p>We make no guarantees regarding the absolute accuracy of generated documentation or the 100% availability of the service.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">10. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Continued use of the service after changes means you accept the updated Terms. If a revision is material, we will try to provide notice prior to any new terms taking effect.</p>
          </section>

          <section className="space-y-6 pt-6 border-t border-border">
            <h2 className="text-2xl font-bold">11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <div className="bg-muted p-6 rounded-xl border border-border inline-block min-w-[300px]">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <a href="mailto:abhas.kumar@gitdocs.cloud" className="text-primary hover:underline font-medium">abhas.kumar@gitdocs.cloud</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <a href="https://www.gitdocs.cloud" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.gitdocs.cloud</a>
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
