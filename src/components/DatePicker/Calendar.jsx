import React from 'react';
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

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPhase: 'date',
            currentYear: props.selectedDay.year,
            currentMonth: props.selectedDay.month,
            years: [],
        };
    }

    onArrowClick = (dir) => {
        switch (this.state.currentPhase) {
            default:
            case 'date':
                if (dir === 'next') {
                    if (this.state.currentMonth !== 12) {
                        this.setState({ currentMonth: this.state.currentMonth + 1 });
                    } else {
                        this.setState({
                            currentMonth: 1,
                            currentYear: this.state.currentYear + 1,
                        });
                    }
                } else {
                    if (this.state.currentMonth !== 1) {
                        this.setState({ currentMonth: this.state.currentMonth - 1 });
                    } else {
                        this.setState({
                            currentMonth: 12,
                            currentYear: this.state.currentYear - 1,
                        });
                    }
                }
                break;
            case 'month':
                this.setState({ currentYear: this.state.currentYear + (dir === 'next' ? 1 : -1) });
                break;
            case 'year':
                const nextYear = this.state.currentYear + (dir === 'next' ? 10 : -10);
                this.setState({ currentYear: nextYear });
                this.genYears(nextYear);
                break;
        }
    };
    toYearPhase = () => {
        this.setState({ currentPhase: 'year' });
        this.genYears(this.state.currentYear);
    };
    genYears = (year) => {
        let array1d = Array.from(Array(12).keys()).map((n) => n + year - (year % 10) - 1);
        this.setState({
            years: [array1d.slice(0, 4), array1d.slice(4, 8), array1d.slice(8, 12)],
        });
    };
    handleDateClick = (obj) => {
        let year = this.state.currentYear;
        let month = this.state.currentMonth;
        let date = obj.date;
        if (!obj.isCurrent) {
            // to prev month
            if (obj.date > 20) {
                this.onArrowClick('prev');
                if (month !== 1) {
                    month--;
                } else {
                    month = 12;
                    year--;
                }
                // to next month
            } else {
                this.onArrowClick('next');
                if (month !== 12) {
                    month++;
                } else {
                    month = 1;
                    year++;
                }
            }
        }
        this.props.updateSelectedDay({ year, month, date });
    };
    handleMonthClick = (month) => {
        this.setState({
            currentMonth: month,
            currentPhase: 'date',
        });
    };
    handleYearClick = (year) => {
        this.setState({
            currentYear: year,
            currentPhase: 'month',
        });
    };
    renderHeaderTitle = () => {
        switch (this.state.currentPhase) {
            default:
            case 'date':
                return (
                    <strong className="pointer" onClick={() => this.setState({ currentPhase: 'month' })}>
                        {`${mapMonthString(this.state.currentMonth)} ${this.state.currentYear}`}
                    </strong>
                );
            case 'month':
                return (
                    <strong className="pointer" onClick={this.toYearPhase}>
                        {this.state.currentYear}
                    </strong>
                );
            case 'year':
                if (this.state.years.length >= 3) {
                    return <strong>{`${this.state.years[0][1]} - ${this.state.years[2][2]}`}</strong>;
                }
                return null;
        }
    };
    renderTable = () => {
        switch (this.state.currentPhase) {
            default:
            case 'date':
                return (
                    <DateTable
                        currentYear={this.state.currentYear}
                        currentMonth={this.state.currentMonth}
                        handleClick={this.handleDateClick}
                        today={this.props.today}
                        selectedDay={this.props.selectedDay}
                    />
                );
            case 'month':
                return (
                    <MonthTable
                        currentYear={this.state.currentYear}
                        selectedDay={this.props.selectedDay}
                        handleClick={this.handleMonthClick}
                    />
                );
            case 'year':
                return (
                    <YearTable
                        handleClick={this.handleYearClick}
                        selectedDay={this.props.selectedDay}
                        years={this.state.years}
                    />
                );
        }
    };
    render() {
        return (
            <div>
                <div className="container">
                    <div className="header">
                        <button onClick={() => this.onArrowClick('prev')}>&lt;</button>
                        <span>{this.renderHeaderTitle()}</span>
                        <button onClick={() => this.onArrowClick('next')}>&gt;</button>
                    </div>
                    {this.renderTable()}
                </div>
            </div>
        );
    }
}
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
