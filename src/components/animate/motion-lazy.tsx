import { LazyMotion, MotionConfig, m } from 'framer-motion';

// ----------------------------------------------------------------------

// eslint-disable-next-line import/extensions
const loadFeatures = () => import('./features.js').then((res) => res.default);

type Props = {
  children: React.ReactNode;
};

function MotionLazy({ children }: Props) {
  return (
    // reducedMotion="user": người dùng bật "giảm chuyển động" trong hệ điều hành thì
    // framer-motion bỏ hiệu ứng dịch chuyển/co giãn, chỉ giữ đổi độ mờ. Áp cho toàn app.
    <MotionConfig reducedMotion="user">
      <LazyMotion strict features={loadFeatures}>
        <m.div style={{ height: '100%' }}> {children} </m.div>
      </LazyMotion>
    </MotionConfig>
  );
}

export default MotionLazy;
