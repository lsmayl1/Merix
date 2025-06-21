export const getDateRange = (filter) => {
  const now = new Date();

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

  const getStartOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const formatAzerbaijaniDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}`;
  };

  let start, end;

  switch (filter) {
    case "today":
      start = getStartOfDay(now);
      end = new Date(start.getTime() + 86400000);
      break;
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      start = getStartOfDay(yesterday);
      end = new Date(start.getTime() + 86400000);
      break;

    case "thisWeek":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      break;

    case "lastWeek":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay() - 7);
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      break;

    default:
      return {
        start: null,
        end: null,
        startFormatted: null,
        endFormatted: null,
      };
  }

  return {
    start,
    end,
    startFormatted: formatAzerbaijaniDate(start),
    endFormatted: formatAzerbaijaniDate(end),
  };
};
