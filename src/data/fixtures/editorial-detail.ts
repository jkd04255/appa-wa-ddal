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
    background: "인디 음악 플레이리스트를 소재로 만든 가상 편집글입니다.",
    context: "실제 신곡, 인기 차트 또는 SNS 반응을 조사한 내용이 아닙니다.",
    tip: "장르, 보컬, 발매 연도처럼 비교할 정보를 적어둘 수 있습니다.",
    conversation: "장르·보컬·발매 정보 중 어떤 항목을 확인할까요?",
  }),
  "sample-beauty-notes": demo({
    background: "메이크업 색상 조합을 주제로 만든 정물 사진 기반의 편집 예시입니다.",
    context: "사진은 주제를 표현하기 위한 이미지이고 제품 추천·광고·성분 검증 자료가 아닙니다.",
    tip: "색상, 용량, 전성분 표기 등 상품 정보를 확인할 수 있습니다.",
    conversation: "색상·용량·전성분 중 어떤 정보를 비교할까요?",
  }),
  "sample-cafe-dessert": demo({
    background: "카페 디저트 사진을 소재로 만든 가상 편집글입니다.",
    context: "실제 카페 주소, 할인, 후기 평점 또는 맛 평가를 제공하지 않습니다.",
    tip: "실제 방문 전 메뉴, 가격, 운영 시간을 공식 채널에서 확인하세요.",
    conversation: "메뉴·가격·운영 시간 중 어떤 정보가 필요할까요?",
  }),
  "sample-late-night-vinyl": demo({
    background: "바이닐 음반과 음악을 소재로 만든 가상 편집글입니다.",
    context: "사진 속 레코드와 장면은 분위기 표현용으로, 실제 아티스트·음원 순위를 소개하지 않습니다.",
    tip: "음반명, 발매 연도, 레이블 정보를 확인해보세요.",
    conversation: "음반명·발매 연도·레이블 중 어떤 정보가 필요할까요?",
  }),
} as const satisfies Record<DaughterSlug, DemoDetailCopy>;

