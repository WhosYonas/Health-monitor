import Link from "next/link"

export function PatientOverview() {
  return (
    <div className="group h-[88px] bg-[#f3f6f8] border border-[#b6bec7] rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm font-['-apple-system,BlinkMacSystemFont,San_Francisco,Helvetica_Neue,Arial,sans-serif'] transition-all duration-300 hover:shadow-md hover:border-[#aab6c5] hover:-translate-y-[1px]">
      <img
        src="/user_default.png"
        alt="Patient profile"
        className="h-[56px] w-[56px] rounded-full border border-[#c8d0d8] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />

      <div className="w-[38%] h-[52px] px-4 rounded-xl bg-[#dfe5ea] border border-[#d4dbe2] flex items-center text-[20px] font-medium text-[#1f2933] tracking-[-0.01em] transition-colors duration-300 group-hover:bg-[#d4dae1]">
        Gunjärd Albertsson
      </div>

      <div className="flex flex-row gap-2 w-[32%]">
        <div className="group/card relative overflow-hidden h-[60px] w-1/3 rounded-xl bg-[#dfe5ea] border border-[#d4dbe2] flex items-end justify-center gap-1 px-3 py-3 transition-all duration-300 hover:bg-[#d0d8df] hover:border-[#b6bec7] hover:shadow-sm hover:-translate-y-[1px]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 via-transparent to-transparent opacity-80" />
            <svg
              viewBox="0 0 24 24"
              className="absolute right-1 top-1 h-9 w-9 text-red-400/10 animate-pulse"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21s-6.716-4.35-9.193-8.183C.917 9.89 2.02 5.77 5.63 4.45c2.06-.753 4.153.03 5.37 1.648 1.217-1.618 3.31-2.401 5.37-1.648 3.61 1.32 4.713 5.44 2.823 8.367C18.716 16.65 12 21 12 21z" />
            </svg>
            <div className="absolute inset-0 rounded-xl ring-1 ring-red-400/0 transition-all duration-300 group-hover/card:ring-red-400/10" />
          </div>

          <h1 className="relative z-10 text-[18px] font-semibold text-[#1f2933] tabular-nums transition-transform duration-300 group-hover/card:scale-[1.03]">
            83
          </h1>
          <h1 className="relative z-10 text-[13px] font-medium text-[#53616c]">
            bpm
          </h1>
        </div>

        <div className="group/card relative overflow-hidden h-[60px] w-1/3 rounded-xl bg-[#dfe5ea] border border-[#d4dbe2] flex items-end justify-center gap-1 px-3 py-3 transition-all duration-300 hover:bg-[#d0d8df] hover:border-[#b6bec7] hover:shadow-sm hover:-translate-y-[1px]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-transparent to-transparent opacity-80" />
            <svg
              viewBox="0 0 24 24"
              className="absolute right-1 top-1 h-9 w-9 text-orange-400/20 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z"
              />
            </svg>
            <div className="absolute inset-0 rounded-xl ring-1 ring-orange-400/0 transition-all duration-300 group-hover/card:ring-orange-400/10" />
          </div>

          <h1 className="relative z-10 text-[18px] font-semibold text-[#1f2933] tabular-nums transition-transform duration-300 group-hover/card:scale-[1.03]">
            36.5
          </h1>
          <h1 className="relative z-10 text-[13px] font-medium text-[#53616c]">
            °C
          </h1>
        </div>

        <div className="group/card relative overflow-hidden h-[60px] w-1/3 rounded-xl bg-[#dfe5ea] border border-[#d4dbe2] flex items-end justify-center gap-1 px-3 py-3 transition-all duration-300 hover:bg-[#d0d8df] hover:border-[#b6bec7] hover:shadow-sm hover:-translate-y-[1px]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-transparent to-transparent opacity-80" />
            <svg
              viewBox="0 0 24 24"
              className="absolute right-1 top-1 h-9 w-9 text-sky-400/20 transition-all duration-500 group-hover/card:scale-110 group-hover/card:-translate-y-0.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2.5C9.5 6.1 6 9.8 6 13.4A6 6 0 0018 13.4C18 9.8 14.5 6.1 12 2.5z" />
            </svg>
            <div className="absolute inset-0 rounded-xl ring-1 ring-sky-400/0 transition-all duration-300 group-hover/card:ring-sky-400/10" />
          </div>

          <h1 className="relative z-10 text-[18px] font-semibold text-[#1f2933] tabular-nums transition-transform duration-300 group-hover/card:scale-[1.03]">
            98%
          </h1>
          <h1 className="relative z-10 text-[13px] font-medium text-[#53616c]">
            SpO2
          </h1>
        </div>
      </div>

      <Link href="/details"
        className="ml-auto h-[52px] px-5 rounded-xl bg-[#1f2933] text-white font-medium text-[14px] tracking-[-0.01em] hover:bg-[#17212b] transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 cursor-pointer flex items-center"
        >
        Show details
        </Link>
    </div>
  );
}
