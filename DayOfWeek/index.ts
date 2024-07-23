// Leap years occur every 4 years, except for years that are divisble by 100 and not divisible by 400

class Day {
    private day: number;
    private month: number;
    private year: number;

    constructor(day: number, month: number, year: number) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    getDifferenceBetweenDates(date: Day): number {
        var laterDate: Day;
        if (date.year < this.year) {
            laterDate = this;
        } else if (date.year > this.year) {
            laterDate = date;
        } else {
            if (date.month < this.month) {
                laterDate = this;
            } else if (date.month > this.month) {
                laterDate = date;
            } else {
                if (date.day < this.day) {
                    laterDate = this;
                } else if (date.day > this.day) {
                    laterDate = date;
                } else {
                    return 0;
                }
            }
        }

        var earlierDate: Day = laterDate === this ? date : this;
        var days = 0;

        for (let i = earlierDate.year; i < laterDate.year; i++) {
            const leapYear = this.checkIsLeapYear(i);

            days += leapYear ? 366 : 365;
        }

        for (let i = earlierDate.month; i < laterDate.month; i++) {
            days += this.getDaysInMonth(i, laterDate.year);
        }

        days += laterDate.day - earlierDate.day;
        
        return days;
    }

    getDayOfWeek(date: Day): string {
        const daysBetween = this.getDifferenceBetweenDates(date);
        const dayOfWeek = daysBetween % 7;

        return days[dayOfWeek];
    }

    getDaysInMonth(month: number, year: number): number {
        switch (month) {
            case 1:
                return 31;
            case 2:
                return this.checkIsLeapYear(year) ? 29 : 28;
            case 3:
                return 31;
            case 4:
                return 30;
            case 5:
                return 31;
            case 6:
                return 30;
            case 7:
                return 31;
            case 8:
                return 31;
            case 9:
                return 30;
            case 10:
                return 31;
            case 11:
                return 30;
            case 12:
                return 31;
            default:
                return 0;
        }
    }

    checkIsLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }
}

const epoch = new Day(1, 1, 1);
const today = new Day(23, 7, 2024);
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

console.log(today.getDayOfWeek(epoch));