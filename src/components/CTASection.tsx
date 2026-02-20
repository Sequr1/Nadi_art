import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="opacity-0 animate-fade-in-up">
        <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight mb-8">
          Искусство может быть формой диалога
        </p>
        
        <p className="text-text-secondary text-lg font-light mb-12 max-w-md mx-auto">
          Если что-то откликнулось — продолжим вместе
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 btn-primary text-lg"
        >
          <span>Продолжить</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
