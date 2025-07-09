import { NextResponse } from "next/server";
import { z } from "zod";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, password, organizationName } = result.data;

    // Generate slug from organization name
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Register user with auth system using new endpoint
    const authResponse = await fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        organizationName,
        organizationSlug: slug,
        role: "owner", // First user is the owner
      }),
    });

    if (!authResponse.ok) {
      const authError = await authResponse.json();
      return NextResponse.json(
        { message: authError.message || "Registration failed" },
        { status: authResponse.status },
      );
    }

    const authData = await authResponse.json();

    // Return the registration data which already includes tokens
    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: authData.user.id,
        name: authData.user.name,
        email: authData.user.email,
      },
      organization: {
        id: authData.organization.id,
        name: authData.organization.name,
        slug: authData.organization.slug,
      },
      token: authData.accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
