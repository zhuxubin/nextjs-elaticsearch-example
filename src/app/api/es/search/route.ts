import { NextRequest, NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";

export const GET = async (req: NextRequest) => {
  let size = (req.nextUrl.searchParams.get("size") as any) * 1 || 100;
  let page = (req.nextUrl.searchParams.get("page") as any) * 1 || 1;
  let from = (page - 1) * size;
  let q = (req.nextUrl.searchParams.get("q") as string) || "";

  try {
    const client = new Client({ node: "http://localhost:9200" });
    const { body } = await client.search(
      {
        from: from,
        size: size,
        index: "articles",
        query: {
          // match_all: {},
          multi_match: {
            query: q,
            fields: ["title", "content"],
            analyzer: "ik_smart",
          },
        },
        sort: [{ id: { order: "desc" } }],
        highlight: {
          fields: {
            content: {
              pre_tags: ["<span style='color:red'>"],
              post_tags: ["</span>"],
            },
          },
        },
      },
      { meta: true }
    );

    const hits = body.hits?.hits || [];
    const documents = hits.map((hit) => {
      hit._source.content = hit.highlight?.content[0] || hit._source.content;
      return hit._source;
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Elasticsearch Error:", error);
    return NextResponse.error();
  }
};
