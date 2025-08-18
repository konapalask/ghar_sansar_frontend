import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

interface ServiceFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  roomType: string;
  budget: string;
  timeline: string;
  message: string;
}

const services = [
  {
    title: 'Wallpaper Rolls',
    price: 'Custom Pricing',
    image: 'https://www.aarceewallpapers.com/wp-content/uploads/2021/04/buy-blue-wallpaper-online.jpg',
    description: 'Beautiful wallpaper rolls to transform your walls.',
    features: ['Premium quality', 'Easy to apply', 'Variety of designs'],
    
  },
  {
    title: '3D Wallpapers',
    price: 'Custom Pricing',
    image: 'https://5.imimg.com/data5/ANDROID/Default/2023/3/SN/HX/RY/127453337/product-jpeg-500x500.jpg',
    description: 'Stunning 3D effect wallpapers for bold interiors.',
    features: ['Depth effect', 'Long-lasting', 'Modern styles'],
  },
  {
    title: 'Wall Art Effect',
    price: 'Custom Pricing',
    image: 'https://www.dekorcompany.com/cdn/shop/products/30_A.jpg?v=1627026001',
    description: 'Unique wall art for statement-making interiors.',
    features: ['Handcrafted', '3D design', 'Customizable'],
  },
  {
    title: 'Vinyl/Wooden Flooring',
    price: 'Custom Pricing',
    image: 'https://media.tarkett-image.com/medium/IN_HP_RR_ICONIK_Powell_Oak_Bronze_landscape.jpg',
    description: 'Durable and stylish flooring for every room.',
    features: ['Easy to maintain', 'Water resistant', 'Wide range'],
  },
  {
    title: 'Natural Vertical Garden',
    price: 'Custom Pricing',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/424733064/YP/ZB/BK/135015145/natural-indoor-vertical-garden.jpg',
    description: 'Live green vertical gardens for fresh ambiance.',
    features: ['Custom layouts', 'Expert installation', 'Low maintenance'],
  },
  {
    title: 'Blinds & Automation',
    price: 'Custom Pricing',
    image: 'https://newcastle-blinds.com/wp-content/uploads/2024/01/1-2.jpg',
    description: 'Blinds and motorized solutions for privacy and style.',
    features: ['Manual & motorized', 'Remote control', 'Smart integration'],
  },
  {
    title: 'Canopy Installation',
    price: 'Custom Pricing',
    image: 'https://www.milwoodgroup.com/wp-content/uploads/2022/06/June-1_03.jpg',
    description: 'High-quality canopies for outdoor and balcony shade.',
    features: ['UV protection', 'Weatherproof', 'Color options'],
  },
  {
    title: 'Ceramic & HDP Planter Pots',
    price: 'Custom Pricing',
    image: 'https://www.ugaoo.com/cdn/shop/files/1_d87323cc-bf70-4799-a66d-7ff965c8cb2b.jpg?v=1709701882&width=1100',
    description: 'Artistic ceramic and HDP planters for all plants.',
    features: ['Indoor & outdoor', 'Modern designs', 'Durable'],
  },
  {
    title: 'Artificial Lawn & Wall Garden',
    price: 'Custom Pricing',
    image: 'https://www.chhajedgarden.com/cdn/shop/products/13_e3abbbeb-217c-4fa1-a2ec-b9ed6e21869b_934x700.jpg?v=1618551829',
    description: 'Realistic artificial turf for gardens and walls.',
    features: ['Pet friendly', 'Low maintenance', 'Lush appearance'],
  },
  {
    title: 'Outdoor Deck Benches',
    price: 'Custom Pricing',
    image: 'https://i.pinimg.com/736x/6a/ce/90/6ace90bc4157be9b11f0199b59e0a56a.jpg',
    description: 'Custom outdoor wooden benches for decks & patios.',
    features: ['Weatherproof finish', 'Beautiful woods', 'Custom sizing'],
  },
  {
    title: 'Customised Water Fountain/Bubble Fountain',
    price: 'Custom Pricing',
    image: 'https://fountains.com/wp-content/uploads/2020/12/unnamed_3.jpg',
    description: 'Mesmerizing water and bubble fountains for serenity.',
    features: ['Indoor/outdoor', 'Lighting options', 'Unique designs'],
  },
  {
    title: 'Pigeon Net & Invisible Grill',
    price: 'Custom Pricing',
    image: 'https://5.imimg.com/data5/SELLER/Default/2025/1/483641672/HL/SM/BM/104295984/pigeon-net-invisible-grill.jpeg',
    description: 'Safety nets and invisible grills for balconies.',
    features: ['Safe for kids/pets', 'Discreet', 'Rustproof'],
  },
  {
    title: 'Sliding & Metal Door',
    price: 'Custom Pricing',
    image: 'https://image.made-in-china.com/2f0j00IqQbuMUrJncp/Good-Price-Interior-Metal-Doors-Kitchen-Sliding-Door-Design-Aluminum-Sliding-Door.webp',
    description: 'Modern sliding and secure metal doors.',
    features: ['Space saving', 'Modern look', 'Robust'],
  },
  {
    title: 'Terrace & Outdoor Gardening',
    price: 'Custom Pricing',
    image: 'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2022/07/01125821/cover_terrace-garden-idea.jpg',
    description: 'Full terrace/landscape and outdoor gardening services.',
    features: ['Customized planting', 'Automated irrigation', 'Expert design'],
  },
  {
    title: 'EPDM & Gym/ICU Flooring',
    price: 'Custom Pricing',
    image: 'https://5.imimg.com/data5/SELLER/Default/2020/8/FI/VH/YZ/22787039/gym-flooring-rubber-flooring-epdm-flooring.jpg',
    description: 'High quality EPDM, gym, and ICU flooring.',
    features: ['Soft underfoot', 'Anti-slip', 'Colorful patterns'],
  },
];

const Services: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>();

  const onSubmit = (data: ServiceFormData) => {
    console.log('Service request:', data);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md mx-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest! Our design team will contact you within 24 hours to discuss your project.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Interior Design Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Transform your space with our professional services. From wall decor to outdoor landscaping, we have you covered.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-44 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-blue-600 font-semibold mb-2">{service.price}</p>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Service Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Request a Consultation</h2>
            <p className="text-xl text-gray-600">
              Ready to transform your space? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email'
                        }
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              {/* Project Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h3>
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    {...register('serviceType', { required: 'Please select a service type' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((s, i) => (
                      <option value={s.title} key={i}>{s.title}</option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>
                  )}
                </div>
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    {...register('roomType', { required: 'Please select a room type' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a room</option>
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="dining-room">Dining Room</option>
                    <option value="home-office">Home Office</option>
                    <option value="balcony">Balcony</option>
                    <option value="multiple">Multiple Rooms/Outdoors</option>
                  </select>
                  {errors.roomType && (
                    <p className="text-red-500 text-sm mt-1">{errors.roomType.message}</p>
                  )}
                </div>
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range *
                  </label>
                  <select
  {...register('budget', { required: 'Please select a budget range' })}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="">Select budget range</option>
  <option value="under-1-lakh">Under ₹1,00,000</option>
  <option value="1-5-lakh">₹1,00,000 - ₹5,00,000</option>
  <option value="5-10-lakh">₹5,00,000 - ₹10,00,000</option>
  <option value="over-10-lakh">Over ₹10,00,000</option>
</select>

                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>
                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      {...register('timeline', { required: 'Please select a timeline' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  {errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us more about your project, style preferences, or any specific requirements..."
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-12 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Submit Request
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
