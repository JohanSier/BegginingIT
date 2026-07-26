export default function Container() {
  return (
    <div className="bg-white border border-[#e4e4e4] border-solid content-stretch drop-shadow-[0px_1px_3.5px_white] flex flex-col items-center justify-center p-[16px] relative rounded-[8px] size-full" data-name="Container">
      <p className="[word-break:break-word] font-['Lato:Italic',sans-serif] italic leading-[0] relative shrink-0 text-[10px] text-black text-center w-[136px]">
        <span className="leading-[19.5px]">{`We treat tickets as urgent if an issue completely `}</span>
        <span className="font-['Lato:Bold_Italic',sans-serif] leading-[19.5px]">stops</span>
        <span className="leading-[19.5px]">{` users from doing their work, or if it creates a security risk for the company (like a `}</span>
        <span className="font-['Lato:Bold_Italic',sans-serif] leading-[19.5px]">hacked account)</span>
      </p>
    </div>
  );
}