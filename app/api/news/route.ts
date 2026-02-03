import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const response = await fetch("https://padel-magazine.pt/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const news: Array<{
      title: string;
      link: string;
      source: string;
      contentSnippet: string;
    }> = [];

    // Seleciona os artigos recentes - tenta múltiplos seletores
    const selectors = [
      "article h2 a",
      "article h3 a",
      ".post-title a",
      ".entry-title a",
      "h2.entry-title a",
      "h3.entry-title a",
    ];

    let found = false;
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        if (i >= 15) return false; // Limita a 15 notícias

        const $elem = $(elem);
        const title = $elem.text().trim();
        const link = $elem.attr("href");

        if (title && link && title.length > 10) {
          news.push({
            title,
            link,
            source: "Padel Magazine",
            contentSnippet: "",
          });
          found = true;
        }
      });

      if (found && news.length > 0) break;
    }

    // Fallback se não conseguir extrair notícias
    if (news.length === 0) {
      return NextResponse.json({
        news: [
          {
            title: "Padel Magazine Portugal",
            link: "https://padel-magazine.pt/",
            source: "Padel Magazine",
            contentSnippet: "As últimas notícias do mundo do padel",
          },
        ],
      });
    }

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error fetching news:", error);

    // Fallback em caso de erro
    return NextResponse.json({
      news: [
        {
          title: "Padel Magazine Portugal",
          link: "https://padel-magazine.pt/",
          source: "Padel Magazine",
          contentSnippet: "As últimas notícias do mundo do padel",
        },
      ],
    });
  }
}
