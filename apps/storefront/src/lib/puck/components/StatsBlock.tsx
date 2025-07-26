export function StatsBlock({ title, stats }: {
  title: string;
  stats: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-gray-600">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
