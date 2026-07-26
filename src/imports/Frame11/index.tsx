function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-[125px]">
      <p className="[word-break:break-word] font-['Lato:Bold_Italic',sans-serif] italic leading-[normal] min-w-full relative shrink-0 text-[#023256] text-[10px] text-center w-[min-content]">Take it no matter the order</p>
      <div className="h-0 relative shrink-0 w-[50px]">
        <div className="absolute inset-[-0.3px_0_0_0]">
          <svg className="block size-full" fill="none" height="0.3" preserveAspectRatio="none" viewBox="0 0 50 0.3" width="50">
            <line id="Line 1" stroke="var(--stroke-0, black)" strokeWidth="0.3" x2="50" y1="0.15" y2="0.15" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Lato:Italic',sans-serif] italic leading-[normal] min-w-full relative shrink-0 text-[#023256] text-[10px] w-[min-content]">VIP Queue always has priority</p>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white border border-[#e4e4e4] border-solid content-stretch drop-shadow-[0px_1px_3.5px_white] flex flex-col items-center justify-center p-[16px] relative rounded-bl-[2px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] size-full">
      <Frame />
    </div>
  );
}