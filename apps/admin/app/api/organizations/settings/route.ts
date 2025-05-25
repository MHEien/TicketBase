import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Get organization settings
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    // Ensure the user is authenticated
    if (!session?.user || !session.accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Get the user's organization ID from the session
    const userId = session.user.id
    
    // First, get the user profile to find their organization
    const userResponse = await fetch(`${apiBaseUrl}/auth/session`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.accessToken}`
      }
    })
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: userResponse.status }
      )
    }
    
    const userData = await userResponse.json()
    const organizationId = userData.organizationId
    
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organization ID not found" },
        { status: 400 }
      )
    }
    
    // Fetch organization details
    const response = await fetch(`${apiBaseUrl}/api/organizations/${organizationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch organization settings" },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching organization settings:", error)
    return NextResponse.json(
      { message: "Failed to fetch organization settings" },
      { status: 500 }
    )
  }
}

// Update organization settings
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    // Ensure the user is authenticated
    if (!session?.user || !session.accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    
    // Get the user's organization ID from the session by fetching the user profile
    const userResponse = await fetch(`${apiBaseUrl}/auth/session`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.accessToken}`
      }
    })
    
    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: userResponse.status }
      )
    }
    
    const userData = await userResponse.json()
    const organizationId = userData.organizationId
    
    if (!organizationId) {
      return NextResponse.json(
        { message: "Organization ID not found" },
        { status: 400 }
      )
    }
    
    // Update organization details via API
    const response = await fetch(`${apiBaseUrl}/api/organizations/${organizationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        website: body.website,
        logo: body.logo,
        favicon: body.favicon,
        checkoutMessage: body.checkoutMessage
      })
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to update organization settings" },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json({
      message: "Organization settings updated successfully",
      data
    })
  } catch (error) {
    console.error("Error updating organization settings:", error)
    return NextResponse.json(
      { message: "Failed to update organization settings" },
      { status: 500 }
    )
  }
} 