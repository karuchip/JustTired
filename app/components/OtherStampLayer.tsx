import { StampType } from "@/src/type";

const OtherStampLayer = ({ list }: { list: StampType[] }) => {
  return(
    <div className="absolute left-0 top-0 w-full h-full text-[18px] md:text-[28px]">
      {list.map((li) => (
        <p
        key={`other-${li.id}`}
        className="absolute animate-float-other text-gray font-bold"
        style={{
          left: `${li.left}%`,
        }}
        >
          {li.text}
        </p>
      ))}
    </div>
  );
}

export default OtherStampLayer;
