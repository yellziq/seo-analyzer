"use client";

type SettingsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps): React.JSX.Element {
  return (
    <section className="border border-red-300 bg-white p-5">
      <h2 className="font-semibold text-red-700">Ошибка настроек</h2>
      <p className="mt-2 text-sm">{error.message}</p>
      <button className="mt-4 border border-[#2563EB] bg-[#2563EB] px-4 py-2 text-white" onClick={reset} type="button">Повторить</button>
    </section>
  );
}
