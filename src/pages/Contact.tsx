import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";


const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // console.log('Contact message sent successfully!');
        alert('Your message has been sent successfully!'); // Or show a more styled success message
        setFormData({ name: '', email: '', message: '', }); // Reset form
      } else {
        const errorData = await response.json();
        console.error('Error sending contact message:', errorData);
        alert(`Failed to send message: ${errorData.message || 'Unknown error'}`); // Show error message
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      alert('An error occurred while sending your message.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Contact Us
      </h1>

      <div className="bg-white shadow-2xl rounded-xl p-8 space-y-6">
        <p className="text-gray-700 text-lg leading-relaxed text-center">
          Have questions or feedback? Reach out to us through the contact
          information below or fill out the form to get in touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-800">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">📧 Email</h2>
              <p className="text-gray-700">info@example.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">📞 Phone</h2>
              <p className="text-gray-700">+1 (123) 456-7890</p>
            </div>
          </div>

          {/* Optional Contact Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
        
        {/* Additional CTAs */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-lg font-semibold text-gray-900">Prefer other ways to connect?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:info@example.com" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition no-underline">
              Email Us Directly
            </a>
            {/* You can add a call link if applicable */}
            {/* <a href="tel:+11234567890" className="inline-block bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition no-underline">
              Call Us
            </a> */}
             <a href="/about" className="inline-block bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition no-underline">
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
