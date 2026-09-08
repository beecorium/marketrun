# GitHub 업로드 안내

## 권장 방식: 비공개 저장소

행사 미션 정답이 소스에 포함되어 있으므로 GitHub 저장소는 `Private`으로 만드는 것을 권장합니다.

1. GitHub에서 `New repository`를 선택합니다.
2. 저장소 이름을 입력하고 `Private`을 선택합니다.
3. README, `.gitignore`, License 자동 생성은 선택하지 않습니다.
4. 제공된 ZIP 파일을 압축 해제합니다.
5. 압축을 푼 폴더 **안의 전체 파일과 폴더**를 GitHub 저장소에 업로드합니다.
6. 실제 관리자 비밀번호나 `.env` 파일은 업로드하지 않습니다.

## Git 명령어로 업로드

```bash
git init
git add .
git commit -m "Initial source upload"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

## 유의사항

- GitHub Pages만으로는 D1 데이터베이스와 관리자 API를 실행할 수 없습니다.
- 소스 보관은 GitHub에서 가능하지만, 현재 기능 전체를 운영하려면 Cloudflare Workers/D1 또는 이에 준하는 서버 배포 환경이 필요합니다.
- 카메라 인증사진 기능은 HTTPS 주소에서 사용해야 합니다.
