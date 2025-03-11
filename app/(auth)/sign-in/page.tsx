import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CredintialsSignInForm from "./credintials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "log In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={100}
              width={100}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center text-xl">Log in</CardTitle>
          <CardDescription className="text-center text-xl">
            Log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredintialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
