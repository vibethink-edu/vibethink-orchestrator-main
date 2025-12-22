"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Card, CardContent } from "@vibethink/ui/components/card";

export default function ProductImageGallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const images = [
    `/assets/images/products/01.jpeg`,
    `/assets/images/products/02.jpeg`,
    `/assets/images/products/03.jpeg`,
    `/assets/images/products/04.jpeg`,
    `/assets/images/products/05.jpeg`,
    `/assets/images/products/06.jpeg`
  ];

  return (
    <div className="sticky top-20 space-y-4">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "var(--primary)",
            "--swiper-pagination-color": "var(--primary)"
          } as React.CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2">
        {images.map((image, key) => (
          <SwiperSlide key={key}>
            <Image
              src={image}
              className="aspect-3/2 w-full rounded-lg object-contain lg:aspect-square"
              width={300}
              height={300}
              alt="Product image"
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-2">
        {images.map((image, key) => (
          <SwiperSlide key={key} className="group">
            <figure className="group-[.swiper-slide-thumb-active]:border-primary overflow-hidden rounded-lg border opacity-70 group-[.swiper-slide-thumb-active]:opacity-100!">
              <Image
                className="aspect-square w-full object-contain"
                src={image}
                width={300}
                height={300}
                alt="Product thumbnail"
                unoptimized
              />
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}








