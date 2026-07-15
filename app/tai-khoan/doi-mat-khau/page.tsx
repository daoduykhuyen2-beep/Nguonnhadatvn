import PasswordForm from "@/components/PasswordForm";
export const metadata = { title: "Đổi mật khẩu | Tài khoản" };
export default function Page() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Đổi mật khẩu</h1>
      <PasswordForm />
    </div>
  );
}
