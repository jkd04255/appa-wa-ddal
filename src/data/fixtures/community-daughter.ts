import { DAUGHTER_COMMUNITY } from "@/data/fixtures/daughter-home";
import type { DaughterDemoPost } from "@/domain/community-demo";

const sampleComment = (id: string, body: string) => ({
  kind: "demo-comment",
  id,
  body,
  demoNotice: "샘플 댓글 · 실제 작성된 의견이 아닙니다",
} as const);

export const DAUGHTER_COMMUNITY_POSTS = [
  {
    ...DAUGHTER_COMMUNITY[0],
    excerpt: "곡을 별로라고 했을 뿐인데 팬 자격까지 심사받는 상황. 어디까지 받아줘야 할까?",
    body: "친구가 좋아하는 곡을 별로라고 했다는 이유로 “팬도 아니네”라는 말까지 듣는 가상 상황입니다. 취향 차이가 사람의 자격을 심사하는 말로 바뀌면 어디까지 받아줘야 할까요? 실존 아티스트·팬덤 발언·친구 대화는 포함하지 않습니다.",
    sampleOrder: 3,
    comments: [
      sampleComment("daughter-c1", "취향이 다른 거랑 사람을 깎아내리는 건 다른 문제라고 생각해."),
      sampleComment("daughter-c2", "같이 좋아하라고 할 수는 없지만, 내 앞에서 놀리지 말라고 할 수는 있을 듯."),
    ],
  },
  {
    ...DAUGHTER_COMMUNITY[1],
    excerpt: "단체 사진엔 다 있는데 약속은 나만 몰랐다. ‘너한테 말한 줄’이 진짜 실수일까?",
    body: "단체 사진에는 모두 있는데 약속은 혼자만 몰랐던 가상 장면입니다. “너한테 말한 줄”이라는 답을 실수로 넘길지, 다음 행동까지 보고 판단할지 의견이 갈립니다. 실명·캡처·학교 정보는 없고 실제 사건이 아닙니다.",
    sampleOrder: 2,
    comments: [sampleComment("daughter-c3", "추측이 커지기 전에 직접 확인하고 싶은 마음은 이해돼.")],
  },
  {
    kind: "demo-community-post",
    id: "daughter-post-demo-03",
    space: "daughter",
    board: "취향 기록",
    title: "싫다고 말했는데 세 번 더… 아직도 ‘장난’이라고 넘겨야 하나?",
    excerpt: "싫다고 말한 뒤에도 같은 농담이 반복되는 가상 상황입니다. ‘예민하다’고 몰아가기 전에 그만해달라는 말을 들은 뒤의 행동을 봅니다.",
    body: "그만해달라고 말한 뒤에도 놀림이 이어지는 상황을 가정한 합성 게시글입니다. 상대를 공격하거나 신상을 공개하는 방식 대신, 경계를 다시 말하고 안전한 사람에게 도움을 구하는 선택지를 담았습니다. 실제 경험담이나 작성자는 없습니다.",
    sampleOrder: 1,
    comments: [sampleComment("daughter-c4", "내가 좋아하는 걸 설명하느라 지칠 때도 있다는 말에 공감해.")],
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterDemoPost[];

export const DAUGHTER_COMMUNITY_BOARDS = ["취향 기록", "일상"] as const;
