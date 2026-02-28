"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const slides = [
    { src: "/images/slide_1_img.jpg", alt: "TNT Lures Reel" },
    { src: "/images/slide_2_img.jpg", alt: "TNT Lures Action" },
    { src: "/images/slide_3_img.jpg", alt: "TNT Lures Product" },
    { src: "/images/slide_4_img.jpg", alt: "TNT Lures Reel Stand" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full"
    >
      {/* 1. Bọc Khung Viền ở ngoài cùng. Dùng overflow-hidden để cắt gọt phần ảnh dư */}
      <div className="w-full rounded-3xl md:rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          opts={{ loop: true }}
          className="w-full group"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              /* 2. Đặt Aspect-Ratio trực tiếp vào Item để nó đẩy form căng phồng lên */
              <CarouselItem 
                key={index} 
                className="pl-0 relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover transition-transform duration-[10s] ease-linear group-hover:scale-105"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Thanh chạy tiến độ (Dots) */}
      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <div key={i} className="h-1 w-6 md:w-8 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div 
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 5 }}
              />
          </div>
        ))}
      </div>
    </motion.div>
  );
}