import * as Realm from "realm-web";

export const useRealmApp = () => {
	const config = useRuntimeConfig();
	const app = new Realm.App({ id: config.public.realmAppId });

	const bookingCol = async () => {
		const credentials = Realm.Credentials.anonymous();
		await app.logIn(credentials);

		const mongo = app.currentUser.mongoClient("mongodb-atlas");
		const collection = mongo.db("calendar").collection("bookings");

		return collection;
	};

	const getAllBookings = async () => {
		const col = await bookingCol();
		const data = await col.find();

		return data;
	};

	return {
		bookingCol,
		getAllBookings,
	};
};
