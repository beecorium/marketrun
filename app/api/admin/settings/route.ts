import { env } from "cloudflare:workers";
import { getD1 } from "../../../../db";

type Benefit = { shop: string; benefit: string };
const defaultBenefits: Benefit[] = [
  { shop: "수산·건어물 제휴점", benefit: "2만원 이상 구매 시 3,000원 할인" },
  { shop: "먹거리 제휴점", benefit: "1만원 이상 구매 시 1,000원 할인" },
  { shop: "로컬푸드·청과 제휴점", benefit: "구매금액 10% 할인" },
  { shop: "프리마켓 참여점포", benefit: "1만원 이상 구매 시 사은품 증정" },
];

function authorized(request: Request) {
  const configured = (env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD;
  const supplied = request.headers.get("x-admin-password");
  return Boolean(configured && supplied && supplied === configured);
}

function unauthorized() {
  return Response.json({ error: "관리자 비밀번호가 올바르지 않습니다." }, { status: 401 });
}

function parseList<T>(value: string | null, fallback: T[]): T[] {
  if (value === null) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as T[] : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) return unauthorized();
  const row = await getD1().prepare("SELECT survey_url, point3_answers, benefits FROM admin_settings WHERE id = 1").first<{
    survey_url: string;
    point3_answers: string;
    benefits: string;
  }>();

  return Response.json({
    surveyUrl: row?.survey_url ?? "",
    point3Answers: parseList<string>(row?.point3_answers ?? null, ["보령공방"]),
    benefits: parseList<Benefit>(row?.benefits ?? null, defaultBenefits),
  });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return unauthorized();

  try {
    const payload = await request.json() as {
      surveyUrl?: string;
      point3Answers?: string[];
      benefits?: Benefit[];
    };
    const surveyUrl = String(payload.surveyUrl ?? "").trim();
    if (surveyUrl) {
      const parsed = new URL(surveyUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("유효한 네이버폼 URL을 입력해주세요.");
    }

    const point3Answers = (payload.point3Answers ?? [])
      .map((value) => String(value).trim().slice(0, 80))
      .filter(Boolean)
      .slice(0, 30);
    const benefits = (payload.benefits ?? [])
      .map((item) => ({ shop: String(item.shop ?? "").trim().slice(0, 80), benefit: String(item.benefit ?? "").trim().slice(0, 160) }))
      .filter((item) => item.shop && item.benefit)
      .slice(0, 30);

    await getD1().prepare(`
      INSERT INTO admin_settings (id, survey_url, point3_answers, benefits, updated_at)
      VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        survey_url = excluded.survey_url,
        point3_answers = excluded.point3_answers,
        benefits = excluded.benefits,
        updated_at = CURRENT_TIMESTAMP
    `).bind(surveyUrl, JSON.stringify(point3Answers), JSON.stringify(benefits)).run();

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "설정을 저장하지 못했습니다.";
    return Response.json({ error: message }, { status: 400 });
  }
}
