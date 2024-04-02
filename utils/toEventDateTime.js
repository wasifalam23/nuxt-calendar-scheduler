import moment from "moment";

const convertToEventDateTime = (dateTime) => {
	var momentObj = moment(dateTime);

	var formattedDateTime = momentObj.format("YYYY-MM-DD HH:mm");

	return formattedDateTime;
};

export default convertToEventDateTime;
