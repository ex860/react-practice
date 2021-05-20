import React from 'react';
import Calendar from './Calendar';
import './DatePicker.scss';

export default class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        const curDateObj = new Date();
        this.yearOfToday = curDateObj.getFullYear();
        this.monthOfToday = curDateObj.getMonth() + 1;
        this.dateOfToday = curDateObj.getDate();
        this.state = {
            selectedDay: {
                year: this.yearOfToday,
                month: this.monthOfToday,
                date: this.dateOfToday,
            },
            inputDate: '',
            show: false,
        };
    }
    handleUpdate = (newDay) => {
        const { year, month, date } = newDay;
        this.setState({
            selectedDay: newDay,
            inputDate: `${year}-${String(month).padStart(2, '00')}-${String(date).padStart(2, '00')}`,
            show: false,
        });
    };
    inputChange = (event) => {
        const { value } = event.target;
        this.setState({ inputDate: value });
    };
    onEnterPress = (event) => {
        if (event.key === 'Enter') {
            const { inputDate } = this.state;
            const dateObj = new Date(inputDate);
            if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate) && !Number.isNaN(Number(dateObj))) {
                this.setState({
                    selectedDay: {
                        year: Number(inputDate.split('-')[0]),
                        month: Number(inputDate.split('-')[1]),
                        date: Number(inputDate.split('-')[2]),
                    },
                    show: false,
                });
            }
        }
    };
    setShow = (newState) => {
        this.setState({ show: newState });
    };
    render() {
        return (
            <div className="content">
                <div className="input-div">
                    <input
                        placeholder="YYYY-MM-DD"
                        value={this.state.inputDate}
                        onChange={this.inputChange}
                        onFocus={() => {
                            this.setShow(true);
                        }}
                        onKeyPress={this.onEnterPress}
                    />
                </div>
                {this.state.show ? (
                    <Calendar
                        selectedDay={this.state.selectedDay}
                        updateSelectedDay={this.handleUpdate}
                        today={{
                            year: this.yearOfToday,
                            month: this.monthOfToday,
                            date: this.dateOfToday,
                        }}
                    />
                ) : null}
            </div>
        );
    }
}
