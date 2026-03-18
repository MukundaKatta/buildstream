import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const appType = searchParams.get("app_type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase
      .from("workflows")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq("status", status);
    if (appType) query = query.eq("app_type", appType);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      workflows: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { name, description, app_type, blocks, edges, variables } = body;

    if (!name || !app_type) {
      return NextResponse.json({ error: "Name and app_type are required" }, { status: 400 });
    }

    const workflow = {
      name,
      description: description || "",
      app_type,
      blocks: blocks || [],
      edges: edges || [],
      variables: variables || [],
      created_by: "user-1",
      team_id: "team-1",
      is_public: false,
      version: 1,
      status: "draft",
    };

    const { data, error } = await supabase
      .from("workflows")
      .insert(workflow)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ workflow: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
