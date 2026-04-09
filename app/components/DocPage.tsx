import Link from 'next/link';
import Footer from './Footer';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DocPage({ title, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <main className="flex flex-1 justify-center px-5 py-10">
        <div className="w-full max-w-[1000px]">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-sm text-muted transition-colors duration-100 hover:text-fg"
          >
            <i className="bx bx-chevron-left text-xl" />
            Главная страница
          </Link>
          <h1 className="mb-6 text-2xl text-fg">{title}</h1>
          <div className="text-sm leading-loose text-muted">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
