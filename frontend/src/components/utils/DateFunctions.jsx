export const FormatDate = (isoString) => {
  const date = new Date(isoString);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  // Gün, ay və il
  const days = date.getDate().toString().padStart(2, "0");
  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avqust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Saat, dəqiqə və saniyə
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  if (isToday) {
    return `Bugün , ${hours}:${minutes}:${seconds}`;
  }
  // Tarix və vaxtı birləşdir
  return `${days} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
};
