import { useState, useCallback, useRef, useEffect } from 'react';
import { Slide, SlideImage, SlideVideo } from 'yet-another-react-lightbox';

// ----------------------------------------------------------------------

type ReturnType = {
  open: boolean;
  selected: number;
  onClose: VoidFunction;
  onOpen: (slideUrl: string) => void;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
};

export default function useLightBox(slides: Slide[]): ReturnType {
  const [selected, setSelected] = useState(-1);

  // ref để luôn có slides mới nhất (không bị "đóng băng")
  const slidesRef = useRef<Slide[]>(slides);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  const handleOpen = useCallback((slideUrl: string) => {
    const slideIndex = slidesRef.current.findIndex((slide) =>
      slide.type === 'video'
        ? (slide as SlideVideo).poster === slideUrl
        : (slide as SlideImage).src === slideUrl
    );

    setSelected(slideIndex >= 0 ? slideIndex : 0);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(-1);
  }, []);

  return {
    selected,
    open: selected >= 0,
    onOpen: handleOpen,
    onClose: handleClose,
    setSelected,
  };
}
