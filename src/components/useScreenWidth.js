// https://infinum.com/the-capsized-eight/how-to-use-react-hooks-in-class-components
import { useEffect, useState } from "react";

export function useScreenWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = (event: any) => {
      setWidth(event.target.innerWidth);
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return width;
}
