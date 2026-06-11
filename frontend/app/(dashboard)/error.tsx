"use client";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps): React.JSX.Element {
  return (
    <section className="border border-red-300 bg-white p-5">
      <h2 className="text-lg font-semibold text-red-700">Ошибка панели</h2>
      <p className="mt-2 text-sm text-neutral-600">{error.message}</p>
      <button className="mt-4 border border-[#2563EB] bg-[#2563EB] px-4 py-2 font-semibold text-white" onClick={reset} type="button">
        Попробовать снова
      </button>
    </section>
  );
}
