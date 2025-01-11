import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

import { useEffect, useState } from "react";
export const EventCardSkeleton = () => {
  const [randomLength, setRandomLength] = useState(0);

  useEffect(() => {
    setRandomLength(Math.floor(Math.random() * 6) + 2);
  }, []);

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent>
        <h3 className="mb-2">
          <Skeleton className="h-6 w-28" />
        </h3>
        <ul className="flex gap-1 flex-wrap">
          {Array.from({ length: randomLength }).map((_, index) => (
            <li key={index}>
              <Skeleton className="h-8 w-8 rounded-full" />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-32" />
      </CardFooter>
    </Card>
  );
};
