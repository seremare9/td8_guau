import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const provider = searchParams.get("provider") || "google";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/callback?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/callback?error=no_code", request.url)
    );
  }

  try {
    let userData: any = {};

    if (provider === "google") {
      // Intercambiar código por token
      const clientId = process.env.GOOGLE_CLIENT_ID || "";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
      const redirectUri = `${request.nextUrl.origin}/auth/callback?provider=google`;

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Error al obtener token de Google");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Obtener datos del usuario de Google
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Error al obtener datos del usuario de Google");
      }

      userData = await userResponse.json();
    } else if (provider === "facebook") {
      // Intercambiar código por token
      const appId = process.env.FACEBOOK_APP_ID || "";
      const appSecret = process.env.FACEBOOK_APP_SECRET || "";
      const redirectUri = `${request.nextUrl.origin}/auth/callback?provider=facebook`;

      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
        {
          method: "GET",
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Error al obtener token de Facebook");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Obtener datos del usuario de Facebook
      const userResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
      );

      if (!userResponse.ok) {
        throw new Error("Error al obtener datos del usuario de Facebook");
      }

      const fbUserData = await userResponse.json();
      const nameParts = fbUserData.name?.split(" ") || [];
      userData = {
        email: fbUserData.email || "",
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        picture: fbUserData.picture?.data?.url || "",
      };
    } else if (provider === "apple") {
      // Apple Sign In requiere un manejo más complejo
      // Por ahora, retornamos datos básicos
      userData = {
        email: "",
        given_name: "",
        family_name: "",
      };
    }

    // Redirigir a la página de callback con los datos del usuario
    const normalizedData = {
      firstName: userData.first_name || userData.given_name || "",
      lastName: userData.last_name || userData.family_name || "",
      email: userData.email || "",
      picture: userData.picture || "",
    };

    return NextResponse.redirect(
      new URL(
        `/auth/callback?provider=${provider}&success=true&data=${encodeURIComponent(JSON.stringify(normalizedData))}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Error en callback OAuth:", error);
    return NextResponse.redirect(
      new URL(
        `/auth/callback?error=${encodeURIComponent((error as Error).message)}`,
        request.url
      )
    );
  }
}

