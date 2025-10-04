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
          className="github-fork-ribbon left-top"
          href="https://github.com/arthurmolina/life-in-weeks"
          data-ribbon="Fork me on GitHub"
          title="Fork me on GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fork me on GitHub
        </a>
        <style>{`
          .github-fork-ribbon:before {
            background-color: #c00;
          }
        `}</style>
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
