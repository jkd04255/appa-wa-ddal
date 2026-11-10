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
    excerpt: "한 곡을 여러 번 듣게 되는 이유를 떠올리는 가상 이야기.",
    body: "좋아하는 곡을 이어폰으로 반복해서 듣는 장면을 가상으로 구성했습니다. 같은 곡이라도 그날의 기분에 따라 다르게 들린다는 취향 기록입니다.",
    sampleOrder: 3,
    comments: [
      sampleComment("daughter-c1", "곡의 처음보다 마지막 부분이 더 오래 기억나는 장면을 상상했어요."),
      sampleComment("daughter-c2", "비 오는 날에 듣는 플레이리스트라는 주제도 재밌겠어요."),
    ],
  },
  {
    ...DAUGHTER_COMMUNITY[1],
    excerpt: "카페, 독서, 음악 중 하나를 고르는 조용한 주말의 상상.",
    body: "집에서 음악을 듣거나 가벼운 산책을 나가는 어느 주말을 가상으로 써봤습니다. 혼자 보내는 시간이 늘 심심한 것만은 아니라는 취향의 예시입니다.",
    sampleOrder: 2,
    comments: [sampleComment("daughter-c3", "새로운 음악 한 곡을 찾아보는 주말을 떠올렸어요.")],
  },
  {
    kind: "demo-community-post",
    id: "daughter-post-demo-03",
    space: "daughter",
    board: "취향 기록",
    title: "작은 물건으로 꾸미는 나만의 책상",
    excerpt: "소품의 색감만으로 달라지는 책상 분위기를 상상한 노트.",
    body: "잡지와 스티커를 조합한 책상을 머릿속에 그려봤습니다. 남들이 좋아하는 방식이 아니라 내가 편안하다고 느끼는 분위기부터 찾는 샘플 이야기입니다.",
    sampleOrder: 1,
    comments: [sampleComment("daughter-c4", "비슷한 색조의 물건을 모으는 설정이 마음에 들어요.")],
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterDemoPost[];

export const DAUGHTER_COMMUNITY_BOARDS = ["취향 기록", "일상"] as const;
