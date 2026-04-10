'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from './components/Footer';
import ServerCard from './components/ServerCard';
import servers from '../servers.json';

export default function Home() {
  return (
    <div className='flex flex-col bg-bg'>
      {/* Hero */}
      <main className='flex flex-1 items-center justify-center min-h-screen px-5 py-10'>
        <div className='w-full max-w-[700px]'>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='mb-7 text-center'
          >
            <Image
              src='/logo.png'
              alt='OFFmine'
              width={420}
              height={220}
              style={{ width: 'auto', height: 'auto' }}
              className='mx-auto'
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className='mb-9 text-center leading-8 text-fg'
            style={{ fontSize: 'clamp(20px, 4vw, 30px)' }}
          >
            Проект призванный подарить вам контент!
          </motion.h1>

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
