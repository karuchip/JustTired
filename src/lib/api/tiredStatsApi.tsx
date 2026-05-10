import { CountItemType } from "@/src/type";
import { Dispatch, SetStateAction } from "react";

type FetchCountProps = {
  setDailyCount: Dispatch<SetStateAction<number>>
  setTotalCount: Dispatch<SetStateAction<number>>;
}

const fetchCount = async({setDailyCount, setTotalCount}:FetchCountProps) => {

  const res = await fetch(`api/tired/stats`);
  const data:CountItemType = await res.json();

  if(res.ok) {
    setDailyCount(data.daily_count);
    setTotalCount(data.total_count);
  } else {
    throw new Error("カウント取得失敗")
  }

}

export default fetchCount;
