module.exports = async (req, res) => {
    // 카카오 챗봇 요청 처리
    const body = req.body;
    
    // 영수증 이미지 URL 확인
    const imageUrl = body?.userRequest?.params?.receipt_image;

    // 카카오 오픈빌더 규격에 맞춰 응답
    res.status(200).json({
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: "🎉 Vercel과 GitHub로 연결된 스킬 API 응답입니다!\n인증이 완료되었습니다."
                    }
                }
            ]
        }
    });
};