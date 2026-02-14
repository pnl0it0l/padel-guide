import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.email !== "pntrigo@gmail.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users with their accounts and tournaments count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        Account: {
          select: {
            provider: true,
          },
        },
        Tournament: {
          select: {
            id: true,
          },
        },
        Session: {
          select: {
            expires: true,
          },
          orderBy: {
            expires: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        email: "asc",
      },
    });

    // Format the response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      provider: user.Account[0]?.provider || "unknown",
      tournamentsCount: user.Tournament.length,
      lastSession: user.Session[0]?.expires || null,
      hasActiveSession: user.Session[0]
        ? new Date(user.Session[0].expires) > new Date()
        : false,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
