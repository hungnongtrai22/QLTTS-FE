// @mui
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import { useCallback, useState } from 'react';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { t } from 'i18next';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  avatarUrl: string;
  bookedAt: Date | string | number;
  duration: string;
  guests: string;
  coverUrl: string;
  price: number;
  isHot: boolean;
};

interface Props extends BoxProps {
  title?: string;
  subheader?: string;
  list: any[];
}

const changDateJP = (date: any) => {
  const jsDate = new Date(date);
  const formatted = jsDate.toLocaleDateString('ja-JP');
  const parts = formatted.split('/');
  const customFormat = `${parts[0]}年${parts[1]}月${parts[2]}日`;
  return customFormat;
};

export default function BookingNewest({ title, subheader, list, sx, ...other }: Props) {
  const theme = useTheme();

  console.log('list', list);

  const slidesToShow = 4; // Nên định nghĩa một biến để dễ quản lý
  const [imagesSelect, setImagesSelect] = useState([]);
  const [slides, setSlides] = useState<any[]>([]);
  const lightbox = useLightBox(slides);
  console.log("imagesSelect", imagesSelect);

  const handleChangeImagesSelect = useCallback((images : any)=>{
    setImagesSelect(images);
    // Tạo slides trực tiếp từ image đang click
                const newSlides = images.map((url: string) =>
                  url.includes('/video/')
                    ? {
                        type: 'video' as const,
                        sources: [{ src: url, type: 'video/mp4' }],
                        poster: url,
                        src: url,
                        width: 1280,
                        height: 720,
                      }
                    : { src: url }
                );

                setSlides(newSlides); // cập nhật slides
                // setIndexSelect(index); // lưu index
                lightbox.onOpen(newSlides[0].src); // mở lightbox ngay
  },[lightbox])

  const carousel = useCarousel({
    slidesToShow: 4,
    infinite: false,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  return (
    <Box
      sx={{
        py: 2,
      '& .slick-track': {
          // Chỉ áp dụng khi số lượng item nhỏ hơn số slide muốn hiển thị
          ...(list.length < slidesToShow && {
            marginLeft: 0,
            justifyContent: 'flex-start', // Vẫn giữ lại để đảm bảo
          }),
        },
        ...sx,
      }}
      {...other}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        action={<CarouselArrows onNext={carousel.onNext} onPrev={carousel.onPrev} />}
        sx={{
          p: 0,
          mb: 3,
        }}
      />

      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {list.map((item, index) => (
          <BookingItem key={index} item={item} onClick={handleChangeImagesSelect}/>
        ))}
      </Carousel>

      <Lightbox
              index={lightbox.selected}
              slides={slides}
              open={lightbox.open}
              close={lightbox.onClose}
              disabledVideo={false}
            />
    </Box>
  );
}

// ----------------------------------------------------------------------

type BookingItemProps = {
  item: ItemProps;
};

function BookingItem({ item, onClick }: any) {
  const { avatarUrl, title, duration, bookedAt, guests, coverUrl, price, isHot, images, postedAt } = item;

  return (
    <Paper
      sx={{
        mr: 3,
        borderRadius: 2,
        position: 'relative',
        bgcolor: 'background.neutral',
      }}
    >
      <Stack
        spacing={2}
        sx={{
          px: 2,
          pb: 1,
          pt: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* <Avatar alt={name} src={images[0]} /> */}
          <ListItemText
            primary={title}
            secondary={fDateTime(bookedAt)}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />
        </Stack>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          sx={{ color: 'text.secondary', typography: 'caption' }}
        >
          <Stack direction="row" alignItems="center">
            <Iconify icon="solar:calendar-date-bold" width={16} sx={{ mr: 0.5 }} />
            {changDateJP(postedAt)}
          </Stack>

          {/* <Stack direction="row" alignItems="center">
            <Iconify icon="solar:users-group-rounded-bold" width={16} sx={{ mr: 0.5 }} />
            {guests} Guests
          </Stack> */}
        </Stack>
      </Stack>

      <Label
        variant="filled"
        sx={{
          right: 16,
          zIndex: 9,
          bottom: 16,
          position: 'absolute',
          cursor: 'pointer',
        }}
        onClick={()=>onClick(images)}
      >
        {t('view')}
      </Label>

      <Box sx={{ p: 1, position: 'relative' }}>
        <Image alt={images[0]} src={images[0]} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>
    </Paper>
  );
}
