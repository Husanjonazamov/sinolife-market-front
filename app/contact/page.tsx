'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import LocationMap from './LocationMap';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-24 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20customer%20service%20office%20with%20friendly%20representatives%20helping%20customers%2C%20professional%20business%20environment%20with%20natural%20elements%20and%20plants%2C%20welcoming%20reception%20area%20with%20warm%20lighting%20and%20comfortable%20seating%2C%20corporate%20wellness%20theme%20with%20herbal%20decorations&width=1920&height=600&seq=contacthero001&orientation=landscape')`
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We're here to help you on your wellness journey. Get in touch with our expert team.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>

        {/* Location & Map */}
        <LocationMap />

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Quick answers to common questions</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "What are your business hours?",
                  answer: "Our customer service team is available Monday-Friday 9AM-6PM EST, and Saturday 10AM-4PM EST. Online orders can be placed 24/7."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Please check our shipping page for details."
                },
                {
                  question: "Are your products third-party tested?",
                  answer: "Absolutely! All our products undergo rigorous third-party testing for purity, potency, and safety. We provide certificates of analysis upon request."
                },
                {
                  question: "Can I return products if I'm not satisfied?",
                  answer: "Yes, we offer a 30-day satisfaction guarantee. If you're not completely satisfied, you can return unopened products for a full refund."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}