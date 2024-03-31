import moment from "moment";

const convertToEventDate = (isoDateTime) => {
	var momentObj = moment(isoDateTime);

	var formattedDateTime = momentObj.format("YYYY-MM-DD HH:mm");

	return formattedDateTime;
};

export default convertToEventDate;
