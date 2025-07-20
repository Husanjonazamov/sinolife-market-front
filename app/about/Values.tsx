'use client';

export default function Values() {
  const values = [
    {
      icon: "ri-leaf-line",
      title: "100% Natural",
      description: "We source only the finest organic and wildcrafted herbs from trusted suppliers around the world.",
      image: "https://readdy.ai/api/search-image?query=Organic%20herb%20farming%20with%20farmers%20harvesting%20fresh%20medicinal%20plants%20in%20sustainable%20agricultural%20setting%2C%20natural%20organic%20cultivation%20methods%20with%20green%20fields%20and%20traditional%20farming%20tools%2C%20professional%20agricultural%20photography%20with%20natural%20sunlight&width=400&height=300&seq=val001&orientation=landscape"
    },
    {
      icon: "ri-microscope-line",
      title: "Science-Backed",
      description: "Every product is formulated based on traditional wisdom combined with modern scientific research.",
      image: "https://readdy.ai/api/search-image?query=Modern%20herbal%20research%20laboratory%20with%20scientists%20testing%20plant%20extracts%20and%20natural%20compounds%2C%20professional%20scientific%20equipment%20for%20botanical%20analysis%2C%20clean%20laboratory%20environment%20with%20medicinal%20plants%20and%20testing%20apparatus&width=400&height=300&seq=val002&orientation=landscape"
    },
    {
      icon: "ri-award-line",
      title: "Quality Assured",
      description: "Rigorous third-party testing ensures purity, potency, and safety in every bottle.",
      image: "https://readdy.ai/api/search-image?query=Quality%20control%20laboratory%20with%20herbal%20supplement%20testing%20equipment%20and%20certification%20processes%2C%20professional%20pharmaceutical%20grade%20facility%20with%20quality%20assurance%20protocols%2C%20clean%20testing%20environment%20with%20supplement%20bottles&width=400&height=300&seq=val003&orientation=landscape"
    },
    {
      icon: "ri-earth-line",
      title: "Sustainability",
      description: "We're committed to ethical sourcing and environmental responsibility in all our practices.",
      image: "https://readdy.ai/api/search-image?query=Sustainable%20herb%20cultivation%20with%20eco-friendly%20farming%20practices%20and%20renewable%20energy%20systems%2C%20environmental%20conservation%20in%20botanical%20agriculture%2C%20green%20sustainable%20farming%20methods%20with%20solar%20panels%20and%20organic%20gardens&width=400&height=300&seq=val004&orientation=landscape"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide everything we do, from sourcing to delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {values.map((value, index) => (
            <div key={index} className="group">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-64 object-cover object-top rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <i className={`${value.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}