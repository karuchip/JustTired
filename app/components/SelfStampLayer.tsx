import { StampType } from "@/src/type";

const SelfStampLayer = ({stamps}:{stamps:StampType[]}) => {

  return (
    <>
      {/* 自分が押下した分の表示 */}
      <div className="absolute left-0 top-0 w-full h-full">
      {stamps.map((stamp) => (
        <div key={`self-${stamp.id}`}>

          <p
          className="
            absolute animate-float-mine font-bold text-[26px] md:text-[42px] whitespace-nowrap
            px-6 py-1 bg-white/50 rounded-full

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
    </>
  );
}

export default SelfStampLayer;
