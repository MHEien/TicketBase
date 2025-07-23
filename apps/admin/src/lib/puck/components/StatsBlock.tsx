export function StatsBlock({ 
  stats 
}: {
  stats: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-muted-foreground">
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
