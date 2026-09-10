import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "National Weather Big Data Analytics Platform";

  return new ImageResponse(
    (
      <div style={{
        fontSize: 48,
        background: "#0B0F17",
        color: "#06B6D4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        border: "4px solid #1F2937",
      }}>
        <div style={{ fontSize: 12, fontFamily: "monospace", color: "#F59E0B", marginBottom: 20 }}>
          MOES | SIH26069
        </div>
        <div style={{ fontSize: 36, fontFamily: "monospace", fontWeight: "bold", color: "white" }}>
          {title}
        </div>
        <div style={{ fontSize: 16, fontFamily: "monospace", color: "#6B7280", marginTop: 20 }}>
          National Weather Big Data Analytics Platform
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
          <div style={{ border: "2px solid #10B981", padding: "8px 16px", fontFamily: "monospace", color: "#10B981" }}>
            ● API OPERATIONAL
          </div>
          <div style={{ border: "2px solid #F59E0B", padding: "8px 16px", fontFamily: "monospace", color: "#F59E0B" }}>
            ● AI PROCESSING
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
