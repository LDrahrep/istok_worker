import { redirect } from "next/navigation";
import { getCurrentEmployee } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";
import { LoginForm } from "./_form";

// Already-signed-in users skip the form. Admins go to the desktop tool;
// recognized workers go straight to the root resolver.
export default async function LoginPage() {
  const me = await getCurrentEmployee();
  if (me) {
    if (isAdminRole(me.role)) {
      redirect(
        process.env.NEXT_PUBLIC_ADMIN_URL || "https://istok-admin.vercel.app",
      );
    }
    redirect("/");
  }
  return <LoginForm />;
}
