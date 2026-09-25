# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⛔ Quy tắc bắt buộc

Bốn quy tắc dưới đây do chủ dự án đặt ra, áp dụng cho mọi phiên làm việc. Không được bỏ qua, không được tự nới lỏng.

### 1. Không thay đổi data đã lưu trên MongoDB

**Tuyệt đối không tự ý ghi/sửa/xoá dữ liệu trong MongoDB.** Cụ thể, không được tự làm những việc sau:

- Chạy `mongosh`, script Node/mongoose, hay bất kỳ lệnh nào ghi thẳng vào DB.
- Gọi các endpoint ghi dữ liệu (`/api/*/create`, `/edit`, `/delete`, `/updateStatus`, `/updatePoint`, `/removeIntern`, `/swapIntern`, ...) bằng curl/Postman/script để "test".
- Chạy migration, seed, hay đổi schema trong `QLTTS-BE/src/models/`.
- Submit form trên dev server khi FE đang trỏ tới BE production (kiểm tra `REACT_APP_HOST_API` trong `.env` trước — mặc định đang trỏ tới bản deploy Amplify, **không phải** localhost).

**Nếu một task bắt buộc phải đổi data → dừng lại, mô tả chính xác thay đổi định làm (collection nào, bao nhiêu document, nội dung trước/sau) và hỏi ý kiến chủ dự án. Chỉ thực hiện khi được đồng ý rõ ràng.**

Đọc dữ liệu (query, `.find()`, GET endpoint) thì được phép.

**Chế độ chỉ đọc khi cần thao tác thử trên giao diện.** Chạy backend với `READ_ONLY=1`:

```bash
cd D:\github\QLTTS-BE && READ_ONLY=1 npx next dev -p 7272
```

Server sẽ từ chối (403) mọi endpoint ghi — `create`, `edit`, `delete`, `update*`, `remove*`, `register`, `resetPassword`, `importExcel`, `swapIntern`… Đọc và đăng nhập vẫn bình thường. Nhờ vậy có thể bấm thử bằng tài khoản admin trên CSDL thật mà không sợ lỡ tay ghi.

Kiểm tra nằm trong `requireAccount()` (`src/utils/auth.ts`), **không phải** trong `withAuth` — nhóm `/api/account/*` gọi `requireRole` trực tiếp nên đặt ở `withAuth` sẽ sót nhánh đó. Không chặn theo phương thức HTTP được: codebase dùng POST cho cả việc đọc (`user/listBySource`, `company/listByTradeUnion`).

### 2. Chụp screenshot và đối chiếu sau mỗi thay đổi lớn

Sau mỗi thay đổi lớn về giao diện, phải chạy app, chụp lại màn hình bị ảnh hưởng và so sánh với design gốc trước khi báo hoàn thành. Không được kết luận "đã xong" chỉ dựa trên việc code build được.

**"Design gốc" = ảnh/mockup chủ dự án gửi kèm trong chính task đó.** Không có nguồn cố định (không Figma chung). Vì vậy:

- Nếu task **có** ảnh tham chiếu → đối chiếu screenshot với đúng ảnh đó, chỉ ra từng điểm khớp/lệch.
- Nếu task **không có** ảnh → chụp trạng thái **trước khi sửa** làm mốc, sửa xong chụp lại và so sánh trước/sau.
- Nếu thay đổi lớn mà không rõ phải bám theo design nào → hỏi trước khi làm, đừng tự suy diễn.

Cách làm: chạy `yarn start`, mở trang liên quan, chụp cả **desktop và mobile** (xem quy tắc 3). Nêu rõ trong báo cáo: đã chụp trang nào, khác gì so với ảnh tham chiếu, chỗ nào cố ý làm khác và tại sao.

### 3. Website phải mobile-friendly

Mọi trang/section phải dùng được trên điện thoại, không chỉ desktop.

- Dùng `useResponsive()` ([src/hooks/use-responsive.ts](src/hooks/use-responsive.ts)) và responsive props của MUI (`sx={{ p: { xs: 2, md: 3 } }}`, `Grid xs/sm/md`) — không hardcode chiều rộng cố định bằng px.
- Bảng dữ liệu phải bọc trong `Scrollbar` + `TableContainer` để cuộn ngang được; cân nhắc rút bớt cột hoặc chuyển sang dạng card ở breakpoint `xs`.
- Dialog/form dài: dùng `fullScreen` trên mobile.
- Vùng bấm tối thiểu ~44px; không đặt hành động quan trọng vào hover-only.
- Test ở ít nhất 375px (mobile), 768px (tablet), 1440px (desktop).

### 4. Mọi section phải có animation

Không để section xuất hiện "khô". Dùng đúng bộ animation có sẵn của template (framer-motion), **không thêm thư viện animation khác**:

- [src/components/animate/](src/components/animate/): `MotionViewport` (animate khi cuộn tới), `MotionContainer` (stagger cho danh sách/grid).
- Variants có sẵn trong `src/components/animate/variants/`: `varFade`, `varSlide`, `varZoom`, `varScale`, `varBounce`, `varFlip`, `varRotate`.
- Pattern quen thuộc: bọc section bằng `<Box component={MotionViewport}>` rồi cho từng phần tử con `<m.div variants={varFade().inUp}>`.
- Giữ animation nhẹ và nhanh (fade/slide ngắn). Đây là công cụ nội bộ nhập liệu nhiều — animation để dẫn mắt, không để phô diễn; tránh hiệu ứng lặp vô hạn hay delay dài làm chậm thao tác.
- Tôn trọng `prefers-reduced-motion`.

## Dự án

**QLTTS** (Quản Lý Thực Tập Sinh) — hệ thống quản lý thực tập sinh xuất khẩu lao động Nhật Bản.

- **Frontend (repo này):** `D:\github\QLTTS-FE` — CRA + TypeScript + MUI v5, dựng trên template Minimal UI v5 (docs.minimals.cc).
- **Backend:** `D:\github\QLTTS-BE` — Next.js `pages/api` + Mongoose/MongoDB + Cloudinary + JWT. Models ở `QLTTS-BE/src/models/`, route handlers ở `QLTTS-BE/src/pages/api/<resource>/`. Khi cần biết shape dữ liệu thật, đọc model bên BE thay vì đoán từ types của FE.

**Index MongoDB:** khai báo bằng `schema.index(...)` ngay trước `mongoose.model(...)` trong file model, mỗi index kèm một dòng comment nói nó phục vụ truy vấn nào. Mongoose `autoIndex` tự tạo khi kết nối. Thêm cột lọc hoặc cột sắp xếp mới thì **thêm index tương ứng** — nếu không, truy vấn sẽ quét toàn bộ collection. Kiểm chứng bằng `.explain('executionStats')`: phải thấy `IXSCAN` và `totalDocsExamined` xấp xỉ số dòng trả về, không phải tổng số document.

⚠️ `companies.name` **có giá trị trùng** (nhiều nghiệp đoàn đặt tên công ty giống nhau) — không bao giờ đặt `unique` ở đó. `accounts.username` thì unique.

Giao diện dùng **tiếng Nhật + tiếng Việt** (i18n), không phải tiếng Anh.

## Lệnh thường dùng

```bash
yarn install          # Node 16.x hoặc 18.x (npm i --legacy-peer-deps nếu dùng npm)
yarn start            # dev server :3000
yarn build            # production build -> build/
yarn lint             # eslint --ext .ts,.tsx .
yarn lint:fix
yarn prettier         # prettier --write 'src/**/*.{js,jsx,ts,tsx}'
```

**Không có test suite** trong repo (không có test script, không có file `*.test.tsx`). Đừng bịa lệnh test hay giả định có Jest/RTL đang chạy. Cách verify là `yarn lint` + `yarn build` + chạy thử trên dev server.

BE chạy riêng: `cd D:\github\QLTTS-BE && yarn dev`. FE trỏ tới BE qua `.env`:

```
REACT_APP_HOST_API    # base URL của BE
REACT_APP_ASSETS_API  # base URL cho assets
```

Mặc định hiện tại trỏ tới bản deploy trên AWS Amplify; đổi sang `http://localhost:7272` (dòng đã comment sẵn trong `.env`) để chạy local với BE.

## Kiến trúc

### Điểm quan trọng nhất: naming skew "intern" vs "user"

Toàn bộ domain **thực tập sinh** nằm trong thư mục tên `user`:

- Views/components: [src/sections/user/](src/sections/user/) (ví dụ `intern-list-view.tsx`, `intern-new-edit-form.tsx`)
- Types: [src/types/user.ts](src/types/user.ts) (`IInternItem`, `IInternTableFilters`)
- API backend: `/api/user/*` (`/api/user/list`, `/api/user/create`, `/api/user/updateStatus`, ...)

Routes và paths thì lại dùng tên `intern` (`paths.dashboard.intern.*`, `/dashboard/intern/list`). Khi tìm code liên quan tới thực tập sinh, **grep cả hai từ khoá**. Đây không phải nhầm lẫn cần sửa — đổi tên sẽ phá vỡ hợp đồng với BE.

### Luồng một trang

```
src/routes/paths.ts               -> định nghĩa tất cả URL (dùng paths.*, đừng hardcode chuỗi)
src/routes/sections/dashboard.tsx -> map path -> page, bọc trong AuthGuard + RoleBasedGuard
src/pages/dashboard/<domain>/     -> wrapper mỏng: <Helmet><title>{t(...)}</title></Helmet> + <XxxView />
src/sections/user/view/*-view.tsx -> chứa toàn bộ state, fetch, layout của trang
src/sections/user/*.tsx           -> table row / toolbar / form con của view đó
```

Page trong [src/pages/](src/pages/) **luôn** chỉ là wrapper. Logic mới thuộc về [src/sections/](src/sections/).

### Các domain thực tế đang dùng

`intern` (thực tập sinh), `tradeUnion` (nghiệp đoàn), `company` (xí nghiệp), `order` (đơn hàng), `source` (nguồn tuyển), `diary` (nhật ký), `gallery` (album ảnh), `study` (quá trình học), `attendance` (điểm danh), `compare` (danh sách so sánh ứng viên), `pass` (hồ sơ xuất cảnh), `account` (tài khoản đăng nhập).

Lưu ý `account` khác `intern`: `account` là bản ghi đăng nhập (collection `Account`, API `/api/account/*`, kiểu `IAccountItem`), còn `intern` là hồ sơ thực tập sinh. Trang quản lý tài khoản nằm ở `src/sections/user/view/account-list-view.tsx` và chỉ admin vào được.

#### Quy ước `companySelect` trên Account

⚠️ `companySelect` mang **hai nghĩa khác nhau** tuỳ collection:

- Trên **Intern**: một công ty (`intern.companySelect.name`) — công ty mà TTS đó thuộc về.
- Trên **Account**: mảng công ty, dùng để **giới hạn quyền xem** của tài khoản `tradeunion`.

Quy tắc của tài khoản `tradeunion`:

- **Không có thuộc tính `companySelect`** → xem được **toàn bộ** công ty thuộc nghiệp đoàn đó. Đây là mặc định.
- **Có `companySelect` với ít nhất 1 phần tử** → chỉ xem được đúng những công ty đã chọn.

Code quyết định dựa trên `user?.companySelect?.length > 0` (xem `intern-list-by-trade-union-view.tsx`), chọn giữa `user/listByTradeUnion` và `user/listByTradeUnionAndCompany`.

Vì vậy khi ghi dữ liệu: **không chọn công ty nào thì phải `$unset` thuộc tính, tuyệt đối không lưu `[]`**. Mongoose tự sinh `[]` cho trường kiểu mảng, nên `account/register.ts` phải `$unset` lại sau khi `create`, còn `account/edit.ts` dùng `$set`/`$unset` tường minh thay vì gán rồi `save()`.

`companySelect` chỉ có nghĩa với role `tradeunion` — đổi sang role khác thì xoá luôn thuộc tính. Danh sách công ty cho admin chọn phải lấy qua `company/listByTradeUnion` theo đúng nghiệp đoàn của tài khoản, **không phải** `company/list` (toàn bộ 107 công ty của mọi nghiệp đoàn).

**Isuzu** là biến thể mẫu hồ sơ riêng cho một khách hàng — có route (`intern/newIsuzu`, `intern/:id/editIsuzu`), form (`intern-new-edit-form-isuzu.tsx`) và PDF (`intern-pdf-isuzu*.tsx`) song song với bản thường. Sửa bản thường thì cân nhắc có phải sửa cả bản Isuzu không.

### Code template chưa dùng

Repo giữ nguyên rất nhiều code mẫu của Minimal UI: `src/sections/{_examples,blog,chat,kanban,mail,tour,product,job,file-manager,...}`, `src/redux/slices/*`, `src/_mock/*`, phần lớn `src/types/*`. Hầu hết route tới chúng đã bị comment trong [src/routes/sections/dashboard.tsx](src/routes/sections/dashboard.tsx). **Đừng lấy chúng làm chuẩn cho code mới, và đừng sửa/dọn chúng trừ khi được yêu cầu.** Ngoại lệ: `src/sections/invoice/` và `src/sections/order/` có chứa các file PDF thật đang dùng (xem bên dưới).

Redux (`@reduxjs/toolkit` + `redux-persist`) chỉ phục vụ code template. Domain thật **không dùng Redux** — state nằm trong `useState`/`useEffect` ngay trong view.

### Gọi API

Có hai pattern song song, **domain thật dùng pattern thứ hai**:

1. [src/utils/axios.ts](src/utils/axios.ts) — instance có `baseURL` + `API_ENDPOINTS`. Chỉ dùng bởi code template và luồng auth.
2. Raw `import axios from 'axios'` + URL ghép tay: ``axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`)``. Đây là pattern của ~70 file trong `src/sections/user/` và các view domain khác.

**Token được gắn tự động cho cả hai pattern.** [src/utils/axios.ts](src/utils/axios.ts) đăng ký một request interceptor lên *cả* instance lẫn `axios` mặc định, đọc `accessToken` từ `localStorage` và chỉ gắn khi URL trỏ tới BE của hệ thống (đường dẫn tương đối, hoặc bắt đầu bằng `HOST_API`). Nhờ vậy ~70 file dùng raw axios vẫn qua được lớp xác thực mà không phải sửa từng file.

Điều này có nghĩa: **không bao giờ gắn token thủ công**, và **không gọi API của hệ thống bằng `fetch` hay một instance axios tự tạo** — chúng sẽ không có interceptor và sẽ nhận 401. Lời gọi tới bên thứ ba (`api.cloudinary.com`) cố ý không được gắn token.

Upload ảnh: qua `${REACT_APP_HOST_API}/api/cloudinary` (form intern), hoặc gọi thẳng `api.cloudinary.com` (certificate, gallery).

### Auth & phân quyền

**Phía backend:** helper dùng chung ở `QLTTS-BE/src/utils/auth.ts`. Cách chuẩn là bọc handler bằng `withAuth` — nó chặn *trước* khi handler chạy, tự xử lý CORS (thiếu header CORS thì trình duyệt báo lỗi CORS thay vì hiện đúng 401) và cho preflight `OPTIONS` đi qua:

```ts
async function handler(req: NextApiRequest, res: NextApiResponse) { ... }

export default withAuth(handler);                        // chỉ cần đăng nhập
export default withAuth(handler, { roles: ['admin'] });  // phải là admin
```

Account đã xác thực được gắn vào `req.account`. Ngoài ra còn `requireAccount(req)` / `requireRole(req, roles)` / `sendAuthError(error, res)` để dùng bên trong handler khi cần logic phức tạp hơn (nhóm `/api/account/*` dùng cách này).

**Toàn bộ 141 endpoint đã được bọc**, trừ 5 endpoint cố ý để công khai: `account/login`, `account/me` (tự xác thực), và `auth/login` + `auth/me` + `auth/register` (mã mẫu của template, chạy trên dữ liệu `_mock` với secret riêng, không đụng MongoDB).

22 endpoint yêu cầu role `admin` — các thao tác quản trị mà giao diện vốn đã chỉ cho admin dùng (`user/create|edit|delete|importExcel|updateAllType|updateSource`, `company|tradeUnion|source /create|edit|delete`, `order/create|edit`, `pass/*`, `account/checkRole`). Số còn lại chỉ yêu cầu đăng nhập.

**Endpoint mới viết ra phải bọc `withAuth` ngay từ đầu.**

**Secret và biến môi trường (BE):** `getJwtSecret()` trong `src/utils/auth.ts` là **nguồn duy nhất** của JWT secret — không có giá trị dự phòng cố định, thiếu biến thì ném lỗi 500 ngay. Tương tự `db.ts` chỉ đọc `MONGODB_URL`. **Tuyệt đối không đặt tên biến bí mật với tiền tố `NEXT_PUBLIC_`** — Next.js nhúng mọi biến `NEXT_PUBLIC_*` vào bundle phía trình duyệt.

⚠️ **Biến môi trường trên Amplify KHÔNG tự xuống tới runtime của Next.js SSR.** Biến đặt trong Amplify Console chỉ tồn tại **lúc build**; AWS cố ý không chuyển chúng xuống Lambda chạy SSR. Vì vậy buildspec của app **QLTTS-BE** phải tự ghi chúng vào `.env.production` trước khi build:

```yaml
    build:
      commands:
        - env | grep -E '^(JWT_SECRET|MONGODB_URL|CORS_ORIGINS)=' >> .env.production
        - yarn run build
```

`^` và `=` neo hai đầu để không quét trúng biến `NEXT_PUBLIC_*`. Cố ý **không** thêm `|| true`: thiếu biến thì build phải đỏ ngay, còn hơn deploy êm rồi mọi endpoint trả 500.

Đây chính là lý do code cũ (`NEXT_PUBLIC_JWT_SECRET`) chạy được: tiền tố `NEXT_PUBLIC_` khiến Next.js nhúng giá trị vào bundle lúc build, nên runtime luôn có. Bỏ tiền tố đi là mất con đường vô tình đó — **bỏ tiền tố và sửa buildspec phải đi cùng nhau**, làm nửa vời sẽ sập toàn bộ API.

Thêm biến bí mật mới cho BE thì phải thêm tên nó vào dòng `grep` trên, nếu không nó sẽ `undefined` lúc chạy dù Console đã có.

**CORS:** `src/utils/cors.ts` đọc `CORS_ORIGINS` (danh sách origin phân tách bằng dấu phẩy). Bỏ trống = cho qua mọi origin kèm cảnh báo lúc khởi động. Origin không nằm trong danh sách thì **không được gắn header `Access-Control-Allow-Origin`** (trả `callback(null, false)`) thay vì ném Error — ném Error sẽ làm handler trả 500 kèm stack trace.

#### ⏳ Ba việc bảo mật còn treo (đừng tự ý làm)

Mã nguồn đã sẵn sàng, nhưng ba thao tác dưới đây **chưa được thực hiện** vì phần mềm đang có người dùng thật. Chủ dự án sẽ chọn thời điểm — **không tự ý làm, không tự ý giục**:

1. **Đổi mật khẩu MongoDB** trên Atlas + cập nhật `MONGODB_URL` (`.env` local và biến môi trường Amplify).
2. **Đổi `JWT_SECRET`.** Thao tác này làm mọi người đang đăng nhập bị đăng xuất → phải chọn giờ thấp điểm.
3. **Đặt `CORS_ORIGINS`** trên Amplify. Chưa đặt thì backend vẫn cho qua mọi origin.

Lý do phải đổi (1) và (2): cả hai từng được khai báo với tiền tố `NEXT_PUBLIC_` trong thời gian dài nên phải coi như đã lộ.

Ngoài ra `QLTTS-BE/.env` còn một dòng `MONGODB_URL` đã comment trỏ tới cluster khác — hỏi trước khi xoá.

⚠️ Khi siết thêm role, phải kiểm tra route nào render form gọi endpoint đó. Một số trang **không có `RoleBasedGuard`** — đáng chú ý là `intern/:id/profile` và `diary/:id/profile` — nên mọi role đăng nhập đều vào được. Vì thế `user/updateTradeUnion`, `gallery/create|edit|delete`, `diary/create|edit` cố ý chỉ để mức "đăng nhập", đặt admin sẽ khoá nhầm người dùng hợp lệ.

**Phía frontend:** khi gọi endpoint đã được bảo vệ, phải dùng instance trong [src/utils/axios.ts](src/utils/axios.ts) (`import axios, { API_ENDPOINTS } from 'src/utils/axios'`) chứ không phải `axios` trần — chỉ instance đó mới mang header `Authorization`.

- Provider: [src/auth/context/jwt/](src/auth/context/jwt/) (các provider auth0/amplify/firebase còn trong repo nhưng đã comment trong [src/App.tsx](src/App.tsx)).
- **Không có đăng ký công khai.** Route `/auth/jwt/register` đã bị gỡ; tài khoản chỉ được tạo từ trang Quản lý tài khoản (`/dashboard/account/list`, chỉ admin).
- Token: `accessToken` trong `localStorage`; `tokenExpired()` đặt timer, hết hạn thì `alert` + redirect về `paths.auth.jwt.login`.
- Roles đang dùng: `admin`, `tradeunion`, `source`, `demo`, `dongthap`.
- Chặn ở hai chỗ: `RoleBasedGuard roles={[...]}` trong [src/routes/sections/dashboard.tsx](src/routes/sections/dashboard.tsx), và field `roles` trên item trong [src/layouts/dashboard/config-navigation.tsx](src/layouts/dashboard/config-navigation.tsx) (điều khiển menu bên trái). **Thêm trang mới thì phải cập nhật cả hai**, cộng với `paths.ts`.
- `useNavData()` còn đổi đích của menu "Thực tập sinh" theo role qua `transListInternPath()`.

### i18n

- `useLocales()` → `t('key')`. Ngôn ngữ mặc định là **`jp`** (`allLangs[0]` trong [src/locales/config-lang.ts](src/locales/config-lang.ts)); chỉ `jp` và `vi` được bật.
- File dịch: `src/locales/langs/{jp,vi}.json`. **Mọi chuỗi hiển thị mới phải thêm vào cả hai file**, không hardcode text trong JSX.
- Label domain cố định (không qua i18n) nằm trong [src/utils/](src/utils/): `status.ts` (trạng thái TTS / hồ sơ / đào tạo), `type.ts` (`typeIntern` + `typeInternJP`), `characteristic.ts`, `teacher.ts`, `learningProcess.ts` (giáo trình 皆の日本語), `departure.ts`. Thêm option mới thì sửa ở đây.
- [src/utils/vietnameseToKatakana.ts](src/utils/vietnameseToKatakana.ts) chuyển tên tiếng Việt sang katakana cho hồ sơ tiếng Nhật; `strong.ts`/`weak.ts` sinh mô tả điểm mạnh/yếu song ngữ.

### Xuất file

- **Excel:** `src/utils/Export*.tsx` (ExcelJS + file-saver) — `ExportListInterns`, `ExportIntern`, `ExportInternsWithAvatar`, `ExportInternsPass`, `ExportStudy`, `ExportListCompany`, `ExportListTradeUnion`. Mỗi file tự dựng cột/style, khá dài; sửa thì bám theo cấu trúc sẵn có.
- **PDF:** `@react-pdf/renderer`. Hồ sơ cá nhân ở `src/sections/invoice/intern-pdf*.tsx`, hồ sơ theo đơn hàng ở `src/sections/order/All*PDF.tsx`. Có nhiều biến thể (có/không điểm, IQ, Kraepelin, Isuzu, 1 năm) — đọc tên file để chọn đúng bản trước khi sửa.

⚠️ **Hai thư viện này phải nạp động, đừng import tĩnh trở lại.** ExcelJS (~1 MB) và `@react-pdf/renderer` (~1,3 MB) chỉ được nạp lúc người dùng bấm nút:

```ts
// ExcelJS — trong Export*.tsx. Phần kiểu dùng import('exceljs').X (chỉ có lúc biên dịch).
const ExcelJS = (await import('exceljs')).default;

// PDF — trong handler của toolbar, nạp cả thư viện lẫn component PDF.
const [{ pdf }, { default: AllAttendancePDF }] = await Promise.all([
  import('@react-pdf/renderer'),
  import('../order/AllAttendancePDF'),
]);
```

Các form còn dùng `PDFDownloadLink` render thẳng trong JSX (`intern-new-edit-form.tsx`, `intern-view-form.tsx`, ...) thì **vẫn import tĩnh** — muốn nạp động phải bọc `React.lazy` + `Suspense`, chưa làm.

#### Hợp đồng đưa người lao động đi làm việc (HĐLĐ, Mẫu số 03)

In từ nút "In hợp đồng" ([intern-contract-button.tsx](src/sections/user/intern-contract-button.tsx), chỉ admin) ở form Hồ sơ xuất cảnh và ở thanh chọn nhiều dòng của danh sách TTS.

- **Nguồn dữ liệu duy nhất:** [src/utils/contract.ts](src/utils/contract.ts) — thông tin Nhật Tân, bảng phí, điều khoản, cách đọc hồ sơ (`buildContractData`). Đổi phí/người đại diện chỉ sửa ở đây; cả PDF lẫn Excel đọc chung.
- **Dữ liệu:** TTS dùng `field` (ngành nghề tiếng Việt), `citizen*`, `passport*`, `street`/`state`, `emergencyContact*`, `contractId`/`contractDate`; xí nghiệp dùng `director` + khối lương (`trainingAllowance`, `salary`, `tax`, `socialInsurance`, `housingFee`, đơn vị Yên). Form Hồ sơ xuất cảnh lưu qua `/api/user/updateLaborInfo` (admin).
- **PDF** ([intern-pdf-contract.tsx](src/sections/invoice/intern-pdf-contract.tsx)): font Tinos (cùng số đo với Times New Roman của file mẫu). Tên nghiệp đoàn/xí nghiệp trong CSDL thường là **tiếng Nhật** mà Tinos không có chữ Nhật → chỉ khi hợp đồng có chữ Nhật mới bật font dự phòng Noto Sans JP (react-pdf tải mọi font dự phòng, mỗi file 5,7MB).
- **Excel** ([ExportContract.ts](src/utils/ExportContract.ts)) nạp khuôn `public/assets/templates/hop-dong-lao-dong.xlsx`, ghi đè toàn bộ công thức sheet HĐLĐ **kèm kết quả tính sẵn** (ứng dụng xem trước trên điện thoại không tự tính công thức).
- ⚠️ **Không bao giờ chép thẳng file mẫu gốc vào `public/`** — mọi thứ trong `public/` ai cũng tải được, còn file mẫu gốc chứa CCCD/SĐT người thật. Đổi mẫu thì chạy `node scripts/build-contract-template.js "MẪU HĐLĐ.xlsx"`: script gỡ dữ liệu cá nhân, tự dò lại file đầu ra và **dừng với lỗi nếu còn sót**. File mẫu gốc đã nằm trong `.gitignore`.

### Bundle

Bundle khởi động (`main.js`) là thứ **mọi người tải mỗi lần vào app** — giữ nó nhỏ. Hai quy tắc:

- **Route mới phải khai báo bằng `lazy()`** trong [dashboard.tsx](src/routes/sections/dashboard.tsx), không import trực tiếp ở đầu file. Import trực tiếp kéo cả cây phụ thuộc của trang đó (view → toolbar → PDF) vào bundle khởi động, tải cho cả người dùng không có quyền xem.
- **Không thêm import nặng vào [src/App.tsx](src/App.tsx).** File này chạy cho mọi trang. `mapbox-gl` và `slick-carousel` đã được gỡ khỏi đây vì không trang nghiệp vụ nào dùng; nếu sau này cần bản đồ thì import ngay trong component dùng nó.

Kiểm chứng: `yarn build` rồi xem kích thước `build/static/js/main.*.js`. Tại thời điểm dọn xong, `main.js` ≈ 1,2 MB (trước đó 8,2 MB).

### Form

Chuẩn: `react-hook-form` + `yup` (`yupResolver`) + wrapper [src/components/hook-form/](src/components/hook-form/) (`FormProvider`, `RHFTextField`, `RHFSelect`, `RHFAutocomplete`, `RHFUploadAvatar`, ...). Ngày dùng `@mui/x-date-pickers` với `AdapterDayjs` + locale `vi` trong form domain (lưu ý: `src/App.tsx` bọc `AdapterDateFns` ở tầng ngoài — các form domain tự bọc `LocalizationProvider` riêng của mình).

### Bảng

Dùng bộ [src/components/table/](src/components/table/) (`useTable`, `TableHeadCustom`, `TablePaginationCustom`, `TableSelectedAction`, `getComparator`) chứ không phải `@mui/x-data-grid`, dù package có sẵn. Mỗi list view có bộ ba: `*-table-row.tsx`, `*-table-toolbar.tsx`, `*-table-filters-result.tsx`.

**Hầu hết list view vẫn lọc/sắp xếp/phân trang ở client** (tải hết rồi `applyFilter` + `.slice()`). Riêng [intern-list-view.tsx](src/sections/user/view/intern-list-view.tsx) **đã chuyển sang phía server** — đừng lấy các view còn lại làm mẫu khi sửa nó.

Hai quy ước bắt buộc cho các view còn lọc ở client:

- **`applyFilter` phải bọc trong `useMemo`.** Nó sao chép rồi sắp xếp toàn bộ mảng và lọc tuần tự; gọi trực tiếp trong thân component nghĩa là chạy lại ở mọi lần render.
- **Ô tìm kiếm trong toolbar dùng [useDebouncedFilter](src/hooks/use-debounced-filter.ts).** Hook giữ giá trị hiển thị ngay lập tức nhưng chỉ gọi `onFilters` sau khi ngừng gõ, nếu không `useMemo` bị vô hiệu ở mỗi phím. Ngoại lệ: `intern-table-toolbar-with-source` không dùng hook này vì view của nó đã tự debounce trước khi gọi API — thêm nữa sẽ thành debounce hai lần.

#### Dòng bảng đã memo hoá (chỉ hai component danh sách TTS)

`intern-table-row.tsx` và `intern-by-trade-union-table-row.tsx` bọc `React.memo`. Để memo **thực sự** có tác dụng, bốn thứ phải giữ nguyên — sửa hỏng một cái là memo thành vô nghĩa:

1. **Prop handler nhận `id`**, không phải `VoidFunction`: `onEditRow: (id: string) => void`. View truyền thẳng `onEditRow={handleEditRow}`, **không** dùng arrow nội tuyến `onEditRow={() => handleEditRow(row._id)}`. Component dòng tự gọi `onEditRow(row._id)`.
2. **`useTable` trả về object bọc `useMemo`** — trước đây là object literal mới mỗi lần render.
3. **`useTable.onSelectRow` dùng dạng hàm của `setSelected`**, không phụ thuộc `selected`.
4. **View destructure phương thức cần dùng**: `const { onResetPage, onUpdatePageDeleteRow } = table;` rồi đưa biến đó vào mảng phụ thuộc. Để cả object `table` trong deps sẽ làm callback đổi mỗi khi selection đổi. (Phải destructure chứ không viết `[table.onResetPage]` — eslint `react-hooks/exhaustive-deps` đòi object gốc khi thấy lời gọi phương thức.)

Các component dòng còn lại (company, source, tradeUnion, diary, account) **cố ý không memo**: danh sách chỉ vài chục dòng, không đáng để refactor prop.

#### Thống kê trang tổng quan

Trang tổng quan gọi **một** endpoint `/api/user/dashboardStats`, không phải 12 endpoint lẻ như trước. Endpoint đó chạy song song 12 phép thống kê rồi cache 3 phút trong bộ nhớ tiến trình (`?fresh=1` để bỏ qua cache khi cần kiểm chứng).

Logic của từng phép thống kê nằm trong chính file endpoint lẻ, được export ra hàm `computeXxx()` — ví dụ `count.ts` export `computeCount()`. **Sửa công thức thì sửa trong hàm đó**, cả endpoint lẻ lẫn endpoint gộp đều dùng chung, không có chỗ nào chép lại pipeline. 12 endpoint lẻ vẫn giữ nguyên đường dẫn và kết quả để không phá code cũ.

⚠️ `countSource` trả về mảng **không có thứ tự ổn định** (pipeline `$group` thiếu `$sort`) — cùng nội dung nhưng thứ tự phần tử đổi giữa các lần gọi. Đây là hành vi có sẵn từ trước; nếu giao diện cần thứ tự cố định thì phải thêm `$sort` vào pipeline.

#### `/api/user/list` có ba chế độ

| Query | Trả về | Dùng cho |
|---|---|---|
| `?page=&limit=&search=&status=&...` | trang hiện tại, **chỉ 12 trường**, kèm `total` và `statusCounts` | bảng danh sách |
| `?fields=basic` | chỉ `_id/name/namejp` | dropdown chọn TTS |
| không có `page` | đủ 110 trường, **có áp bộ lọc** nếu truyền | xuất Excel, PDF điểm danh |

Điểm cần nhớ khi sửa:

- Bộ lọc trên giao diện dùng **tên** nghiệp đoàn/nguồn/xí nghiệp, còn Intern lưu ObjectId — endpoint tự tra tên → id.
- Tìm kiếm bỏ dấu do `src/utils/search.ts` bên BE lo (`\p{Mn}` + nở lớp ký tự), **không** còn lọc ở client.
- `statusCounts` tính trên tập đã lọc nhưng **bỏ qua chính bộ lọc trạng thái**, nếu không thì tab đang chọn sẽ là tab duy nhất khác 0.
- **`age` không có trong CSDL** (tính từ `birthday` lúc trả kết quả). Sắp xếp theo `age` được ánh xạ sang `birthday` với thứ tự đảo ngược. Thêm cột sắp xếp mới thì kiểm tra field đó có thật trong model không.
- Thao tác hàng loạt (xuất Excel, PDF điểm danh) nhận prop `fetchAllInterns` / `fetchInterns` để tự lấy trọn bộ lúc bấm — **không** dựa vào prop `interns` vì nó chỉ là trang hiện tại.
- "Chọn tất cả" giờ chỉ chọn trong trang hiện tại, đúng như cách bảng phân trang thường hoạt động.

## Quy ước code

- **Import tuyệt đối từ `src/`** (`baseUrl: "."` trong tsconfig): `import ... from 'src/...'`. Import tương đối chỉ dùng cho file cùng thư mục / thư mục cha gần.
- **Tên file kebab-case**, một component mỗi file, export default.
- Prettier: `printWidth: 100`, single quote, `trailingComma: es5`, tab 2. Chạy `yarn prettier` trước khi commit.
- ESLint: airbnb + TS + prettier. Code hiện tại có khá nhiều `// eslint-disable-next-line`; không cần dọn khi đi ngang qua.
- TS `strict: true` nhưng phần domain dùng `any` khá thoáng. Code mới nên gõ type rõ ràng, đừng đi loosen type sẵn có.
- Comment và nhãn UI viết tiếng Việt là bình thường trong repo này.

## Nguyên tắc thiết kế giao diện

Định hướng: **tối giản, hiện đại, chuyên nghiệp**. Cụ thể:

- Bám theo design system của theme ([src/theme/](src/theme/)). Dùng token: `palette.primary.main`, `text.secondary`, `theme.spacing()`, `customShadows`, `theme.typography.*`. **Không hardcode mã màu hex, không tự chế shadow/radius.**
- Dùng lại component có sẵn trong [src/components/](src/components/) (`Label`, `Iconify`, `Scrollbar`, `CustomBreadcrumbs`, `EmptyContent`, `ConfirmDialog`, `snackbar`) thay vì viết mới. **Không thêm thư viện UI khác.**
- Layout dựng bằng `Card` + `Stack` + `Grid` (Unstable_Grid2) với spacing đều; ưu tiên khoảng trắng rộng, ít đường kẻ, ít màu — màu chỉ để phân biệt trạng thái.
- Trạng thái dùng `<Label color=...>` theo quy ước sẵn có, không dùng chip màu tuỳ hứng.
- Icon qua `Iconify` (bộ `solar:` / `mingcute:` như code hiện tại), kích thước nhất quán.
- Mọi trang phải xử lý đủ 3 trạng thái: loading (`LoadingScreen`/skeleton), rỗng (`TableNoData`/`EmptyContent`), lỗi (snackbar).
- Giữ mật độ thông tin cao nhưng gọn — đây là công cụ nội bộ nhập liệu nhiều: bảng đọc nhanh, filter rõ ràng, hành động chính nổi bật.
- Animation là bắt buộc (quy tắc 4) nhưng phải nhẹ và nhanh, không cản trở thao tác nhập liệu.
- Respect theme mode (light/dark) và các setting `themeStretch`/`themeLayout` từ `useSettingsContext()`.
- Mobile-friendly là bắt buộc (quy tắc 3) — thiết kế cho màn hình nhỏ trước khi tinh chỉnh desktop.
