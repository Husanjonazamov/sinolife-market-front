'use client';

import Image from 'next/image';

export default function TeamSection() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Chief Herbalist",
      bio: "With over 25 years of experience in herbal medicine, Dr. Johnson leads our product development and quality assurance.",
      image: "https://readdy.ai/api/search-image?query=Professional%20female%20herbalist%20doctor%20in%20white%20coat%20with%20botanical%20background%2C%20confident%20middle-aged%20woman%20with%20warm%20smile%20in%20medical%20wellness%20setting%2C%20professional%20headshot%20photography%20with%20natural%20herbs%20and%20plants%20behind&width=400&height=400&seq=team001&orientation=squarish",
      linkedin: "#"
    },
    {
      name: "Michael Chen",
      role: "Head of Research",
      bio: "PhD in Pharmacognosy, Michael oversees our clinical research programs and scientific collaborations.",
      image: "https://readdy.ai/api/search-image?query=Professional%20Asian%20male%20scientist%20in%20laboratory%20coat%20with%20research%20equipment%20background%2C%20confident%20researcher%20with%20gentle%20expression%20in%20modern%20scientific%20facility%2C%20professional%20headshot%20with%20botanical%20research%20elements&width=400&height=400&seq=team002&orientation=squarish",
      linkedin: "#"
    },
    {
      name: "Emma Rodriguez",
      role: "Quality Director",
      bio: "Former FDA inspector with 15 years in supplement quality control, ensuring every product meets our high standards.",
      image: "https://readdy.ai/api/search-image?query=Professional%20Hispanic%20female%20quality%20control%20director%20in%20clean%20laboratory%20environment%2C%20confident%20woman%20with%20professional%20attire%20in%20pharmaceutical%20setting%2C%20expert%20headshot%20with%20quality%20testing%20equipment%20background&width=400&height=400&seq=team003&orientation=squarish",
      linkedin: "#"
    },
    {
      name: "Dr. James Wilson",
      role: "Clinical Advisor",
      bio: "Integrative medicine physician specializing in botanical therapeutics and patient wellness protocols.",
      image: "https://readdy.ai/api/search-image?query=Professional%20male%20doctor%20with%20grey%20beard%20in%20medical%20office%20with%20natural%20wellness%20elements%2C%20experienced%20physician%20with%20kind%20expression%20in%20integrative%20medicine%20clinic%2C%20professional%20portrait%20with%20herbal%20medicine%20books&width=400&height=400&seq=team004&orientation=squarish",
      linkedin: "#"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our passionate team of experts dedicated to your wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative w-full h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  className="rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                <div className="text-green-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                
                <div className="flex space-x-3">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                    <i className="ri-linkedin-fill text-white text-sm"></i>
                  </a>
                  <button className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                    <i className="ri-mail-line text-white text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
