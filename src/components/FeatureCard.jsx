export default function FeatureCard({ icon, title, description, gradient = 'from-accent to-purple' }) {
  return (
    <div className="group relative p-6 bg-bg2 border border-white/10 rounded-card hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 rounded-card bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon */}
      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-5 shadow-lg`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="relative text-base font-semibold text-txt mb-2 tracking-tight">{title}</h3>
      <p className="relative text-sm text-txt2 leading-relaxed">{description}</p>
    </div>
  );
}
