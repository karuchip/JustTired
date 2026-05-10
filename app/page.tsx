"use client"
import { getAnonymousId } from "@/src/lib/anonymousUser";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import TiredButton from "./components/tired-button";
import { StampType} from "@/src/type";
import SelfStampLayer from "./components/SelfStampLayer";
import OtherStampLayer from "./components/OtherStampLayer";
import { POLLING_INTERVAL, COUNT_INTERVAL, STAMP_DURATION } from "@/src/lib/constants/intervalConstants";
import { fetchInitialTiredData, fetchTiredPost, sendTiredPost } from "@/src/lib/api/tiredApi";
import usePolling from "@/src/lib/hooks/usePolling";
import fetchCount from "@/src/lib/api/tiredStatsApi";
import { words } from "@/src/lib/constants/stampWordConstants";


export default function Home() {

  const [stamps, setStamps] = useState<StampType[]>([]);
  const [disable, setDisable] = useState(false);
  const idRef = useRef(0);
  // DBから取得した値
  const [list, setList] = useState<StampType[]>([]);
  // 一度表示したスタンプのidは保存
  const lastIdRef = useRef(0);
  // 疲れた件数を保存
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  // 初期化終わるまでfetchしないためのフラグ
  const [isReadyToPoll, setIsReadyToPoll] = useState(false);
  // 匿名ID保存用のref
  const anonymousIdRef = useRef<string | null>(null)

  // 初期化処理 (現在のID)
  useEffect(() => {
    const init = async () => {

      // ①匿名ID準備
      anonymousIdRef.current = getAnonymousId();

      // ②DBから現在の最大投稿IDを取得
      const dataMaxId = await fetchInitialTiredData()

      lastIdRef.current = dataMaxId;

      // ③DBから疲れたカウント数を取得
      const resCount = await fetch('/api/tired/stats')
      const dataCount = await resCount.json();
      setDailyCount(dataCount.daily_count);
      setTotalCount(dataCount.total_count);

      // ④初期化完了
      setIsReadyToPoll(true);
    };
    init();
  }, []);


  // 投稿ポーリング取得用関数
  const handleFetchPosts = useCallback(async () => {

    // api通信
    const data = await fetchTiredPost({
      lastId: lastIdRef.current,
      anonymousId: anonymousIdRef.current!,
    })

    setList(prev => {

      const existingIds = new Set(prev.map(p => p.id));

      const newItems = data
        .filter(item => !existingIds.has(item.id))
        .map(item => ({
          id: item.id,
          text: item.text,
          left: Math.random() * 80
        }));

        if(data.length > 0) {
          lastIdRef.current = data[data.length - 1]. id;
        }

        return [...prev, ...newItems];
    });
  }, []);


  // 投稿の差分取得 ポーリングにて3秒ごとに
  usePolling({
    enabled: isReadyToPoll,
    interval: POLLING_INTERVAL,
    callback: handleFetchPosts,
  })


  // 疲れた件数の取得　ポーリングで10秒ごとに
  usePolling({
    enabled: isReadyToPoll,
    interval: COUNT_INTERVAL,
    callback: () => fetchCount({ setDailyCount, setTotalCount })
  })


  // 疲れたボタン押下時の処理
  const handleSendStamp = async(type: number) => {

    if(disable) return;

    setDisable(true);

    const selected = words.find(item => item.id === type);
    if(!selected) return;

    // ⓪画面上の疲れたカウントをプラス1
    setTotalCount(prev => prev + 1);
    setDailyCount(prev => prev + 1);

    // ①画面上に疲れたを表示
    const newStampId = ++idRef.current;
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
    }, STAMP_DURATION);


    // ③バックグラウンドで投稿とカウントをDBに保存
    await sendTiredPost({selected, anonymousId: anonymousIdRef.current!})

    setTimeout(() => {
      setDisable(false);
    }, 1000);
  };

  return (
    <div>

      <div className="relative z-100">

        <div className="mt-10 mx-auto md:m-10 bg-white/50 py-3 px-10 w-fit text-indigo-700 rounded-full md:text-[24px]">
          <p>これまでの「疲れた」: <span className="font-bold">{totalCount}回</span></p>
          <p>今日の「疲れた」: <span className="font-bold">{dailyCount}回</span></p>
        </div>
        <div className="mt-10">
          <h1 className="text-[#ffffff] text-[32px] md:text-[68px] w-fit mx-auto">Just Tired</h1>
          <h2 className="text-[#ffffff] w-fit mx-auto text-[16px] md:text-[22px]">疲れたって言いたい！</h2>
        </div>

        <div className="relative h-[500px] md:h-[600px] my-10 overflow-x-hidden">
          {/* 自分の分 */}
          <SelfStampLayer stamps={stamps}/>
          {/* 他者分 */}
          <OtherStampLayer list={list}/>
        </div>

      </div>

      <TiredButton
        handleSendStamp={handleSendStamp}
        words={words}
        disable={disable}
      />


      {/* 背景イメージ */}
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

