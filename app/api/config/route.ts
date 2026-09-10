import { getD1 } from "../../../db";

const defaultBenefits = [
  { shop: "수산·건어물 제휴점", benefit: "2만원 이상 구매 시 3,000원 할인" },
  { shop: "먹거리 제휴점", benefit: "1만원 이상 구매 시 1,000원 할인" },
  { shop: "로컬푸드·청과 제휴점", benefit: "구매금액 10% 할인" },
  { shop: "프리마켓 참여점포", benefit: "1만원 이상 구매 시 사은품 증정" },
];

function parseList<T>(value: string | null, fallback: T[]): T[] {
  if (value === null) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as T[] : fallback;
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    const row = await getD1().prepare("SELECT survey_url, mission1_answers, mission2_code, mission3_answers FROM admin_settings WHERE id = 1").first<{
      survey_url: string;
      mission1_answers: string;
      mission2_code: string;
      mission3_answers: string;
    }>();

    return Response.json({
      surveyUrl: row?.survey_url?.trim() || "https://naver.me/5T0ElUPI",
      mission1Answers: parseList<string>(row?.mission1_answers ?? null, ["패", "랭", "이"]),
      mission2Code: row?.mission2_code?.trim() || "251",
      mission3Answers: parseList<string>(row?.mission3_answers ?? null, ["황금송", "황금소나무", "소나무"]),
      benefits: [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "운영 설정을 불러오지 못했습니다.";
    return Response.json({ error: message }, { status: 500 });
  }
}
