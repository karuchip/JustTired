import { TiredItemType, WordType } from "@/src/type";

type SendTiredPostProps = {
  selected: WordType;
  anonymousId: string;
}

type FetchTiredPostProps = {
  lastId: number;
  anonymousId: string;
}

// 初期処理
export const fetchInitialTiredData = async() => {
  const res = await fetch('/api/tired?mode=init');

  if(!res.ok) {
    throw new Error("投稿失敗")
  }
  const data = await res.json();
  return data;
}

// 投稿
export const sendTiredPost = async({selected, anonymousId}:SendTiredPostProps) => {
  const res = await fetch('/api/tired', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: selected.word,
        anonymousId,
      })
    });

    if(!res.ok) {
      throw new Error('投稿失敗');
    }

    return res.json();
}

// 差分投稿取得
export const fetchTiredPost = async({lastId, anonymousId}: FetchTiredPostProps) => {
  const res = await fetch(`/api/tired?lastId=${lastId}&anonymousId=${anonymousId}`);

  if(!res.ok) {
    throw new Error("投稿失敗");
  }
  const data: TiredItemType[] = await res.json();

  return data;

}
