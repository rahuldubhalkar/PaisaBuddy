import React from 'react';
import Image from 'next/image';

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="/logo.png"
    alt="Paisa Buddy Logo"
    width={40}
    height={40}
    className={className}
    unoptimized // Add this if your logo is a GIF or has animation, otherwise it can be removed for PNG/JPG.
  />
);
