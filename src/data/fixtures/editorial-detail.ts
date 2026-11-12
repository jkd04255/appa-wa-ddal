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
    background: "좋아하는 곡에 별로라고 말했다가 “네가 팬이 맞냐”는 말까지 돌아오는 가상 장면입니다. 음악 취향의 차이가 팬 자격 심사로 번지는 순간을 따라갑니다.",
    context: "실존 아티스트나 실제 팬덤의 발언·반응·순위가 아닙니다. 인물과 곡은 모두 가상 설정입니다.",
    tip: "한 곡에 대한 감상이나 구매 내역만으로 누군가의 팬심을 판정할 수는 없습니다. 비난이 이어지면 대화를 멈출 수 있습니다.",
    conversation: "‘별로’라고 말하면 팬이 아닌 걸까요, 아니면 좋아해도 취향은 다를 수 있을까요?",
  }),
  "sample-beauty-notes": demo({
    background: "후기 사진에서는 차분해 보였던 색이 내 입술과 조명에서는 전혀 다르게 보이는 가상 구매 상황입니다. ‘후기랑 다르다’는 반응이 갈립니다.",
    context: "사진과 내용은 가상이며 실제 상품 추천·광고·성분 검증 자료가 아닙니다. 특정 제품에 대한 품질 판단도 포함하지 않습니다.",
    tip: "제품을 살 때는 공식 색상표와 실제 조명 아래 발색을 각각 확인하는 편이 좋습니다.",
    conversation: "필터가 켜진 후기 사진과 실제 발색 중, 구매 전에 무엇을 믿을 수 있을까요?",
  }),
  "sample-cafe-dessert": demo({
    background: "사진을 보고 오래 기다려 산 디저트를 한 입 먹은 뒤 반응이 싸늘하게 갈리는 가상 상황입니다. 기대와 현실의 간극을 과장된 리뷰 형식으로 다룹니다.",
    context: "실제 카페·메뉴·가격·대기 시간·후기 평점이나 맛 평가가 아닙니다.",
    tip: "방문 전 메뉴·가격·운영 시간은 해당 매장의 공식 안내에서 확인하세요.",
    conversation: "사진만 보고 기대한 것과 실제로 먹어본 것이 다르면, ‘속았다’고 느끼는 게 과할까요?",
  }),
  "sample-late-night-vinyl": demo({
    background: "최애 생일을 기념하는 광고비를 내지 않았다는 이유로 팬 자격까지 의심받는 가상 팬덤 논쟁입니다.",
    context: "실제 팬덤·아티스트·광고 모금·굿즈 판매를 다룬 내용이 아닙니다. 모든 참여자와 상황은 가상입니다.",
    tip: "굿즈를 사는지 여부만으로 누군가의 팬심을 판단할 수는 없습니다.",
    conversation: "돈을 보태지 않았다는 이유로 응원할 자격까지 없다고 할 수 있을까요?",
  }),
  "sample-fan-rule": demo({
    background: "굿즈를 사지 않았다는 이유로 “팬도 아니다”라는 말을 듣는 가상 댓글 논쟁입니다. 취향이 지출 능력을 시험하는 상황을 묻습니다.",
    context: "실제 댓글·커뮤니티 반응, 아티스트, 팬덤을 가리키지 않는 합성 시나리오입니다.",
    tip: "취향을 즐기는 방식과 지출 여력은 사람마다 다릅니다.",
    conversation: "팬심을 결제 내역으로 증명해야 할까요? 지출 여력이 다르면 응원할 자격도 달라질까요?",
  }),
  "sample-group-chat": demo({
    background: "단체 사진에는 모두 있는데 약속은 자신만 몰랐던 가상 장면입니다. “너한테 말한 줄 알았어”라는 답을 실수로 넘길지, 다음 행동까지 보고 판단할지 의견이 갈립니다.",
    context: "실제 단체 대화·실명·학교 정보나 누구의 경험도 포함하지 않습니다. 특정인을 겨냥한 폭로가 아닙니다.",
    tip: "추측으로 단정하기보다 사실을 확인하고, 불편함이 계속되면 믿을 만한 사람과 상의할 수 있습니다.",
    conversation: "사진은 모두 봤는데 나만 초대받지 못했다면, ‘실수’라는 말만으로 풀릴까요?",
  }),
  "sample-joke-boundary": demo({
    background: "싫다고 말했는데 비슷한 농담이 세 번 더 반복되는 가상 상황입니다. 듣는 사람이 예민한지보다, 그만해달라는 말을 들은 뒤에도 계속한 행동이 괜찮은지 묻습니다.",
    context: "실제 대화·특정 개인·실제 학교를 묘사하지 않는 합성 사례입니다.",
    tip: "불편하다고 표현한 뒤에도 반복된다면 믿을 만한 어른이나 지원자에게 도움을 요청할 수 있습니다.",
    conversation: "그만해달라는 말을 세 번 무시한 것도 ‘장난’으로 끝낼 수 있을까요?",
  }),
} as const satisfies Record<DaughterSlug, DemoDetailCopy>;
