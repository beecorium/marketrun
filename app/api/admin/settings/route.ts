import { env } from "cloudflare:workers";
import { getD1 } from "../../../../db";

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
  const row = await getD1().prepare("SELECT survey_url, mission1_answers, mission2_code, mission3_answers FROM admin_settings WHERE id = 1").first<{
    survey_url: string;
    mission1_answers: string;
    mission2_code: string;
    mission3_answers: string;
  }>();

  return Response.json({
    surveyUrl: row?.survey_url ?? "",
    mission1Answers: parseList<string>(row?.mission1_answers ?? null, ["패", "랭", "이"]),
    mission2Code: row?.mission2_code ?? "251",
    mission3Answers: parseList<string>(row?.mission3_answers ?? null, ["황금송", "황금소나무", "소나무"]),
  });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return unauthorized();

  try {
    const payload = await request.json() as {
      surveyUrl?: string;
      mission1Answers?: string[];
      mission2Code?: string;
      mission3Answers?: string[];
    };
    const surveyUrl = String(payload.surveyUrl ?? "").trim();
    if (surveyUrl) {
      const parsed = new URL(surveyUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("유효한 네이버폼 URL을 입력해주세요.");
    }

    const mission1Answers = (payload.mission1Answers ?? [])
      .map((value) => String(value).trim().slice(0, 2))
      .filter(Boolean)
      .slice(0, 3);
    if (mission1Answers.length !== 3) throw new Error("미션 1 정답 세 글자를 모두 입력해주세요.");
    const mission2Code = String(payload.mission2Code ?? "").replace(/\D/g, "").slice(0, 3);
    if (mission2Code.length !== 3) throw new Error("미션 2 암호는 숫자 세 자리로 입력해주세요.");
    const mission3Answers = (payload.mission3Answers ?? [])
      .map((value) => String(value).trim().slice(0, 20))
      .filter(Boolean)
      .slice(0, 10);
    if (!mission3Answers.length) throw new Error("미션 3 인정 정답을 한 개 이상 입력해주세요.");

    await getD1().prepare(`
      INSERT INTO admin_settings (id, survey_url, mission1_answers, mission2_code, mission3_answers, updated_at)
      VALUES (1, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        survey_url = excluded.survey_url,
        mission1_answers = excluded.mission1_answers,
        mission2_code = excluded.mission2_code,
        mission3_answers = excluded.mission3_answers,
        updated_at = CURRENT_TIMESTAMP
    `).bind(surveyUrl, JSON.stringify(mission1Answers), mission2Code, JSON.stringify(mission3Answers)).run();

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "설정을 저장하지 못했습니다.";
    return Response.json({ error: message }, { status: 400 });
  }
}
