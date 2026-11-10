import { DAD_COMMUNITY_PREVIEW } from "@/data/fixtures/dad-home";
import type { DadDemoPost } from "@/domain/community-demo";

const sampleComment = (id: string, body: string) => ({
  kind: "demo-comment",
  id,
  body,
  demoNotice: "샘플 댓글 · 실제 작성된 의견이 아닙니다",
} as const);

export const DAD_COMMUNITY_POSTS = [
  {
    ...DAD_COMMUNITY_PREVIEW[0],
    excerpt: "상대의 관심사를 존중하면서 대화를 시작하는 작은 방법을 생각해봅니다.",
    body: "질문을 한꺼번에 던지기보다, 관심 있는 것을 하나 골라 부담 없이 물어보는 상황을 가상으로 써봤습니다. 답을 강요하지 않고 듣는 연습을 해보려 합니다.",
    sampleOrder: 3,
    comments: [
      sampleComment("dad-c1", "설명을 재촉하지 않고 기다려보는 장면을 떠올려봤습니다."),
      sampleComment("dad-c2", "정답을 알아야 하는 대화는 아닐 수도 있겠습니다."),
    ],
  },
  {
    ...DAD_COMMUNITY_PREVIEW[1],
    excerpt: "취향이 다르더라도 가볍게 시간을 나누는 방법을 고민해봅니다.",
    body: "함께 할 일을 정할 때 서로 좋아하는 것이 달라 난감한 가상 상황입니다. 누가 먼저 양보해야 하는지보다 각자 하고 싶은 일을 하나씩 말해보는 장면을 생각했습니다.",
    sampleOrder: 2,
    comments: [sampleComment("dad-c3", "둘의 선택지를 한 번씩 들어보는 연습도 좋겠습니다.")],
  },
  {
    kind: "demo-community-post",
    id: "dad-post-demo-03",
    space: "dad",
    board: "함께 고민",
    title: "말을 많이 하지 않아도 함께할 수 있을까요?",
    excerpt: "대화량보다 편안한 시간을 기준으로 생각해보는 샘플 질문.",
    body: "아무 말 없이 책을 읽거나 산책하는 시간을 가상 사례로 만들었습니다. 침묵이 항상 불편함을 뜻하는 것은 아니라는 관점도 떠올려볼 수 있습니다.",
    sampleOrder: 1,
    comments: [sampleComment("dad-c4", "짧게 같이 걷는 장면도 대화의 시작이 될 수 있겠습니다.")],
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DadDemoPost[];

export const DAD_COMMUNITY_BOARDS = ["함께 고민", "일상"] as const;
