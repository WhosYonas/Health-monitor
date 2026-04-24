import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const features = [
  {
    title: "Real-Time Vitals",
    image: "/time.png",
  },
  {
    title: "Instant Alerts",
    image: "/alerts.png",
  },
  {
    title: "Caregiver Dashboard",
    image: "/dashboard.png",
  },
  {
    title: "Health Trends",
    image: "/trends.png",
  },
];

export function CarouselSlide() {
  return (
    <div className="flex h-fit w-full justify-center px-10">
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-2">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent
                    className="relative flex h-[400px] items-center justify-center bg-cover bg-center bg-no-repeat p-6"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/0" />

                    <span className="relative z-10 text-center text-3xl font-semibold text-white text-shadow-lg"
                    style={{
                        textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                    }}
                    >
                      {feature.title}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
