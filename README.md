# 코드 시커(Code Seeker)

Electron · React · TypeScript, **node-llama-cpp** 기반의 오프라인 AI 코드 리뷰어입니다.

- 시연 영상
  https://triangular-nest-0f1.notion.site/CodeSeeker-2161baec04bd80f284beeaa4e064f03d

---

## 주요 기능(1차 MVP)

- **로컬 LLM** – 코드 리뷰`qwen2.5-coder-1.5b-instruct-q4_k_m.gguf`, 번역`tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf` llm 모델 적용
- **프로젝트 선택 및 리뷰 진행** – 리뷰 프로젝트 폴더를 지정 후, 파일 단위로 코드리뷰 진행이 가능합니다.
- **Markdown 리포트** – 시니어 개발자 입장에서 코드 리뷰를 진행 후, 결과를 마크다운 형식으로 출력해줍니다.

---

## 빠른 시작

```bash
# 사전 조건: Node 18+, pnpm 9+
git clone https://github.com/lunaticscode/code-seeker.git
cd code-seeker
pnpm install

# 위 모델(GGUF) 파일을 다운받아서 ./model 폴더에 넣어주세요.
pnpm dev        # 개발 모드 실행
pnpm build      # 설치 파일 생성 (스크립트 참고)
```
