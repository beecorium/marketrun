import { getD1 } from "../../../db";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      rating?: number;
      favoritePoint?: number;
      comment?: string;
    };
    const rating = Number(payload.rating);
    const favoritePoint = Number(payload.favoritePoint);
    const comment = String(payload.comment ?? "").trim().slice(0, 300);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "만족도를 선택해주세요." }, { status: 400 });
    }
    if (!Number.isInteger(favoritePoint) || favoritePoint < 1 || favoritePoint > 5) {
      return Response.json({ error: "가장 기억에 남는 미션을 선택해주세요." }, { status: 400 });
    }

    const result = await getD1()
      .prepare("INSERT INTO survey_responses (rating, favorite_point, comment) VALUES (?, ?, ?)")
      .bind(rating, favoritePoint, comment)
      .run();

    return Response.json({ ok: true, id: result.meta.last_row_id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "설문을 저장하지 못했습니다.";
    return Response.json({ error: message }, { status: 500 });
  }
}
