import React, { useState } from 'react';
import Calendar from './Calendar';
import './DatePicker.scss';

const DatePicker = () => {
    const curDateObj = new Date();
    const yearOfToday = curDateObj.getFullYear();
    const monthOfToday = curDateObj.getMonth() + 1;
    const dateOfToday = curDateObj.getDate();
    const [selectedDay, setSelectedDay] = useState({
        year: yearOfToday,
        month: monthOfToday,
        date: dateOfToday,
    });
    const [inputDate, setInputDate] = useState('');
    const [show, setShow] = useState(false);
    const handleUpdate = (newDay) => {
        const { year, month, date } = newDay;
        setSelectedDay(newDay);
        setInputDate(`${year}-${String(month).padStart(2, '00')}-${String(date).padStart(2, '00')}`);
        setShow(false);
    };
    const inputChange = (event) => {
        setInputDate(event.target.value);
    };
    const onEnterPress = (event) => {
        if (event.key === 'Enter') {
            const dateObj = new Date(inputDate);
            if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate) && !Number.isNaN(Number(dateObj))) {
                setSelectedDay({
                    year: Number(inputDate.split('-')[0]),
                    month: Number(inputDate.split('-')[1]),
                    date: Number(inputDate.split('-')[2]),
                });
                setShow(false);
            }
        }
    };
    return (
        <div className="content">
            <div className="input-div">
                <input
                    placeholder="YYYY-MM-DD"
                    value={inputDate}
                    onChange={inputChange}
                    onFocus={() => {
                        setShow(true);
                    }}
                    onKeyPress={onEnterPress}
                />
            </div>
            {show ? (
                <Calendar
                    selectedDay={selectedDay}
                    updateSelectedDay={handleUpdate}
                    today={{
                        year: yearOfToday,
                        month: monthOfToday,
                        date: dateOfToday,
                    }}
                />
            ) : null}
        </div>
    );
};
export default DatePicker;
