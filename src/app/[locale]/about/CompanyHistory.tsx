'use client';

export default function CompanyHistory() {
  const milestones = [
    {
      year: "2004",
      title: "The Beginning",
      description: "Founded by herbalist Dr. Sarah Johnson with a mission to make premium herbal medicine accessible to everyone.",
      icon: "ri-seedling-line"
    },
    {
      year: "2008",
      title: "First Expansion",
      description: "Opened our first retail location and launched online store, reaching customers nationwide.",
      icon: "ri-store-line"
    },
    {
      year: "2012",
      title: "Organic Certification",
      description: "Achieved USDA Organic certification and established partnerships with sustainable farms worldwide.",
      icon: "ri-medal-line"
    },
    {
      year: "2016",
      title: "Research Partnership",
      description: "Partnered with leading universities to conduct clinical studies on herbal effectiveness.",
      icon: "ri-flask-line"
    },
    {
      year: "2020",
      title: "Global Reach",
      description: "Expanded internationally and launched our mobile app for personalized wellness recommendations.",
      icon: "ri-global-line"
    },
    {
      year: "2024",
      title: "Innovation Leader",
      description: "Introduced AI-powered wellness matching and became the leading herbal supplement provider.",
      icon: "ri-rocket-line"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Two decades of growth, innovation, and commitment to natural wellness
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-300"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center z-10">
                  <i className={`${milestone.icon} text-white text-xl`}></i>
                </div>
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-2xl font-bold text-green-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}