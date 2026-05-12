import { useState } from "react";

type Word = {
  id: number;
  word: string;
}

type Props = {
  words: Word[];
  handleSendStamp: (type: number) => Promise<void>;
  disable: boolean;
}

const TiredButton = ({words, handleSendStamp, disable}:Props) => {

// ...省略

const [currentIndex, setCurrentIndex] = useState(0);

const nextButton = () => {
  // 最後の次なら 0 (最初) に戻す
  setCurrentIndex((prev) => (prev + 1) % words.length);
};

const prevButton = () => {
  // 最初の前なら 最後 に戻す
  setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
};

const currentItem = words[currentIndex];

return (
  <div className="absolute z-[100] bottom-5 w-full flex justify-center items-center gap-8">

    {/* 左ボタン */}
    <button
      onClick={prevButton}
      className="
        /* 基本サイズと形状 */
        text-white text-3xl md:text-6xl p-4 md:p-6
        flex items-center justify-center
        rounded-2xl transition-all duration-200

        /* ガラス質感（背景） */
        bg-white/10 backdrop-blur-sm
        border border-white/20
        shadow-[0_4px_15px_rgba(0,0,0,0.1)]

        /* Hover時：光らせる */
        hover:bg-white/20
        hover:border-white/40
        hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
        hover:scale-110

        /* Active時：押し込む */
        active:scale-90
        active:bg-white/5
        active:shadow-inner
      "
    >
      <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">◀</span>
    </button>

    {/* 表示されるボタン（1つだけ） */}
    <div key={`button-${currentItem.id}`}>
      <label>
        <div>
          <button
            disabled={disable}
            onClick={() => handleSendStamp(currentItem.id)}
            className="
              /* 基本スタイル */
              w-40 h-40 md:w-60 md:h-60 rounded-full
              flex items-center justify-center
              text-white font-bold text-[28px] md:text-[42px]
              relative overflow-hidden
              transition-all duration-75

              /* 通常時の色と艶感 */
              bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-700
              shadow-[inner_0_2px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.2)]
              border-b-4 border-indigo-800
              before:absolute before:top-0 before:left-0 before:w-full before:h-1/2
              before:bg-gradient-to-b before:from-white/20 before:to-transparent

              /* 通常時のクリック動作 */
              active:transform active:scale-95
              active:shadow-[inner_0_4px_8px_rgba(0,0,0,0.3)]
              active:border-b-0 active:translate-y-1

              /* --- Hover時のアクション：ここを追加！ --- */
              hover:scale-105            /* 少し大きく浮き上がる */
              hover:brightness-110       /* 全体的に明るく */
              hover:border-b-[6px]       /* 厚みを増してより立体的に */
              hover:-translate-y-1       /* 上に持ち上がる */
              hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] /* 青白い後光を差す */

              /* --- Disable時のスタイル --- */
              /* 1. 色をグレーダウン & 艶消し */
              disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600
              disabled:text-gray-200 disabled:cursor-not-allowed

              /* 2. 反射光（before）を隠す */
              disabled:before:opacity-0

              /* 3. 物理的に凹ませる（borderを消して位置を下げる） */
              disabled:border-b-0
              disabled:translate-y-1
              disabled:scale-95

              /* 4. 影を内側のみにして「埋まった感」を出す */
              disabled:shadow-[inner_0_4px_8px_rgba(0,0,0,0.3)]
            "
          >
            {currentItem.word}
          </button>
        </div>
      </label>
    </div>

    {/* 右ボタン */}
    <button
      onClick={nextButton}
      className="
        /* 左ボタンと共通の基本スタイル */
        text-white text-3xl md:text-6xl p-4 md:p-6
        flex items-center justify-center
        rounded-2xl transition-all duration-200

        /* ガラス質感（背景） */
        bg-white/10 backdrop-blur-sm
        border border-white/20
        shadow-[0_4px_15px_rgba(0,0,0,0.1)]

        /* Hover時：光らせる */
        hover:bg-white/20
        hover:border-white/40
        hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
        hover:scale-110

        /* Active時：押し込む */
        active:scale-90
        active:bg-white/5
        active:shadow-inner
      "
    >
      <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">▶</span>
    </button>

  </div>
);

}
export default TiredButton
