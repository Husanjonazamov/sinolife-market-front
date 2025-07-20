'use client';

export default function LocationMap() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Store</h2>
          <p className="text-lg text-gray-600">
            Come see our products in person and consult with our wellness experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="relative">
            <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059728!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNSJX!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HerbaStore Location"
              ></iframe>
            </div>
          </div>

          {/* Store Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Store Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-map-pin-line text-green-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">HerbaStore Flagship</p>
                    <p className="text-gray-600">123 Wellness Way<br />Natural City, NC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="ri-phone-line text-green-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">Store Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <i className="ri-car-line text-green-600 text-xl mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">Parking</p>
                    <p className="text-gray-600">Free parking available<br />Street and garage options</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Features */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Find</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Product Consultations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Wellness Seminars</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Product Testing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Expert Herbalists</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Custom Blends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span className="text-sm text-gray-700">Same-Day Pickup</span>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center">
              <i className="ri-navigation-line mr-2"></i>
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}