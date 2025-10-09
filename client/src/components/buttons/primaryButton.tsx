export const PrimaryButton = ({ label }: { label: string }) => {
  return (
    <button className="p-2 px-4 rounded-xl cursor-pointer bg-black text-white text-xl font-semibold">
      {label}
    </button>
  );
};
