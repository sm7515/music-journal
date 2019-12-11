import React from "react";
import axios from 'axios';

export default function MakePost({ track, user}) {

    const newDate = new Date();
    let month = newDate.getMonth() + 1;
    let date = ('0' + newDate.getDate()).slice(-2);
    let day=newDate.getDay();
    const year = newDate.getFullYear();
    // console.log(month,date)

    switch (day) {
        case 0:
            day="Sunday"
            break;
        case 1:
            day = "Monday"
            break;
        case 2:
            day = "Tuesday"
            break;
        case 3:
            day = "Wednesday"
            break;
        case 4:
            day = "Thursday"
            break;
        case 5:
            day = "Friday"
            break;
        case 6:
            day = "Saturday"
            break;
        default:
            break;
    }

    switch (month) {
        case 1:
            month="Jan."
            break;
        case 2:
            month = "Feb."
            break;
        case 3:
            month = "Mar."
            break;
        case 4:
            month = "Apr."
            break;
        case 5:
            month = "May."
            break;
        case 6:
            month = "Jun."
            break;
        case 7:
            month = "Jul."
            break;
        case 8:
            month = "Aug."
            break;
        case 9:
            month = "Sept."
            break;
        case 10:
            month = "Oct."
            break;
        case 11:
            month = "Nov."
            break;
        case 12:
            month = "Dec."
            break;
        default:
            break;
    }

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        // console.log(e.currentTarget.thoughts.value)
        axios.post(`https://musicjournal-api.herokuapp.com/makepost`, {
            user: user,
            postContent: e.currentTarget.thoughts.value,
            track: track
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        setTimeout(function () {
            window.location.reload(true);
        }, 500);
    }

    return(
        <div className="make-post">
            <span className="date">
                <span className="dd">{date}</span>
                <span className="day-year">
                    <span className="day">{day}</span>
                    <span className="mmyy">{month} {year}</span>
                </span>
            </span>
            <form onSubmit={e => handleOnSubmit(e)} >
                <textarea name="thoughts" className="post-content" placeholder="make a post..."></textarea>
                <input type="submit" ></input>
            </form>
        </div>
    )
}