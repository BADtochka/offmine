import fs from 'fs/promises';
import { connection } from 'next/server';
import path from 'path';
import Footer from './components/Footer';
import HeroIntro from './components/HeroIntro';
import ServerCard from './components/ServerCard';
import type { Server } from './types/server';

async function getServers(): Promise<Server[]> {
  await connection();

  const filePath = path.join(process.cwd(), 'servers.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as Server[];
}

export default async function Home() {
  const servers = await getServers();

  return (
    <div className='flex flex-col bg-bg'>
      {/* Hero */}
      <main className='flex flex-1 items-center justify-center min-h-screen px-5 py-10'>
        <div className='w-full max-w-[700px]'>
          <HeroIntro />

          {/* Server cards */}
          <div className='flex flex-col gap-3.5'>
            {servers.map((s, i) => (
              <ServerCard key={s.ip} ip={s.ip} label={s.label} mirrors={s.mirrors} delay={0.35 + i * 0.1} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
