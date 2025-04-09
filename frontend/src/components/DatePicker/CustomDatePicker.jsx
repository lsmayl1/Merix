import React, { useEffect, useState } from "react";
import "./index.css"; // Stil için ayrı bir dosya
import { DatePickIcon } from "../../assets/datePick";
import { LeftArrow, RightArrow } from "../../assets/Arrows";

const CustomDatePicker = ({ handleDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(getTodayRangeUTC()); // Varsayılan bugün
  const [showDatePick, setShowDatePick] = useState(false);

  const dateOptions = [
    { name: "Bügün", getRange: getTodayRangeUTC },
    { name: "Cari həftə", getRange: getCurrentWeekRangeUTC },
    { name: "Ötən həftə", getRange: getLastWeekRangeUTC },
    { name: "Cari ay", getRange: getCurrentMonthRangeUTC },
    { name: "Ötən ay", getRange: getLastMonthRangeUTC },
    { name: "3 ay", getRange: getLast3MonthsRangeUTC },
  ];
  useEffect(() => {
    if (selectedRange) {
      handleDate(selectedRange);
    }
  }, [selectedRange]);

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

  // UTC Date Range Functions
  function getTodayRangeUTC() {
    const now = new Date();
    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    return { from: start, to: end, value: start };
  }

  function getCurrentWeekRangeUTC() {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0)
    );
    const sunday = new Date(
      Date.UTC(
        monday.getUTCFullYear(),
        monday.getUTCMonth(),
        monday.getUTCDate() + 6,
        23,
        59,
        59,
        999
      )
    );
    return { from: monday, to: sunday };
  }

  function getLastWeekRangeUTC() {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day - 6 + (day === 0 ? -6 : 1);
    const monday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0)
    );
    const sunday = new Date(
      Date.UTC(
        monday.getUTCFullYear(),
        monday.getUTCMonth(),
        monday.getUTCDate() + 6,
        23,
        59,
        59,
        999
      )
    );
    return { from: monday, to: sunday };
  }

  function getCurrentMonthRangeUTC() {
    const now = new Date();
    const firstDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
    );
    const lastDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
    );
    return { from: firstDay, to: lastDay };
  }

  function getLastMonthRangeUTC() {
    const now = new Date();
    const firstDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0)
    );
    const lastDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999)
    );
    return { from: firstDay, to: lastDay };
  }

  function getLast3MonthsRangeUTC() {
    const now = new Date();
    const firstDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1, 0, 0, 0, 0)
    );
    const lastDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
    );
    return { from: firstDay, to: lastDay };
  }

  function formatDateRange(range) {
    if (!range.from) return "Tarix seçin";

    const formatUTC = (date) => {
      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      return `${day} ${month}, ${year}`;
    };

    const fromStr = formatUTC(range.from);
    if (!range.to) return fromStr;

    if (!range.to || range.from.getTime() === range.to.getTime()) {
      return fromStr;
    }
    const toStr = formatUTC(range.to);
    if (range.value) {
      return `${fromStr}`;
    }
    return `${fromStr} - ${toStr}`;
  }

  const weekdays = ["B.E", "Ç.A", "Ç.", "C.A", "C.", "Ş.", "B."];

  const getDaysInMonthUTC = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const days = [];

    const startDay = firstDay.getUTCDay() || 7;
    for (let i = 1; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getUTCDate(); i++) {
      days.push(new Date(Date.UTC(year, month, i)));
    }

    return days;
  };

  const days = getDaysInMonthUTC(currentDate);

  const handleDayClick = (day) => {
    if (!day) return;

    const utcDay = new Date(
      Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())
    );

    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      setSelectedRange({ from: utcDay, to: null });
    } else if (utcDay > selectedRange.from) {
      setSelectedRange({ ...selectedRange, to: utcDay });
    } else {
      setSelectedRange({ from: utcDay, to: null });
    }
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setUTCMonth(newDate.getUTCMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setUTCMonth(newDate.getUTCMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleOptionClick = (option) => {
    const newRange = option.getRange();
    setSelectedRange(newRange);
    setCurrentDate(newRange.from);
    setShowDatePick(true);
  };

  return (
    <div className="flex justify-end relative ">
      <div
        className="flex items-center justify-end h-20 gap-4 relative" // 'relative' eklendi
        style={{ zIndex: 20 }} // zIndex değeri eklendi
      >
        <h1 className="text-xl max-xl:text-lg max-xl:font-normal font-medium max-xs:text-[14px] truncate">
          {formatDateRange(selectedRange)}
        </h1>
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDatePick((prev) => !prev);
            }}
            className="rounded-full bg-gray-300 size-12 cursor-pointer flex items-center justify-center max-xs:size-10"
          >
            <DatePickIcon className={"max-xs:size-6"} />
          </button>
        </div>
      </div>

      {showDatePick && (
        <div
          className="flex absolute right-10 top-20"
          style={{ zIndex: 30, position: "absolute" }} // zIndex değerini 30 olarak güncelledik
        >
          {/* Seçenekler */}
          <div className="py-4 w-[90%] cursor-pointer rounded bg-white border border-newborder">
            <ul className="flex flex-col gap-1">
              {dateOptions.map((option) => (
                <li
                  key={option.name}
                  className="py-2 px-6 w-full rounded border-newborder hover:bg-gray-300"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Takvim */}
          <div className="calendar">
            <div className="header">
              <button onClick={prevMonth}>
                <LeftArrow />
              </button>
              <span className="text-xl">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth}>
                <RightArrow />
              </button>
            </div>
            <div className="weekdays">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="days">
              {days.map((day, index) => (
                <span
                  key={index}
                  className={
                    day
                      ? `day ${
                          selectedRange.from &&
                          day.getTime() === selectedRange.from.getTime()
                            ? "selected"
                            : ""
                        } ${
                          selectedRange.to &&
                          day.getTime() === selectedRange.to.getTime()
                            ? "selected"
                            : ""
                        } ${
                          selectedRange.from &&
                          selectedRange.to &&
                          day > selectedRange.from &&
                          day < selectedRange.to
                            ? "in-range"
                            : ""
                        }`
                      : "empty"
                  }
                  onClick={() => handleDayClick(day)}
                >
                  {day ? day.getDate() : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
