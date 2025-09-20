import React from 'react';
import Image from 'next/image';

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="https://media.istockphoto.com/id/2164714606/vector/cartoon-retro-groovy-dollars-stack-funky-character.jpg?s=612x612&w=0&k=20&c=Qh7trW4LHoiP9eNTwMiQgDK5_Zio-r83UNKG97DDRGY="
    alt="Paisa Buddy Logo"
    width={140}
    height={80}
    className={className}
    unoptimized // Add this if your logo is a GIF or has animation, otherwise it can be removed for PNG/JPG.
  />
);
