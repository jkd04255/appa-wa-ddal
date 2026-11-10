# G1-05 사진 사용권·자산 관리 기록

> 최초 작성: 2026-11-11 KST
> 범위: 딸 공간 G1-05 정적 홈의 분위기 사진 4개
> 목적: 사진 중심 편집 디자인의 시연 — 사진이 실제 유행, 쇼핑 상품, 게시물 또는 당사자를 증명하지 않음

## 출처 및 사용권

아래 이미지는 **Unsplash에서 각 사진 페이지의 ‘Free to use under the Unsplash License’ 표기를 확인한 뒤** 시연용으로 채택했습니다. 원본 사이트·사진 작가 정보를 보존하며, 다운로드 시 1000px 너비·JPEG 설정으로 축소해 저장소에 자체 보관합니다. 사이트 방문자는 Unsplash로 직접 이미지 요청을 보내지 않습니다.

| 저장 경로 | 사진 설명 / 기여자 | 원본 사진 페이지 |
| --- | --- | --- |
| `public/editorial/headphones-magazine.jpg` | 잡지 위 헤드폰 / N1CE | https://unsplash.com/photos/black-headphones-resting-on-a-magazine-YoYEaWHqKqA |
| `public/editorial/beauty-stilllife.jpg` | 립스틱과 과일 정물 / Co Tan | https://unsplash.com/photos/a-lipstick-and-some-fruit-on-a-table-L_0g0Tkj4pI |
| `public/editorial/cafe-dessert.jpg` | 카페의 아이스커피와 디저트 / Seungmin Yoon | https://unsplash.com/photos/two-iced-coffees-and-a-pastry-on-a-table-dVKIpaoSAyU |
| `public/editorial/vinyl-night.jpg` | 턴테이블과 레코드 / Marija Zaric | https://unsplash.com/photos/record-player-with-a-vinyl-record-spinning-u_d17v_Buqk |

**원본 라이선스:** https://unsplash.com/license

Unsplash License는 사진의 일반적인 다운로드·상업적/비상업적 사용을 허용하며 표기는 강제하지 않지만 권장합니다. 단, 사진에 나타난 상표·저작물·특정 인물·특정 장소에 대해서는 별도 권리가 있을 수 있습니다. 실제 공개 사이트에서 사용하기 전에 광고/프로모션 맥락을 다시 검토합니다. 본 이미지는 특정 인물의 사연이나 실제 브랜드 제품 혜택을 나타내지 않습니다.

## 다운로드 및 검증

- 첫 다운로드 시도: Unsplash 다운로드 페이지가 401을 반환해 실패. 이를 성공으로 처리하지 않음.
- 조치: 각 사진 페이지가 제공하는 정확한 Unsplash **이미지 CDN 경로**를 재확인하고 같은 사진을 파일로 저장.
- GitHub Actions 임시 작업에서 네 JPEG의 MIME 타입, 15KB 이상~3.5MB 미만 크기를 검사한 후 **feature 브랜치에 바이너리 이미지 4개를 커밋**.
- 저장소 디렉터리의 4개 이미지 파일/크기를 GitHub API로 재조회한 뒤, 일회성 이미지 가져오기 워크플로를 삭제함.
- Next.js `Image`를 사용하여 4:5 카드, 반응형 sizes, 우선 로딩 히어로와 지연 로딩 3개 이미지를 구현. 이미지가 실제로 로드되는지와 `alt`가 있는지 Playwright에서 검증.
- 자산은 저장소 내부 제공이므로 제3자 추적 이미지 URL, API 키, 사이트 측 분석·쿠키 전송은 추가되지 않음.
- 향후 실제 콘텐츠가 확보되면 해당 콘텐츠별 사진 출처·권리·초상권과 대체 텍스트를 별도로 검증해야 함. **이번 4개 자산은 주제 분위기 표현용 사진**임.

## 안전 및 접근성 경계

- 인물 얼굴·미성년자 초상·SNS 사용자 게시물 원문·학교명·구체 위치 등을 사진에 묶지 않음.
- 진짜 할인/인기/응답/검증된 출처처럼 보이는 정보를 이미지 주변에 임의로 생성하지 않음.
- 현 단계에 해당 사용권 기록은 있으며 실기기 사파리·안드로이드 이미지 렌더링/네트워크 검증은 별도 진행 필요.
