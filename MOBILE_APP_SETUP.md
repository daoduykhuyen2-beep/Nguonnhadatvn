# Huong dan dong goi website thanh app (Android + iOS)

Tai lieu nay huong dan bien website **Nguon Nha Dat Viet Nam** (Next.js) thanh app
cai duoc tren **CH Play (Android)** va **App Store (iOS)** bang **Capacitor**.

App chay o che do **hosted**: no nap truc tiep website da deploy tren Vercel
(xem "server.url" trong file capacitor.config.ts). Nho vay:
- App luon dong bo voi ban web moi nhat, khong can build lai app moi lan sua web.
- Giu nguyen toan bo tinh nang server (Supabase, server actions, dang nhap...).

---

## 0. Chuan bi (lam 1 lan)

Ban can co san tren may Mac:
- **Node.js** 18 tro len (kiem tra: \`node -v\`)
- **Android Studio** (de build Android) — https://developer.android.com/studio
- **Xcode** (de build iOS, chi co tren macOS) — cai tu App Store
- **CocoaPods** (cho iOS): \`sudo gem install cocoapods\`

Tai khoan (ban tu dang ky, co tinh phi):
- **Google Play Console**: phi 25 USD (dong 1 lan) — https://play.google.com/console
- **Apple Developer**: phi 99 USD/nam — https://developer.apple.com/programs

> LUU Y: Cac buoc tao tai khoan, thanh toan, va tai app len store BAT BUOC ban tu lam.
> Cong cu tu dong khong the dang nhap tai khoan developer hay thanh toan ho ban.

---

## 1. Tai code ve may va cai thu vien

Mo Terminal, tai repo ve va cai package:

\`\`\`bash
git clone https://github.com/daoduykhuyen2-beep/Nguonnhadatvn.git
cd Nguonnhadatvn
npm install
\`\`\`

Cai Capacitor:

\`\`\`bash
npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/splash-screen
\`\`\`

> File \`capacitor.config.ts\` da co san trong repo, ban khong can tao lai.

---

## 2. Them nen tang Android va iOS

\`\`\`bash
npx cap add android
npx cap add ios
\`\`\`

Lenh nay tao 2 thu muc \`android/\` va \`ios/\`. Sau moi lan sua capacitor.config.ts,
chay dong bo lai:

\`\`\`bash
npx cap sync
\`\`\`

---

## 3. Tao icon va man hinh chao (splash)

1. Chuan bi 1 anh icon vuong **1024x1024 px** (ten \`icon.png\`)
   va 1 anh splash **2732x2732 px** (ten \`splash.png\`), de trong thu muc \`resources/\`.
2. Cai va chay cong cu tao icon tu dong:

\`\`\`bash
npm install -D @capacitor/assets
npx capacitor-assets generate
\`\`\`

Cong cu se tu tao du kich co icon/splash cho ca Android va iOS.

---

## 4. Build va chay thu

### Android
\`\`\`bash
npx cap open android
\`\`\`
Android Studio se mo. Bam nut **Run** (tam giac xanh) de chay tren may ao/dien thoai.

### iOS (chi tren Mac)
\`\`\`bash
npx cap open ios
\`\`\`
Xcode se mo. Chon thiet bi roi bam **Run**.

---

## 5. Dong goi de tai len store

### Android -> CH Play
1. Trong Android Studio: menu **Build > Generate Signed Bundle / APK**.
2. Chon **Android App Bundle (.aab)**.
3. Tao **keystore** moi (bam Create new...). LUU KY file keystore + mat khau —
   mat file nay se KHONG cap nhat app duoc nua.
4. Build ra file \`.aab\`.
5. Vao https://play.google.com/console -> tao app moi -> tai file \`.aab\` len ->
   dien mo ta, anh chup man hinh, chinh sach bao mat -> gui duyet.

### iOS -> App Store
1. Trong Xcode: chon **Any iOS Device**, menu **Product > Archive**.
2. Sau khi archive xong, bam **Distribute App > App Store Connect**.
3. Vao https://appstoreconnect.apple.com -> tao app moi -> chon ban build vua tai len ->
   dien mo ta, anh chup man hinh -> gui duyet.

---

## 6. Nhung thu ban CAN chuan bi cho ho so tren store

- **Ten app**: Nguon Nha Dat Viet Nam
- **Icon** 512x512 (Play) va 1024x1024 (Apple)
- **Anh chup man hinh** (screenshots) it nhat 2-8 tam cho tung kich co man hinh
- **Mo ta app** (tieng Viet + tieng Anh cang tot)
- **Chinh sach bao mat (Privacy Policy)**: bat buoc phai co URL. Ban co the tao
  1 trang /chinh-sach-bao-mat tren web va dung URL do.
- **Phan loai do tuoi** va cac cau hoi ve du lieu ban thu thap

---

## 7. Ghi chu quan trong

- **App ID** trong capacitor.config.ts (\`com.nguonnhadat.app\`) phai giong het khi tao
  app tren ca 2 store. Doi ID sau khi da phat hanh se rat phien, nen chon ky tu dau.
- **Apple** kho tinh voi app chi "boc web". De duyet de hon, nen co it nhat 1-2 tinh nang
  native (vi du: thong bao day - push notification). Neu bi tu choi, ban co the them
  push notification qua plugin \`@capacitor/push-notifications\`.
- Nen them \`android/\`, \`ios/\`, va \`resources/\` sinh ra vao \`.gitignore\` neu ban khong
  muon day chung len GitHub (khong bat buoc).
- Moi lan ban cap nhat website tren Vercel, app tu dong hien ban moi (do chay che do hosted),
  KHONG can build va nop lai app — tru khi ban doi icon, ten, hoac cau hinh native.

---

## Tom tat lenh nhanh

\`\`\`bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/splash-screen
npx cap add android
npx cap add ios
npx cap sync
npx cap open android   # build Android
npx cap open ios       # build iOS (can Mac + Xcode)
\`\`\`
