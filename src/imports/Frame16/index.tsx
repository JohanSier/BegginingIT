import svgPaths from "./svg-6j283985rt";

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative size-full">
      <p className="[word-break:break-word] font-['Lato:Italic',sans-serif] italic leading-[19.5px] relative shrink-0 text-[13px] text-[rgba(255,255,255,0.75)] whitespace-nowrap">Is it an urgent ticket?</p>
      <div className="relative shrink-0 size-[11px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
          <path d={svgPaths.p127e3f00} fill="var(--fill-0, #BFBFBF)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}