import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Cau hinh Capacitor cho app "Nguon Nha Dat Viet Nam".
 *
 * App su dung che do "hosted" (nap truc tiep website da deploy tren Vercel),
 * vi day la ung dung Next.js co server (server actions, Supabase...).
 * Nho vay app luon dong bo voi ban web moi nhat ma khong can build lai app.
 *
 * Neu sau nay ban doi sang domain rieng, chi can sua "server.url" ben duoi.
 */
const config: CapacitorConfig = {
  // Dinh danh app (dao nguoc ten mien). PHAI dung nhat quan tren ca 2 store.
  // Vi du: com.nguonnhadat.app
  appId: 'com.nguonnhadat.app',

  // Ten hien thi duoi icon app tren dien thoai.
  appName: 'Nguon Nha Dat Viet Nam',

  // Thu muc web build. O che do hosted, chi can 1 file index rong lam placeholder.
  webDir: 'mobile-www',

  server: {
    // URL website da deploy - app se nap trang nay.
    // Doi sang https://www.nguonnhadatvn.vn neu ban muon dung domain rieng.
    url: 'https://nguonnhadatvn.vercel.app',
    cleartext: false,
    // Cho phep dieu huong trong cac domain nay ma khong mo trinh duyet ngoai.
    allowNavigation: [
      'nguonnhadatvn.vercel.app',
      'www.nguonnhadatvn.vn',
      'nguonnhadatvn.vn',
      '*.supabase.co',
    ],
  },

  android: {
    // Cho phep app dung HTTPS mac dinh, tat cleartext (HTTP thuong) cho an toan.
    allowMixedContent: false,
  },

  ios: {
    // Mau nen khi app dang tai.
    backgroundColor: '#ffffff',
    contentInset: 'always',
  },
};

export default config;
