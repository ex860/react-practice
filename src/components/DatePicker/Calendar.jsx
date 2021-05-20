import React, { useState } from 'react';
import './Calendar.scss';
import className from 'classnames';
import classNames from 'classnames';

const DateTable = (props) => {
    const isToday = (obj) => {
        return (
            obj.date === props.today.date &&
            props.currentYear === props.today.year &&
            props.currentMonth === props.today.month
        );
    };
    const isSelected = (obj) => {
        return (
            obj.isCurrent &&
            obj.date === props.selectedDay.date &&
            props.selectedDay.year === props.currentYear &&
            props.selectedDay.month === props.currentMonth
        );
    };
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <td key={day}>{day}</td>);
    const thead = <tr>{days}</tr>;
    const trList = weeks(props.currentYear, props.currentMonth).map((tr, index) => (
        <tr key={index}>
            {tr.map((item) => (
                <td
                    key={`${item.date}_${item.isCurrent}`}
                    className={className('date-content', {
                        'is-not-current': !item.isCurrent,
                        'is-selected': isSelected(item),
                        'is-today': isToday(item),
                    })}
                    onClick={() => props.handleClick(item)}
                >
                    {item.date}
                </td>
            ))}
        </tr>
    ));
    return (
        <table className="date-phase">
            <tbody>
                {thead}
                {trList}
            </tbody>
        </table>
    );
};
const MonthTable = (props) => {
    const isSelectedMonth = (month) => {
        return props.selectedDay.year === props.currentYear && props.selectedDay.month === month;
    };
    const monthNumber = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
    ];
    const renderTdList = (tr) => {
        return tr.map((month) => (
            <td
                key={month}
                className={classNames({
                    'is-selected': isSelectedMonth(month),
                })}
                onClick={() => props.handleClick(month)}
            >
                {mapMonthString(month)}
            </td>
        ));
    };
    const renderTrList = () => {
        return monthNumber.map((tr, index) => <tr key={index}>{renderTdList(tr)}</tr>);
    };
    return (
        <table className="month-phase">
            <tbody>{renderTrList()}</tbody>
        </table>
    );
};
const YearTable = (props) => {
    const isSelectedYear = (year) => {
        return props.selectedDay.year === year;
    };
    const renderTdList = (tr, trIdx) => {
        return tr.map((year, tdIdx) => (
            <td
                key={year}
                className={classNames({
                    'is-not-current': (trIdx === 0 && tdIdx === 0) || (trIdx === 2 && tdIdx === 3),
                    'is-selected': isSelectedYear(year),
                })}
                onClick={() => props.handleClick(year)}
            >
                {year}
            </td>
        ));
    };
    const renderTrList = () => {
        return props.years.map((tr, index) => <tr key={index}>{renderTdList(tr, index)}</tr>);
    };
    return (
        <table className="month-phase">
            <tbody>{renderTrList()}</tbody>
        </table>
    );
};
const Calendar = (props) => {
    const [currentPhase, setCurrentPhase] = useState('date');
    const [currentYear, setCurrentYear] = useState(props.selectedDay.year);
    const [currentMonth, setCurrentMonth] = useState(props.selectedDay.month);
    const [years, setYears] = useState([]);

    const onArrowClick = (dir) => {
        switch (currentPhase) {
            default:
            case 'date':
                if (dir === 'next') {
                    if (currentMonth !== 12) {
                        setCurrentMonth((prev) => prev + 1);
                    } else {
                        setCurrentMonth(1);
                        setCurrentYear((prev) => prev + 1);
                    }
                } else {
                    if (currentMonth !== 1) {
                        setCurrentMonth((prev) => prev - 1);
                    } else {
                        setCurrentMonth(12);
                        setCurrentYear((prev) => prev - 1);
                    }
                }
                break;
            case 'month':
                setCurrentYear((prev) => prev + (dir === 'next' ? 1 : -1));
                break;
            case 'year':
                const nextYear = currentYear + (dir === 'next' ? 10 : -10);
                setCurrentYear(nextYear);
                genYears(nextYear);
                break;
        }
    };
    const toYearPhase = () => {
        setCurrentPhase('year');
        genYears(currentYear);
    };
    const genYears = (year) => {
        let array1d = Array.from(Array(12).keys()).map((n) => n + year - (year % 10) - 1);
        setYears([array1d.slice(0, 4), array1d.slice(4, 8), array1d.slice(8, 12)]);
    };
    const handleDateClick = (obj) => {
        let year = currentYear;
        let month = currentMonth;
        let date = obj.date;
        if (!obj.isCurrent) {
            // to prev month
            if (obj.date > 20) {
                onArrowClick('prev');
                if (month !== 1) {
                    month--;
                } else {
                    month = 12;
                    year--;
                }
                // to next month
            } else {
                onArrowClick('next');
                if (month !== 12) {
                    month++;
                } else {
                    month = 1;
                    year++;
                }
            }
        }
        props.updateSelectedDay({ year, month, date });
    };
    const handleMonthClick = (month) => {
        setCurrentMonth(month);
        setCurrentPhase('date');
    };
    const handleYearClick = (year) => {
        setCurrentYear(year);
        setCurrentPhase('month');
    };
    const renderHeaderTitle = () => {
        switch (currentPhase) {
            default:
            case 'date':
                return (
                    <strong className="pointer" onClick={() => setCurrentPhase('month')}>
                        {`${mapMonthString(currentMonth)} ${currentYear}`}
                    </strong>
                );
            case 'month':
                return (
                    <strong className="pointer" onClick={toYearPhase}>
                        {currentYear}
                    </strong>
                );
            case 'year':
                if (years.length >= 3) {
                    return <strong>{`${years[0][1]} - ${years[2][2]}`}</strong>;
                }
                return null;
        }
    };
    const renderTable = () => {
        switch (currentPhase) {
            default:
            case 'date':
                return (
                    <DateTable
                        currentYear={currentYear}
                        currentMonth={currentMonth}
                        handleClick={handleDateClick}
                        today={props.today}
                        selectedDay={props.selectedDay}
                    />
                );
            case 'month':
                return (
                    <MonthTable
                        currentYear={currentYear}
                        selectedDay={props.selectedDay}
                        handleClick={handleMonthClick}
                    />
                );
            case 'year':
                return <YearTable handleClick={handleYearClick} selectedDay={props.selectedDay} years={years} />;
        }
    };
    return (
        <div>
            <div className="container">
                <div className="header">
                    <button onClick={() => onArrowClick('prev')}>&lt;</button>
                    <span>{renderHeaderTitle()}</span>
                    <button onClick={() => onArrowClick('next')}>&gt;</button>
                </div>
                {renderTable()}
            </div>
        </div>
    );
};
const mapMonthString = (month) => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
};
const getLastDate = (year, month) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            return isLeapYear ? 29 : 28;
        default:
            return null;
    }
};
const weeks = (year, month) => {
    const curLastDate = getLastDate(year, month);
    let prevlastDate;
    if (month === 1) {
        prevlastDate = getLastDate(year - 1, 12);
    } else {
        prevlastDate = getLastDate(year, month - 1);
    }

    if (month === 1 || month === 2) {
        month += 12;
        year--;
    }
    const c = Math.floor(year / 100);
    const y = year % 100;
    const m = month;

    // Zeller Algorithm
    const w = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor((26 * (m + 1)) / 10)) % 7;
    let firstDay = w >= 0 ? w : (w + 7) % 7;

    let curMonthWeeks = [];
    let tmp = [];

    // previous month date filling
    for (let _ = firstDay; _ > 0; _--) {
        tmp.unshift({ date: prevlastDate, isCurrent: false });
        prevlastDate--;
    }

    // current and next month date filling
    let date = 1;
    let isCurrent = true;
    while (!(tmp.length === 7 && curMonthWeeks.length === 6)) {
        if (tmp.length === 7) {
            curMonthWeeks.push(tmp);
            tmp = [];
        }
        tmp.push({ date, isCurrent });
        date++;
        if (date > curLastDate) {
            date = 1;
            isCurrent = false;
        }
    }
    return curMonthWeeks;
};
export default Calendar;
