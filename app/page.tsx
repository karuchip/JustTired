"use client"
import { useState, useRef, useEffect } from "react";

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
    }
  ]

  // DBから取得
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/tired');
      const data: TiredItem[] = await res.json();

      setList(
        data.map((item: TiredItem) => {
          return {
            id: item.id,
            text: item.text || '',
            left: Math.random() * 80
          };
        })
      );

      console.log(data);
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [])


  // 疲れたボタン押下時
  const handleSendStamp = async(type: number) => {

    if(disable) return;

    setDisable(true);

    const selected = words.find(item => item.id === type);
    if(!selected) return;

    const newStampId = ++idRef.current;

    await fetch('/api/tired', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: selected.word })
    });

    // スタンプ追加
    setStamps((prev) => [
      ...prev,
      {
        id: newStampId,
        text: selected.word,
        left: Math.random() * 80
      }
    ]);

    // 一定時間ごに削除
    setTimeout(() => {
      setStamps((prev) => prev.filter(s => s.id !== newStampId));
    }, 20000);

    setTimeout(() => {
      setDisable(false);
    }, 2000);
  };

  return (
    <>
      {/* 自分が押下した分の表示 */}
      <div className="relative h-[200px] border m-10">
        {stamps.map((stamp) => (
          <p
            key={stamp.id}
            className="absolute animate-float text-indigo-500 font-bold"
            style={{
              left: `${stamp.left}%`,
            }}
          >
            {stamp.text}
          </p>
        ))}
      </div>

      {/* 他者分 */}
      <div className="relative h-[200px] border m-10">
        {list.map((li) => (
          <p
            key={li.id}
            className="absolute animate-float text-indigo-500 font-bold"
            style={{
              left: `${li.left}%`,
            }}
          >
            {li.text}
          </p>
        ))}
      </div>


      <div className="flex gap-10 justify-center">
        {words.map((item) => (
          <div key={item.id} className="w-fit">
            <button
              disabled={disable}
              onClick={()=>handleSendStamp(item.id)}
              className="disabled:text-gray-500 bg-indigo-500 text-white px-3"
            >
              {item.word}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

