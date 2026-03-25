import {
  deleteUserIntegration,
  getIntegration,
  getUserByClerkId,
} from "@/db/queries";
import { decrypt } from "@/lib/encryption";
import { createOAuth2Client, type GoogleProvider } from "@/lib/google";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PROVIDERS: GoogleProvider[] = ["gmail", "google_calendar"];

function isGoogleProvider(value: string): value is GoogleProvider {
  return ALLOWED_PROVIDERS.includes(value as GoogleProvider);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await context.params;
  if (!isGoogleProvider(providerParam)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  const provider = providerParam;

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse(null, { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return new NextResponse(null, { status: 404 });
  }

  const integration = await getIntegration(user.id, provider);
  if (!integration) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const oauth2Client = createOAuth2Client();
    const accessToken = decrypt(integration.accessToken);
    const refreshToken = decrypt(integration.refreshToken);
    let revoked = false;
    // Refresh tokens revoke reliably; access tokens sometimes return "Token is not revocable."
    for (const token of [refreshToken, accessToken]) {
      try {
        await oauth2Client.revokeToken(token);
        revoked = true;
        break;
      } catch {
        /* try the other token */
      }
    }
    if (!revoked) {
      console.warn(
        `[integrations] Could not revoke ${provider} with Google (token may already be invalid). Local disconnect completed.`,
      );
    }
  } catch (error) {
    console.warn(
      `[integrations] Revoke step error for ${provider}; local disconnect still applied.`,
      error instanceof Error ? error.message : error,
    );
  }

  await deleteUserIntegration(user.id, provider);
  return new NextResponse(null, { status: 204 });
}
