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
    background: "하루의 분위기에 따라 듣고 싶은 음악이 달라지는 상황을 가상으로 만들었습니다.",
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
    background: "친구들이 같은 추천곡을 두고 정반대 반응을 보이는 상황을 가정한 가상 편집글입니다.",
    context: "특정 아티스트나 팬덤의 실제 발언·반응·순위를 소개하지 않습니다.",
    tip: "좋아함과 별로라는 의견이 달라도 상대의 취향을 공격하지 않고 이유를 나눌 수 있습니다.",
    conversation: "취향이 다를 때 팬심이나 우정을 증명하라고 요구할 필요가 있을까요?",
  }),
  "sample-beauty-notes": demo({
    background: "같은 립 색도 조명과 카메라에 따라 달라 보일 수 있다는 가상 비교입니다.",
    context: "사진은 분위기를 위한 예시이며 실제 상품 추천·광고·성분 검증 자료가 아닙니다.",
    tip: "제품을 살 때는 공식 색상표와 실제 조명 아래 발색을 각각 확인하는 편이 좋습니다.",
    conversation: "화면 속 색과 실제 색이 다를 때 무엇을 먼저 확인하고 싶나요?",
  }),
  "sample-cafe-dessert": demo({
    background: "완벽한 사진과 실제 기대가 다를 수 있는 상황을 만든 가상 편집글입니다.",
    context: "실제 카페 주소, 할인, 후기 평점 또는 맛 평가를 제공하지 않습니다.",
    tip: "방문 전 메뉴·가격·운영 시간은 해당 매장의 공식 안내에서 확인하세요.",
    conversation: "사진에서 받은 기대와 실제 경험이 달랐던 상황을 어떻게 설명할 수 있을까요?",
  }),
  "sample-late-night-vinyl": demo({
    background: "팬심을 소비 기준과 연결해 서로 다른 의견이 부딪히는 가상 토론입니다.",
    context: "실제 팬덤·아티스트의 반응이나 굿즈 판매 현황을 조사한 내용이 아닙니다.",
    tip: "굿즈를 사는지 여부만으로 누군가의 팬심을 판단할 수는 없습니다.",
    conversation: "팬심을 소비량으로 증명해야 한다는 말에 동의하나요?",
  }),
  "sample-fan-rule": demo({
    background: "굿즈를 사지 않으면 팬이 아니라는 말에 의견이 갈리는 가상 사례입니다.",
    context: "실제 댓글·커뮤니티 반응이나 특정 아티스트에 관한 이야기가 아닙니다.",
    tip: "취향을 즐기는 방식과 지출 여력은 사람마다 다릅니다.",
    conversation: "좋아하는 마음을 소비와 분리할 수 있을까요?",
  }),
  "sample-group-chat": demo({
    background: "약속에서 빠진 것처럼 느낀 사람이 상황을 확인할지 고민하는 가상 시나리오입니다.",
    context: "실제 단체 대화·실명·학교 정보가 없으며 누구의 경험이라고 주장하지 않습니다.",
    tip: "추측으로 결론을 내리기 전에 안전하다고 느끼는 방식으로 사실을 확인할 수 있습니다.",
    conversation: "‘실수였어’라는 답이 왔을 때 무엇을 더 확인하고 싶나요?",
  }),
  "sample-joke-boundary": demo({
    background: "친구는 장난이라고 했지만 듣는 사람은 불편했던 가상 상황입니다.",
    context: "실제 대화나 특정 개인을 묘사하지 않습니다.",
    tip: "불편하다고 표현한 뒤에도 반복된다면 믿을 만한 어른이나 지원자에게 도움을 요청할 수 있습니다.",
    conversation: "농담과 상처 주는 말의 경계는 누가 정해야 할까요?",
  }),
} as const satisfies Record<DaughterSlug, DemoDetailCopy>;
