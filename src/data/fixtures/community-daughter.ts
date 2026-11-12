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
    excerpt: "좋아하는 음악을 놀림거리로 만든 친구 앞에서 웃어야 할지, 선을 그어야 할지 갈리는 순간.",
    body: "친구가 좋아하는 곡을 별로라고 말한 일이 내 취향까지 무시당한 기분으로 번지는 가상 상황입니다. 상대도 같은 취향을 가져야 하는 건 아니지만, 반복되는 조롱을 그냥 견뎌야 하는 것도 아닙니다. 실제 아티스트나 실제 친구 대화는 포함하지 않습니다.",
    sampleOrder: 3,
    comments: [
      sampleComment("daughter-c1", "취향이 다른 거랑 사람을 깎아내리는 건 다른 문제라고 생각해."),
      sampleComment("daughter-c2", "같이 좋아하라고 할 수는 없지만, 내 앞에서 놀리지 말라고 할 수는 있을 듯."),
    ],
  },
  {
    ...DAUGHTER_COMMUNITY[1],
    excerpt: "‘깜빡했어’라는 말이 진짜 실수인지 마음에 남는 가상 상황.",
    body: "친구들이 약속을 정했다는 사실을 나중에 알게 된 사람이 바로 물을지, 잠깐 마음을 정리할지 고민하는 가상 설정입니다. 상대의 의도를 단정하거나 실명·캡처를 공유하지 않고, 사실을 확인하고 내 감정을 표현하는 방법을 살펴봅니다. 실제 사건이 아닙니다.",
    sampleOrder: 2,
    comments: [sampleComment("daughter-c3", "추측이 커지기 전에 직접 확인하고 싶은 마음은 이해돼.")],
  },
  {
    kind: "demo-community-post",
    id: "daughter-post-demo-03",
    space: "daughter",
    board: "취향 기록",
    title: "‘그거 아직도 좋아해?’ 취향을 깎아내리는 말에 남은 것",
    excerpt: "좋아하는 취미를 말했더니 취향 평가로 돌아온 가상 이야기.",
    body: "주변에서 관심사를 유치하다고 말하는 상황을 가정한 합성 게시글입니다. 취향이 다를 수는 있지만 상대를 깎아내릴 필요는 없습니다. 불편함을 표현하거나 믿을 만한 사람과 상의하는 선택지를 담았습니다. 실제 경험담이나 작성자는 없습니다.",
    sampleOrder: 1,
    comments: [sampleComment("daughter-c4", "내가 좋아하는 걸 설명하느라 지칠 때도 있다는 말에 공감해.")],
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterDemoPost[];

export const DAUGHTER_COMMUNITY_BOARDS = ["취향 기록", "일상"] as const;
