import { DAD_TRENDS } from "@/data/fixtures/dad-home";
import { DAUGHTER_FEATURE, DAUGHTER_DISCOVERY } from "@/data/fixtures/daughter-home";
import { DEMO_SOURCE_NOTICE, type DemoDetailCopy } from "@/domain/editorial-detail";

type DadSlug = (typeof DAD_TRENDS)[number]["slug"];
type DaughterSlug = typeof DAUGHTER_FEATURE.slug | (typeof DAUGHTER_DISCOVERY)[number]["slug"];

const demo = (copy: Omit<DemoDetailCopy, "kind" | "sourceNotice">) =>
  ({ kind: "demo", sourceNotice: DEMO_SOURCE_NOTICE, ...copy }) as const satisfies DemoDetailCopy;

export const DAD_DETAIL = {
  "example-favorite-word": demo({
    background: "같은 단어라도 사람마다 좋아한다는 의미는 조금씩 다릅니다. 여기서는 취향을 설명하는 대화의 한 장면을 가상으로 구성했습니다.",
    context: "‘최애’는 누군가 특별히 좋아하는 대상이나 작품을 가리키는 표현으로 사용할 수 있습니다. 실제 특정 연령대의 최근 유행을 조사한 자료는 아닙니다.",
    tip: "좋아하는 대상을 평가하거나 비교하기보다 그 이유를 듣는 방식이 자연스러울 수 있습니다.",
    conversation: "“요즘 가장 좋아하는 게 뭐야? 좋아하게 된 이유도 궁금해.”",
  }),
  "example-short-video": demo({
    background: "짧은 영상을 보며 웃는 포인트가 다를 수 있다는 상황을 합성한 예시입니다.",
    context: "영상의 앞뒤 맥락을 모르면 재미있는 장면이 잘 이해되지 않을 수 있습니다. 실제 플랫폼 분석 결과가 아닙니다.",
    tip: "설명을 요구하기보다 재미있다고 느낀 부분을 가볍게 물어보세요.",
    conversation: "“어떤 장면이 제일 재밌었어?”",
  }),
  "example-playlist": demo({
    background: "하루의 분위기에 따라 듣고 싶은 음악이 달라지는 상황을 가정했습니다.",
    context: "플레이리스트는 개인이 선호하는 음악을 묶어 듣는 한 가지 방식입니다. 특정 곡의 현재 인기 순위는 제공하지 않습니다.",
    tip: "상대의 음악을 평가하지 않고 한 곡만 추천받아도 충분합니다.",
    conversation: "“요즘 기분에 잘 맞는 노래 한 곡만 추천해줄래?”",
  }),
  "example-snack": demo({
    background: "친구와 나누는 간식이 대화의 소재가 되는 장면을 가상으로 만들었습니다.",
    context: "먹거리 취향은 다양하며 특정 제품이 현재 인기라는 뜻은 아닙니다.",
    tip: "가격이나 유행보다 어떤 맛과 경험을 좋아하는지 물어볼 수 있습니다.",
    conversation: "“요즘 먹고 싶은 간식이 있어? 함께 골라볼까?”",
  }),
  "example-personal-style": demo({
    background: "작은 소품으로 자기표현을 해보는 상황을 가정했습니다.",
    context: "꾸미기와 소품 선택은 개인 취향의 일부입니다. 성별이나 세대 모두에게 같은 취향을 적용하지 않습니다.",
    tip: "선택의 이유를 존중하고 개인 취향에 점수를 매기지 않는 편이 좋습니다.",
    conversation: "“그 소품에서 어떤 부분이 가장 마음에 들었어?”",
  }),
} as const satisfies Record<DadSlug, DemoDetailCopy>;

export const DAUGHTER_DETAIL = {
  "sample-offbeat-playlist": demo({
    background: "알려지지 않은 음악을 발견할 때 느낄 수 있는 기분을 가상 편집글로 표현했습니다.",
    context: "가상의 감상 이야기이며 실제 신곡, 인기 차트 또는 SNS 반응을 조사한 내용이 아닙니다.",
    tip: "한 번에 많은 음악을 찾기보다 마음에 드는 곡의 분위기를 기록해보세요.",
    conversation: "“이 노래의 어떤 순간이 가장 좋아?”라는 질문을 스스로에게 던져보세요.",
  }),
  "sample-beauty-notes": demo({
    background: "화장대에 놓인 물건으로 취향을 정리해보는 정물 사진 기반의 편집 예시입니다.",
    context: "사진은 주제를 표현하기 위한 이미지이고 제품 추천·광고·성분 검증 자료가 아닙니다.",
    tip: "새 제품을 고르기 전 지금 갖고 있는 제품의 사용 경험을 적어보는 것도 좋습니다.",
    conversation: "“내가 편하게 쓰는 색감은 무엇일까?”",
  }),
  "sample-cafe-dessert": demo({
    background: "공간에서 느끼는 분위기가 음식 취향에 영향을 줄 수 있다는 가상 에세이입니다.",
    context: "실제 카페 주소, 할인, 후기 평점 또는 맛 평가를 제공하지 않습니다.",
    tip: "음식 사진뿐 아니라 공간의 소리나 조명처럼 기억하고 싶은 장면을 떠올려보세요.",
    conversation: "“오늘 남기고 싶은 장면은 무엇이지?”",
  }),
  "sample-late-night-vinyl": demo({
    background: "조용한 장소에서 낯선 음악을 듣는 가상의 순간을 담았습니다.",
    context: "사진 속 레코드와 장면은 분위기 표현용으로, 실제 아티스트·음원 순위를 소개하지 않습니다.",
    tip: "음악을 듣다가 마음에 드는 부분을 짧게 적어보세요.",
    conversation: "“이 노래를 어떤 장면과 함께 기억하고 싶어?”",
  }),
} as const satisfies Record<DaughterSlug, DemoDetailCopy>;
