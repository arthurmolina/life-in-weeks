import { HelmetProvider } from 'react-helmet-async';
import { SEOHead } from '../components/layout';
import { LifeForm } from '../components/form';
import { LifeGrid } from '../components/grid';
import { Footer } from '../components/layout';
import { useAppState } from '../contexts';

export default function HomePage() {
  const { showForm } = useAppState();

  return (
    <HelmetProvider>
      <SEOHead />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* GitHub Ribbon */}
        <a
          href="https://github.com/arthurmolina/life-in-weeks"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-0 left-0 z-50"
          aria-label="View source on GitHub"
        >
          <div className="absolute top-12 -left-12 w-40 bg-black text-white text-center py-1 transform -rotate-45 shadow-lg hover:bg-gray-800 transition-colors">
            <span className="text-xs font-bold tracking-wider">GitHub</span>
          </div>
        </a>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className={`flex flex-col lg:flex-row gap-8 ${!showForm ? 'justify-center' : ''}`}>
            {/* Form Sidebar */}
            {showForm && (
              <aside className="lg:w-1/4">
                <LifeForm />
              </aside>
            )}

            {/* Grid Content */}
            <section className={showForm ? 'lg:w-3/4' : 'w-full'}>
              <LifeGrid />
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
