'use client';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: "ri-phone-line",
      title: "Phone",
      info: "+1 (555) 123-4567",
      description: "Monday-Friday 9AM-6PM EST",
      action: "tel:+15551234567"
    },
    {
      icon: "ri-mail-line",
      title: "Email",
      info: "support@herba-store.com",
      description: "We'll respond within 24 hours",
      action: "mailto:support@herba-store.com"
    },
    {
      icon: "ri-chat-3-line",
      title: "Live Chat",
      info: "Available Now",
      description: "Chat with our wellness experts",
      action: "#"
    },
    {
      icon: "ri-map-pin-line",
      title: "Address",
      info: "123 Wellness Way, Natural City, NC 12345",
      description: "Visit our flagship store",
      action: "#"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
      
      <div className="space-y-6 mb-8">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className={`${method.icon} text-white text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{method.title}</h3>
              <p className="text-green-600 font-medium mb-1">{method.info}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            <button className="text-green-600 hover:text-green-700 cursor-pointer">
              <i className="ri-external-link-line"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Business Hours */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <i className="ri-time-line text-green-600 mr-2"></i>
          Business Hours
        </h3>
        <div className="space-y-3">
          {businessHours.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{schedule.day}</span>
              <span className="font-medium text-gray-800">{schedule.hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
          <i className="ri-alarm-warning-line text-red-600 mr-2"></i>
          Emergency Support
        </h3>
        <p className="text-sm text-red-700 mb-3">
          For urgent health-related questions or product safety concerns:
        </p>
        <div className="flex items-center space-x-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Call Emergency Line
          </button>
          <span className="text-red-600 font-medium">+1 (555) 911-HERB</span>
        </div>
      </div>
    </div>
  );
}