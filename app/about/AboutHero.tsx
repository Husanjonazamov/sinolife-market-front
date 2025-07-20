'use client';

export default function AboutHero() {
  return (
    <section 
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%20herbal%20company%20headquarters%20with%20modern%20glass%20building%20surrounded%20by%20beautiful%20botanical%20gardens%2C%20corporate%20wellness%20environment%20with%20natural%20elements%2C%20elegant%20architecture%20blended%20with%20organic%20herb%20gardens%2C%20professional%20business%20photography%20with%20natural%20lighting%20and%20green%20landscape%20design&width=1920&height=800&seq=abouthero001&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            For over two decades, HerbaStore has been committed to providing the highest quality 
            herbal products and natural wellness solutions to help people live healthier, more vibrant lives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">20+</div>
              <div className="text-lg">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-lg">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-lg">Premium Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}