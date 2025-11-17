import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Leer el archivo desde components/breeds.csv
    const filePath = join(process.cwd(), "components", "breeds.csv");
    const fileContents = await readFile(filePath, "utf-8");
    
    // Retornar el contenido del CSV
    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error leyendo breeds.csv:", error);
    return NextResponse.json(
      { error: "No se pudo cargar el archivo de razas" },
      { status: 500 }
    );
  }
}

