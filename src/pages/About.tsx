import React from "react";
import {
  CheckCircleIcon,
  CpuChipIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const About: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Empowering Trust Through Digital Certificates
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            The <strong>XDC Blockchain Certificate System</strong> provides a
            secure, transparent, and verifiable way to issue and manage digital
            credentials.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-2xl overflow-hidden p-8 md:p-12 mt-16">
            {/* Text Content */}
            <div className="md:w-1/2 md:pr-10 mb-8 md:mb-0">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                What We Do
              </h2>
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
                We harness the{" "}
                <span className="font-semibold text-blue-600">
                  immutability
                </span>{" "}
                and
                <span className="font-semibold text-blue-600">
                  {" "}
                  transparency
                </span>{" "}
                of the XDC Network to revolutionize certificate issuance and
                verification. By anchoring credentials on the blockchain, we
                ensure they are
                <span className="font-semibold text-green-600">
                  {" "}
                  tamper-proof
                </span>{" "}
                and
                <span className="font-semibold text-green-600">
                  {" "}
                  globally verifiable
                </span>{" "}
                — instantly.
              </p>
            </div>

            {/* Image Content */}
            <div className="md:w-1/2 flex justify-center items-center">
              <img
                src="https://i.pinimg.com/736x/ae/13/28/ae1328e595575928c994009a083b8bb4.jpg"
                alt="Blockchain Certificate Illustration"
                className="w-full h-auto max-h-[400px] rounded-xl object-cover shadow-lg"
              />
            </div>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 mt-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
              Key Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  title: "Secure Issuance",
                  description:
                    "Issue certificates with confidence, secured by blockchain technology.",
                  icon: (
                    <CheckCircleIcon className="h-14 w-14 text-green-600 mb-4" />
                  ),
                },
                {
                  title: "Authenticity Verified",
                  description:
                    "Easily verify the genuineness of any certificate on the network.",
                  icon: (
                    <ShieldCheckIcon className="h-14 w-14 text-blue-600 mb-4" />
                  ),
                },
                {
                  title: "Admin Control",
                  description:
                    "Comprehensive tools for administrators to manage the system.",
                  icon: (
                    <ServerIcon className="h-14 w-14 text-purple-600 mb-4" />
                  ),
                },
                {
                  title: "User Accessibility",
                  description:
                    "Simple and intuitive interface for certificate recipients.",
                  icon: (
                    <CpuChipIcon className="h-14 w-14 text-yellow-600 mb-4" />
                  ),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 hover:scale-105 transition-transform duration-300"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden p-8 md:p-12 text-center mt-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Technology Powering Our System
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Our platform is built on the robust and scalable&nbsp;
              <span className="font-semibold text-blue-600">MERN stack</span>
              &nbsp;(MongoDB, Express.js, React, Node.js), seamlessly integrated
              with the&nbsp;
              <span className="font-semibold text-blue-600">
                XDC Apothem Testnet
              </span>
              &nbsp;to ensure secure, reliable, and transparent blockchain
              operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
