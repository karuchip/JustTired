"use client"
import { useState, useRef } from "react";

type Stamp = {
  id: number;
  text: string;
  left: number;
}

type Word = {
  id: number;
  word: string;
}

export default function Home() {

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [disable, setDisable] = useState(false);
  const idRef = useRef(0);

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

  const tired = (type: number) => {

    if(disable) return;

    setDisable(true);

    const selected = words.find(item => item.id === type);
    if(!selected) return;

    const newStampId = ++idRef.current;

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


      <div className="flex gap-10 justify-center">
        {words.map((item) => (
          <div key={item.id} className="w-fit">
            <button
              disabled={disable}
              onClick={()=>tired(item.id)}
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
