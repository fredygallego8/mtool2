import { PageList } from '@/components/page-list';
import { ThemeConfig } from '@/components/theme-config';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-[90%]">
      <div className="fixed top-4 right-4">
        <ThemeConfig />
      </div>
      <PageList />
    </main>
  );
}