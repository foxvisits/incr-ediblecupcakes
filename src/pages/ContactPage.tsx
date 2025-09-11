import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, Send, Heart, Instagram, Facebook } from 'lucide-react';
import ClientOnly from '../components/ClientOnly';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-16 lg:pt-20">
      <Helmet>
        <title>Contact Sarah - Incr-EdibleCupCakes</title>
        <meta name="description" content="Get in touch with Sarah for custom cupcake orders, baking consultations, or recipe questions. Professional baker available for events and special occasions." />
        <meta name="keywords" content="contact baker, custom cupcakes, baking consultation, recipe questions, cupcake orders" />
        <link rel="canonical" href="https://incr-ediblecupcakes.com/contact" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Sarah - Incr-EdibleCupCakes" />
        <meta property="og:description" content="Get in touch with Sarah for custom cupcake orders, baking consultations, or recipe questions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://incr-ediblecupcakes.com/contact" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Sarah",
            "description": "Get in touch with Sarah for custom cupcake orders, baking consultations, or recipe questions",
            "url": "https://incr-ediblecupcakes.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Incr-EdibleCupCakes",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English"]
              }
            }
          })}
        </script>
      </Helmet>
      <Helmet>
        <title>Contact Sarah - Professional Baker | Incr-EdibleCupCakes</title>
        <meta name="description" content="Get in touch with Sarah for baking questions, recipe help, workshop information, or collaboration opportunities. Professional baker available for consultations and custom recipe development." />
        <meta name="keywords" content="contact baker, baking questions, recipe help, baking workshops, collaboration, custom recipes, professional baker consultation" />
        <link rel="canonical" href="https://incr-ediblecupcakes.com/contact" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Sarah - Professional Baker | Incr-EdibleCupCakes" />
        <meta property="og:description" content="Get in touch with Sarah for baking questions, recipe help, workshop information, or collaboration opportunities." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://incr-ediblecupcakes.com/contact" />
        <meta property="og:image" content="https://incr-ediblecupcakes.com/Sarah.png" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Sarah - Professional Baker | Incr-EdibleCupCakes" />
        <meta name="twitter:description" content="Get in touch with Sarah for baking questions, recipe help, workshop information, or collaboration opportunities." />
        <meta name="twitter:image" content="https://incr-ediblecupcakes.com/Sarah.png" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Incr-EdibleCupCakes",
            "description": "Contact professional baker Sarah for recipe questions, workshops, and collaborations",
            "url": "https://incr-ediblecupcakes.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Incr-EdibleCupCakes",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-123-CAKE",
                "email": "sarah@incr-ediblecupcakes.com",
                "contactType": "customer service",
                "availableLanguage": "English",
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "17:00"
                }
              }
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cupcake-coral via-sunshine-400 to-cupcake-cherry overflow-hidden">
        <div className="absolute inset-0">
          <ClientOnly>
            <>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-random opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3 + i * 0.3}s`,
                }}
              >
                {i % 3 === 0 ? '🧁' : i % 3 === 1 ? '💌' : '📧'}
              </div>
            ))}
            </>
          </ClientOnly>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="font-quicksand text-4xl sm:text-5xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            Let's Create Something
            <span className="block text-sunshine-300 animate-gradient-text">Sweet Together</span>
          </h1>
          <p className="font-nunito text-xl text-pink-100 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
            Have a question about a recipe? Want to collaborate? Or just want to share your baking success? 
            I'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-quicksand text-3xl font-black text-gray-900 mb-6">
                  Get in <span className="text-cupcake-coral">Touch</span>
                </h2>
                <p className="font-nunito text-gray-600 text-lg leading-relaxed">
                  Whether you're a beginner baker or a seasoned pro, I'm here to help you create 
                  incredible cupcakes. Don't hesitate to reach out with questions, suggestions, 
                  or just to share your baking adventures!
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: 'Email',
                    info: 'sarah@incr-ediblecupcakes.com',
                    description: 'Best way to reach me for detailed questions'
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    info: '+1 (555) 123-CAKE',
                    description: 'Available Monday-Friday, 9AM-5PM EST'
                  },
                  {
                    icon: MapPin,
                    title: 'Studio Location',
                    info: 'Portland, Oregon',
                    description: 'By appointment only for workshops'
                  },
                  {
                    icon: Clock,
                    title: 'Response Time',
                    info: 'Within 24 hours',
                    description: 'Usually much faster!'
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-cupcake-coral to-sunshine-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-quicksand font-bold text-gray-900">{contact.title}</h3>
                      <p className="text-cupcake-coral font-medium">{contact.info}</p>
                      <p className="font-nunito text-gray-500 text-sm">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="font-quicksand font-bold text-gray-900 mb-4">Follow My Baking Journey</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, label: '@incrediblecupcakes', href: '#' },
                    { icon: Facebook, label: 'IncrEdibleCupCakes', href: '#' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="font-quicksand flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cupcake-coral to-sunshine-400 text-white rounded-full hover:from-cupcake-cherry hover:to-sunshine-500 transition-all duration-300 transform hover:scale-105 font-bold"
                    >
                      <social.icon className="w-4 h-4" />
                      <span className="text-sm">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-quicksand text-2xl font-black text-gray-900 mb-6">Send Me a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300 font-nunito"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300 font-nunito"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300 font-nunito"
                  >
                    <option value="">Select a topic</option>
                    <option value="recipe-question">Recipe Question</option>
                    <option value="collaboration">Collaboration Inquiry</option>
                    <option value="workshop">Workshop Information</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="media">Media & Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300 resize-none font-nunito"
                    placeholder="Tell me about your baking goals, questions, or just say hello!"
                  />
                </div>

                <button
                  type="submit"
                  className="font-quicksand w-full py-4 bg-gradient-to-r from-cupcake-coral to-sunshine-400 text-white font-bold rounded-lg hover:from-cupcake-cherry hover:to-sunshine-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>

              <div className="mt-6 p-4 bg-cupcake-pink/20 rounded-lg border border-cupcake-coral/30">
                <div className="flex items-center space-x-2 text-cupcake-coral">
                  <Heart className="w-4 h-4" />
                  <span className="font-nunito text-sm font-medium">
                    I read every message personally and aim to respond within 24 hours!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-cupcake-pink/20 to-sunshine-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-quicksand text-3xl font-black text-gray-900 text-center mb-12">
            Frequently Asked <span className="text-cupcake-coral">Questions</span>
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: 'Can I substitute ingredients in your recipes?',
                answer: 'Many substitutions are possible! I include notes in each recipe, but feel free to ask about specific swaps.'
              },
              {
                question: 'Do you offer private baking workshops?',
                answer: 'Yes! I offer both in-person workshops in Portland and virtual sessions worldwide. Contact me for details.'
              },
              {
                question: 'How do you develop your keto and vegan recipes?',
                answer: 'Each recipe goes through extensive testing to ensure it tastes amazing while meeting dietary requirements. I never compromise on flavor!'
              },
              {
                question: 'Can I feature your recipes on my blog?',
                answer: 'I love collaborations! Please reach out to discuss proper attribution and usage guidelines.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-quicksand font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="font-nunito text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;