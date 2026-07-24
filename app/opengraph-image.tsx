import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";
export const alt = "Nguồn Nhà Đất Việt Nam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const h = React.createElement;

export default async function OpengraphImage() {
    return new ImageResponse(
          h(
                  "div",
            { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)", color: "white", fontFamily: "sans-serif", textAlign: "center", padding: "0 60px" } },
                  h("div", { style: { fontSize: 76, fontWeight: 700, letterSpacing: -2 } }, "Nguồn Nhà Đất Việt Nam"),
                  h("div", { style: { fontSize: 34, marginTop: 24, opacity: 0.92 } }, "Sàn đăng tin bất động sản toàn quốc"),
                  h("div", { style: { fontSize: 26, marginTop: 12, opacity: 0.85 } }, "Nhà phố · Đất nền · Căn hộ · Cho thuê")
                ),
      { width: size.width, height: size.height }
        );
}
