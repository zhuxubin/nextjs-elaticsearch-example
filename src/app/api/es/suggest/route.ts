import { NextRequest, NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";

export const GET = async (req: NextRequest) => {
  let q = (req.nextUrl.searchParams.get("q") as string) || "";

  try {
    const client = new Client({ node: "http://localhost:9200" });

    const { body } = await client.search(
      {
        index: "articles",
        body: {
          suggest: {
            title_suggest: {
              prefix: q,
              completion: {
                field: "title_suggest",
                analyzer: "ik_smart",
                size: 10,
              },
            },
          },
        },
      },
      { meta: true }
    );

    const hits = body.suggest?.title_suggest[0].options || [];
    const documents = hits.map((hit) => hit._source.title_suggest);

    return NextResponse.json(documents, {
      status: 200,
    });
  } catch (error) {
    console.error("Elasticsearch Error:", error);
    return NextResponse.error();
  }
};
