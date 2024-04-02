import moment from "moment";

const convertToEventDate = (dateTime) => {
	var momentObj = moment(dateTime);

	var formattedDate = momentObj.format("YYYY-MM-DD");

	return formattedDate;
};

export default convertToEventDate;
