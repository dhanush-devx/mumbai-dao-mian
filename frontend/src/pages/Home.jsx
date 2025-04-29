import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useAuth();
  
  // Create refs for animation targets
  const heroRef = useRef(null);
  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const benefitsRef = useRef(null);
  const eventsRef = useRef(null);
  const testimonialRef = useRef(null);

  // Set up animations when component mounts
  useEffect(() => {
    // Hero section animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline.fromTo(
      taglineRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    ).fromTo(
      headingRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.3" // Slight overlap
    ).fromTo(
      subheadingRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    ).fromTo(
      descriptionRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    ).fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Benefits cards animations with ScrollTrigger
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          y: 50,
          opacity: 0 
        },
        { 
          y: 0,
          opacity: 1, 
          duration: 0.6,
          delay: index * 0.1, // Stagger the animations
          ease: "power2.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Event cards animations with ScrollTrigger
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          x: index % 2 === 0 ? -50 : 50, // Alternate directions
          opacity: 0 
        },
        { 
          x: 0,
          opacity: 1, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: eventsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Testimonials animations with ScrollTrigger
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach((testimonial, index) => {
      gsap.fromTo(
        testimonial,
        { 
          scale: 0.9,
          opacity: 0 
        },
        { 
          scale: 1,
          opacity: 1, 
          duration: 0.7,
          delay: index * 0.15, // Stagger the animations
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Clean up animations when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero section with animated text and background */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <span ref={taglineRef} className="inline-block px-4 py-1 mb-6 rounded-full bg-indigo-900 bg-opacity-30 text-indigo-100 text-sm font-medium backdrop-blur-sm">
            Web3 Community of Mumbai
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
            <span ref={headingRef} className="block">Mumbai DAO</span>
            <span ref={subheadingRef} className="block text-indigo-200 text-4xl sm:text-5xl mt-2">Decentralizing the Future Together</span>
          </h1>
          <p ref={descriptionRef} className="mt-6 text-xl text-indigo-100 max-w-3xl leading-relaxed">
            Join the premier community of Web3 pioneers, blockchain developers, and crypto enthusiasts 
            building the decentralized future in Mumbai and beyond.
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              Connect Wallet
            </Link>
            <a
              href="#what-is-mumbai-dao"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* What is Mumbai DAO section with illustration */}
      <div id="what-is-mumbai-dao" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Mission</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What is Mumbai DAO?
              </p>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Mumbai DAO is a decentralized autonomous organization focused on fostering Web3 innovation
                and adoption in Mumbai, India's financial capital. We bring together developers, entrepreneurs,
                and enthusiasts passionate about blockchain technology.
              </p>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Our community-driven platform enables members to connect, collaborate on projects, vote on
                proposals, and earn rewards for their contributions. We're building the foundation for Mumbai's
                emergence as a global Web3 hub.
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Community Driven</h3>
                    <p className="mt-1 text-md text-gray-500">
                      Governed by members through democratic voting and transparent processes
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Innovation Focused</h3>
                    <p className="mt-1 text-md text-gray-500">
                      Building the next generation of Web3 applications and infrastructure
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:ml-10">
              <div className="aspect-w-5 aspect-h-4">
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-100 to-indigo-100 p-8 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#6366F1" d="M45.2,-66.7C58.2,-58.3,68.3,-44.6,76.2,-28.9C84,-13.1,89.5,4.6,85.1,19C80.7,33.5,66.4,44.7,51.9,54.5C37.4,64.3,22.7,72.6,5.8,75.1C-11.2,77.6,-30.4,74.2,-44.2,64.3C-57.9,54.4,-66.2,38,-72.3,20.4C-78.4,2.9,-82.4,-15.8,-77.9,-33.1C-73.5,-50.3,-60.8,-66.1,-45,-75C-29.2,-84,-14.6,-86,-0.3,-85.6C14.1,-85.2,32.1,-75.1,45.2,-66.7Z" transform="translate(100 100)" />
                    <text x="70" y="115" className="text-white text-2xl font-bold">Mumbai DAO</text>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-36 h-36 bg-white bg-opacity-30 rounded-full backdrop-blur-md border border-white border-opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Mumbai DAO section with cards */}
      <div ref={benefitsRef} className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Benefits</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Why Join Mumbai DAO?
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Experience the advantages of being part of an innovative Web3 community
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Benefit Card 1 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Vibrant Community</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Connect with like-minded individuals passionate about blockchain technology. Share ideas, get feedback,
                      and collaborate on innovative projects with experts and enthusiasts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit Card 2 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Token Rewards</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Earn points and recognition for your contributions to the community. Climb the 
                      leaderboard and gain reputation within the ecosystem while building your portfolio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit Card 3 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Exclusive Access</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get early access to events, workshops, hackathons, and funding opportunities. 
                      Network with industry leaders and participate in exclusive governance decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit Card 4 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Learning Resources</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Access educational resources, tutorials, and mentorship from experienced developers 
                      and entrepreneurs in the blockchain space to accelerate your Web3 journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit Card 5 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 001 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Governance Participation</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Have your say in the direction of the DAO by participating in proposals and voting on 
                      key decisions. Help shape the future of Web3 in Mumbai.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit Card 6 */}
              <div className="benefit-card pt-6 transform transition duration-500 hover:scale-105">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8 h-full border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Networking Opportunities</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Build valuable connections with founders, investors, and developers at our regular 
                      meetups and events, opening doors to career and business opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events section */}
      <div ref={eventsRef} className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Events</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Upcoming Meetups & Hackathons
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Join us at these exciting events to learn, build, and connect with the Mumbai DAO community
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
            {/* Event Card 1 */}
            <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-48 w-full bg-gradient-to-r from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                <div className="text-center">
                  <div className="text-4xl">18</div>
                  <div className="uppercase tracking-wide">June</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600 text-sm">Digital Innovation Hub, Mumbai</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">Web3 Developers Meetup</h3>
                <p className="mt-2 text-gray-600">
                  Join fellow developers for a day of Web3 talks, demos, and networking. Learn about the latest in blockchain development.
                </p>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Register Now
                  </a>
                </div>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                <div className="text-center">
                  <div className="text-4xl">25</div>
                  <div className="uppercase tracking-wide">July</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600 text-sm">Tech Park Convention Center, Mumbai</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">Mumbai Web3 Hackathon</h3>
                <p className="mt-2 text-gray-600">
                  A 48-hour hackathon to build innovative DApps. ₹5 lakh in prizes and potential funding for winning projects!
                </p>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Apply to Hack
                  </a>
                </div>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-48 w-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                <div className="text-center">
                  <div className="text-4xl">10</div>
                  <div className="uppercase tracking-wide">August</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600 text-sm">Virtual Event</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">DeFi Workshop Series</h3>
                <p className="mt-2 text-gray-600">
                  Learn about decentralized finance protocols, yield farming strategies, and building DeFi applications.
                </p>
                <div className="mt-6">
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Reserve Spot
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50">
              View All Events
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Join the community CTA section */}
      <div className="relative bg-gradient-to-r from-indigo-800 to-purple-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/src/assets/circuit-pattern.svg')] opacity-30"></div>
        </div>
        <div className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to be part of Mumbai DAO?</span>
            <span className="block">Join our community today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Connect your wallet, participate in governance, and help build the decentralized future of Mumbai.
          </p>
          <Link
            to="/login"
            className="mt-8 w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg sm:w-auto"
          >
            Connect Wallet
          </Link>
          <a
            href="https://discord.gg/mumbaidao"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-8 sm:ml-4 w-full inline-flex items-center justify-center px-6 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 sm:w-auto"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
            </svg>
            Join Discord
          </a>
        </div>
      </div>

      {/* Testimonial section */}
      <div ref={testimonialRef} className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-10 text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hear from our community
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="testimonial bg-gray-50 rounded-xl p-8 border border-gray-200 transform transition duration-500 hover:shadow-lg">
              <div className="relative text-lg font-medium text-gray-700">
                <svg className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-gray-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative pl-6">Joining Mumbai DAO has connected me with an incredible network of blockchain enthusiasts and developers. The community is supportive, and the points system keeps me engaged.</p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    AB
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Alex Blockchain</p>
                  <p className="text-sm text-indigo-600">Early Member</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial bg-gray-50 rounded-xl p-8 border border-gray-200 transform transition duration-500 hover:shadow-lg">
              <div className="relative text-lg font-medium text-gray-700">
                <svg className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-gray-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative pl-6">The leaderboard feature creates healthy competition and recognition for contributions. I've learned so much about Web3 technology since joining Mumbai DAO.</p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    SD
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Sarah Decentralized</p>
                  <p className="text-sm text-indigo-600">Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial bg-gray-50 rounded-xl p-8 border border-gray-200 transform transition duration-500 hover:shadow-lg">
              <div className="relative text-lg font-medium text-gray-700">
                <svg className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-gray-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative pl-6">Mumbai DAO provided me with the platform to voice my ideas and participate in meaningful governance decisions. It's exciting to be part of shaping the future of Web3.</p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    RN
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Raj NFT</p>
                  <p className="text-sm text-indigo-600">Governance Participant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;