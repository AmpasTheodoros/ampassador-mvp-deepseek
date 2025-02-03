// app/dashboard/page.tsx

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  // Ensure user exists in DB
  let user = await prisma.user.findUnique({ where: { userId } });

  if (!user) {
    // Fetch user details from Clerk API
    const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const clerkUser = await clerkRes.json();
    if (!clerkUser) return redirect("/sign-in");

    // Save the user in the database
    user = await prisma.user.create({
      data: {
        userId: userId,
        email: clerkUser.email_addresses[0].email_address,
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
        <Link
          href="/api/generate-report"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          target="_blank"
        >
          Download Report
        </Link>
      </div>
    </div>
  );
}
