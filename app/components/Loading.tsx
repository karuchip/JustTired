const Loading = () => {
  const text = "Loading....";
  const charArray = text.split("");

  return (
    <div className="w-fit mx-auto mt-60 md:mt-100">
      <div className="md:px-20 py-10 text-[20px] md:text-[32px] text-white flex">
        {charArray.map((char, index) => (
          <span
            key={index}
            // 動き自体を2秒（ゆっくり）にし、0.18秒ずつ遅らせる
            className="inline-block animate-[bounce_2s_infinite]"
            style={{
              animationDelay: `${index * 0.18 - 2}s`,
            }}
          >
            {/* 空白文字が詰まらないように処理 */}
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading
