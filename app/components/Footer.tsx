import Link from 'next/link';

const links = [
  { label: 'Договор-оферта', href: '/dogovor' },
  { label: 'Политика конфиденциальности', href: '/privacy-policy' },
  { label: 'Оплата и безопасность', href: '/payment-security' },
  { label: 'kotyan31tv@gmail.com', href: 'mailto:kotyan31tv@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="flex justify-center border-t border-border px-5 py-6">
      <div className="w-full max-w-[1000px]">
        <strong className="mb-3 block text-sm text-fg">OFFmine</strong>
        <p className="mb-3 text-xs leading-loose text-muted">
          Copyright © OFFmine, Kotyan31 2025. Все права защищены.
          <br />
          Сервера OFFmine не относятся к Mojang Studios
          <br />
          Самозанятый Краснов Константин Максимович (ИНН 507561689400)
        </p>
        <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className="text-xs text-muted transition-colors duration-100 hover:text-fg">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
