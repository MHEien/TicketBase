import { Card } from '../../../components/ui/Card';

export function TestimonialsBlock({ title, testimonials }: {
  title: string;
  testimonials: Array<{
    name: string;
    role?: string;
    company?: string;
    content: string;
    avatar?: string;
  }>;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-center">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {(testimonial.role || testimonial.company) && (
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' at '}
                      {testimonial.company}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
