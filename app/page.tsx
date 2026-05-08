"use client"
import { getAnonymousId } from "@/src/lib/anonymousUser";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TiredButton from "./components/tired-button";

type Stamp = {
  id: number;
  text: string;
  left: number;
}

type Word = {
  id: number;
  word: string;
}

type TiredItem = {
  id: number;
  text: string;
  created_at: Date;
}

export default function Home() {

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [disable, setDisable] = useState(false);
  const idRef = useRef(0);
  // DBから取得した値
  const [list, setList] = useState<Stamp[]>([]);

  // 一度表示したスタンプのidは保存
  const lastIdRef = useRef(0);

  // 初期化終わるまでfetchしないためのフラグ
  const [initialized, setInitialized] = useState(false);

  // 匿名ID保存用のref
  const anonymousIdRef = useRef<string | null>(null)

  const words:Word[] = [
    {
      id: 1,
      word: "疲れた"
    },
    {
      id:2,
      word:"お腹すいた",
    },
    {
      id:3,
      word:"よくやった"
    },
    {
      id:4,
      word:"えらすぎ"
    }
  ]

  // 初期化処理 (現在のID)
  useEffect(() => {
    const init = async () => {

      // ①匿名ID準備
      anonymousIdRef.current = getAnonymousId();

      // ②現在の最大投稿ID取得
      const res = await fetch('/api/tired?mode=init');
      const data = await res.json();

      lastIdRef.current = data.max_id ?? 0;

      // ③初期化完了
      setInitialized(true);
    };

    init();
  }, []);

  // 差分だけ取得
  useEffect(() => {
    if(!initialized) return;

    const fetchData = async () => {
      const res = await fetch(`/api/tired?lastId=${lastIdRef.current}&anonymousId=${anonymousIdRef.current}`);
      const data: TiredItem[] = await res.json();

      setList(prev => {

        const existingIds = new Set(prev.map(p => p.id));

        const newItems = data
        .filter(item => !existingIds.has(item.id))
        .map((item: TiredItem) => ({
          id: item.id,
          text: item.text,
          left: Math.random() * 80
        }));

        // 最新IDに更新
        if (data.length > 0) {
          lastIdRef.current = data[data.length -1].id;
        }

        return [...prev, ...newItems];
      })
    }

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [initialized])


  // 疲れたボタン押下時
  const handleSendStamp = async(type: number) => {

    if(disable) return;

    setDisable(true);

    const selected = words.find(item => item.id === type);
    if(!selected) return;

    const newStampId = ++idRef.current;

    // ①まず画面に表示
    setStamps((prev) => [
      ...prev,
      {
        id: newStampId,
        text: selected.word,
        left: Math.random() * 80
      }
    ]);

    // ②一定時間後に画面から削除
    setTimeout(() => {
      setStamps((prev) => prev.filter(s => s.id !== newStampId));
    }, 20000);


    // ③バックグラウンドでDBに保存
    await fetch('/api/tired', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: selected.word,
        anonymousId: anonymousIdRef.current
      })
    });

    setTimeout(() => {
      setDisable(false);
    }, 1000);
  };

  return (
    <div>

      <div className="relative z-100">
        <div className="mt-10">
          <h1 className="text-[#ffffff] text-[32px] md:text-[68px] w-fit mx-auto">Just Tired</h1>
          <h2 className="text-[#ffffff] w-fit mx-auto text-[16px] md:text-[22px]">疲れたって言いたい！</h2>
        </div>

        <div className="relative h-[500px] md:h-[600px] my-10 overflow-x-hidden">
          {/* 自分が押下した分の表示 */}
          <div className="absolute left-0 top-0 w-full h-full">
            {stamps.map((stamp) => (
              <div key={`self-${stamp.id}`}>

                <p
                className="
                  absolute animate-float font-bold text-[26px] md:text-[42px] whitespace-nowrap
                  /* 文字の色：少し薄い色にすると光って見えます */
                  text-[#ffffff]
                  /* ネオンエフェクト（外側の光） */
                  drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]
                  drop-shadow-[0_0_30px_rgba(79,70,229,0.5)]

                  /* 縁取り（よりクッキリさせる場合） */
                  [text-shadow:_0_0_10px_rgba(79,70,229,0.8),_0_0_20px_rgba(79,70,229,0.4)]
                "
                style={{
                  left: `${stamp.left}%`,
                }}
                >
                  {stamp.text}
                </p>

                <p
                  className="
                    absolute animate-slide w-fit whitespace-nowrap
                    text-[80px] md:text-[160px] font-black

                    /* 文字の色：少し薄い色にすると光って見えます */
                    text-indigo-100

                    /* ネオンエフェクト（外側の光） */
                    drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]
                    drop-shadow-[0_0_30px_rgba(79,70,229,0.5)]

                    /* 縁取り（よりクッキリさせる場合） */
                    [text-shadow:_0_0_10px_rgba(79,70,229,0.8),_0_0_20px_rgba(79,70,229,0.4)]
                  "
                >
                  {stamp.text}
                </p>

              </div>
            ))}
          </div>


          {/* 他者分 */}
          <div className="absolute left-0 top-0 w-full h-full text-[18px] md:text-[28px]">
            {list.map((li) => (
              <p
              key={`other-${li.id}`}
              className="absolute animate-float text-[#ffffff] font-bold"
              style={{
                left: `${li.left}%`,
              }}
              >
                {li.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <TiredButton
        handleSendStamp={handleSendStamp}
        words={words}
        disable={disable}
      />


      {/* 背景 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/scene1.png"
          alt="背景"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}

